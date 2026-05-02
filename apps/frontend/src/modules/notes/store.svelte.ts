import type { AllNotes, Directory, Note } from "./types";
import { page } from "$app/state";
import { shell } from "features/shell/store.svelte";
import { client } from "lib/api";
import { comparePositions, nextPositionAfter } from "lib/position";

interface CreateDirectoryParams {
	moduleType: "NOTES" | "ARCHIVE";
}

interface CreateNoteParams {
	directoryId?: string | null;
}

export const EMPTY_DOCUMENT = {
	type: "doc",
	content: [{ type: "paragraph" }],
};

class NotesStore {
	#noteTree = $state<AllNotes | null>(null);
	editingDirectoryId = $state<string | null>(null);

	tree = $derived.by(() => {
		const noteTree = this.#noteTree
		if (!noteTree) return [];

		return [...noteTree.directories, ...noteTree.notes].sort((a, b) => comparePositions(a.positionIdx, b.positionIdx))
	})

	allNotes = $derived.by(() => {
		const noteTree = this.#noteTree;
		if (!noteTree) return [];

		return [...noteTree.directories.flatMap((directory) => directory.notes), ...noteTree.notes];
	})

	currentNote = $derived.by(() => {
		const activeTab = shell.activeTab;
		if (activeTab?.type !== "NOTES" || !activeTab.noteId) return null;

		return this.findNote(activeTab.noteId);
	})

	async init() {
		const [data, err] = await client.get("/api/v1/notes", {}).safe();

		if (err) {
			console.error(err);
			return;
		}

		this.#noteTree = data;

		if (page.params.note_id) {
			shell.openNote({ noteId: page.params.note_id });
		}
	}

	async open(noteId: string) {
		const match = this.findNote(noteId);

		if (!match) return;

		shell.openNote({ noteId: match.id });
	}

	findNote(noteId: string) {
		return this.allNotes.find((note) => note.id === noteId) ?? null;
	}

