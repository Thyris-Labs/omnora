import type { AllNotes, Directory, Note } from "./types";
import { page } from "$app/state";
import { shell } from "features/shell/store.svelte";
import { client } from "lib/api";

interface CreateDirectoryParams {
	moduleType: "NOTES" | "ARCHIVE";
}

class NotesStore {
	#noteTree = $state<AllNotes | null>(null);
	editingDirectoryId = $state<string | null>(null);

	tree = $derived.by(() => {
		const noteTree = this.#noteTree
		if (!noteTree) return [];

		return [...noteTree.directories, ...noteTree.notes].sort((a, b) => a.positionIdx - b.positionIdx)
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
		const body = {
			title: "New directory",
			positionIdx: (this.#noteTree?.directories.length ?? -1) + 1,
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

	async updateDirectoryTitle(directoryId: string, title: string) {
		const directory = this.#noteTree?.directories.find(
			(directory) => directory.id === directoryId,
		);
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
}

export const notes = new NotesStore();