	findDirectory(directoryId: string) {
		return (
			this.#noteTree?.directories.find(
				(directory) => directory.id === directoryId,
			) ?? null
		);
	}

	addStandaloneNote(note: Note) {
		if (!this.#noteTree) {
			this.#noteTree = { directories: [], notes: [note] };
			return;
		}

		this.#noteTree.notes.push(note);
	}

	updateNote(noteId: string, patch: Partial<Note>) {
		const note = this.findNote(noteId);
		if (!note) return;

		Object.assign(note, patch);
	}

	async createDirectory({ moduleType }: CreateDirectoryParams) {
		const lastItem = this.tree.at(-1)
		const body = {
			title: "New directory",
			positionIdx: nextPositionAfter(lastItem),
			type: moduleType,
		};
		const [data, error] = await client
			.post("/api/v1/directories/create", { body })
			.safe();

		if (error) {
			console.error(error);
			return;
		}

		const directory: Directory = {
			...data.data.directory,
			notes: [],
		};

		if (!this.#noteTree) {
			this.#noteTree = { directories: [directory], notes: [] };
			this.editingDirectoryId = directory.id;
			return;
		}

		this.#noteTree.directories.push(directory);
		this.editingDirectoryId = directory.id;
	}

	async createNote({ directoryId = null }: CreateNoteParams = {}) {
		if (!this.#noteTree) await this.init();
		if (!this.#noteTree) return;

		const directory = directoryId ? this.findDirectory(directoryId) : null;
		if (directoryId && !directory) return;

		const siblings = directory ? directory.notes : this.tree;
		const lastSibling = siblings.at(-1);
		const note: Note = {
			id: crypto.randomUUID(),
			title: "",
			cover: null,
			content: "",
			rawContent: EMPTY_DOCUMENT,
			directoryId,
			positionIdx: nextPositionAfter(lastSibling),
			isDeleted: false,
			createdAt: null,
			updatedAt: null,
		};

		const [, error] = await client
			.post("/api/v1/notes/save", {
				body: {
					id: note.id,
					directoryId: note.directoryId,
					positionIdx: note.positionIdx,
					title: note.title,
					rawContent: note.rawContent,
					content: note.content,
				},
			})
			.safe();

		if (error) {
			console.error(error);
			return;
		}

		if (!note.directoryId) this.addStandaloneNote(note)
		if (directory) directory.notes.push(note)
		shell.openNote({ noteId: note.id });
	}

	async updateDirectoryTitle(directoryId: string, title: string) {
		const directory = this.findDirectory(directoryId);
		if (!directory) return;

		const previousTitle = directory.title;
		directory.title = title;

		const [, error] = await client
			.patch("/api/v1/directories/edit", {
				body: { title, directoryId },
			})
			.safe();

		if (error) {
			directory.title = previousTitle;
			console.error(error);
		}
	}

	async deleteNote(noteId: string) {
		const note = this.findNote(noteId);
		if (!note) return false;

		const [, error] = await client
			.patch("/api/v1/notes/soft-delete", { body: { noteId } })
			.safe();

		if (error) {
			console.error(error);
			return false;
		}

		this.#removeNote(noteId);

		if (shell.activeTab?.type === "NOTES" && shell.activeTab.noteId === noteId) {
			shell.openNotesHome();
		}

		return true;
	}

	async recoverNote(noteId: string) {
		const [, error] = await client
			.patch("/api/v1/notes/recover", { body: { noteId } })
			.safe();

		if (error) {
			console.error(error);
			return false;
		}

		await this.init();
		return true;
	}

	async permanentlyDeleteNote(noteId: string) {
		const [, error] = await client
			.delete("/api/v1/notes/delete", { body: { noteId } })
			.safe();

		if (error) {
			console.error(error);
			return false;
		}

		this.#removeNote(noteId);
		return true;
	}

	async deleteDirectory(directoryId: string) {
		const directory = this.findDirectory(directoryId);
		if (!directory) return false;

		const activeNoteId =
			shell.activeTab?.type === "NOTES" ? shell.activeTab.noteId : null;
		const activeNoteIsInDirectory = directory.notes.some(
			(note) => note.id === activeNoteId,
		);

		const [, error] = await client
			.patch("/api/v1/directories/soft-delete", { body: { directoryId } })
			.safe();

		if (error) {
			console.error(error);
			return false;
		}

		this.#removeDirectory(directoryId);

		if (activeNoteIsInDirectory) {
			shell.openNotesHome();
		}

		return true;
	}

	async recoverDirectory(directoryId: string) {
		const [, error] = await client
			.patch("/api/v1/directories/recover", { body: { directoryId } })
			.safe();

		if (error) {
			console.error(error);
			return false;
		}

		await this.init();
		return true;
	}

	async permanentlyDeleteDirectory(directoryId: string) {
		const [, error] = await client
			.delete("/api/v1/directories/delete", { body: { directoryId } })
			.safe();

		if (error) {
			console.error(error);
			return false;
		}

		this.#removeDirectory(directoryId);
		return true;
	}

	#removeNote(noteId: string) {
		if (!this.#noteTree) return;

		const standaloneIndex = this.#noteTree.notes.findIndex(
			(note) => note.id === noteId,
		);

		if (standaloneIndex !== -1) {
			this.#noteTree.notes.splice(standaloneIndex, 1);
			return;
		}

		for (const directory of this.#noteTree.directories) {
			const noteIndex = directory.notes.findIndex((note) => note.id === noteId);

			if (noteIndex === -1) continue;

			directory.notes.splice(noteIndex, 1);
			return;
		}
	}

	#removeDirectory(directoryId: string) {
		if (!this.#noteTree) return;

		const directoryIndex = this.#noteTree.directories.findIndex(
			(directory) => directory.id === directoryId,
		);

		if (directoryIndex === -1) return;

		this.#noteTree.directories.splice(directoryIndex, 1);
	}
}

export const notes = new NotesStore();
