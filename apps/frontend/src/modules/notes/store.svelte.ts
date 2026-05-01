import type { AllNotes, Note } from "./types"
import { page } from "$app/state"
import { shell } from "features/shell/store.svelte"
import { client } from "lib/api";

class NotesStore {
	noteTree = $state<AllNotes | null>(null)

	get currentNote() {
		const activeTab = shell.activeTab

		if (activeTab?.type !== "NOTES" || !activeTab.noteId) return null

		return this.findNote(activeTab.noteId)
	}

	get allNotes() {
		const noteTree = this.noteTree
		if (!noteTree) return []

		return [
			...noteTree.directories.flatMap((directory) => directory.notes),
			...noteTree.notes,
		]
	}

	async init() {
		const [data, err] = await client.get("/api/v1/notes", {}).safe()

		if (err) {
			console.error(err)
			return
		}

		this.noteTree = data

		if (page.params.note_id) {
			shell.openNote({ noteId: page.params.note_id })
		}
	}

	async open(noteId: string) {
		const match = this.findNote(noteId)

		if (!match) return

		shell.openNote({ noteId: match.id })
	}

	findNote(noteId: string) {
		return this.allNotes.find((note) => note.id === noteId) ?? null
	}

	addStandaloneNote(note: Note) {
		if (!this.noteTree) {
			this.noteTree = { directories: [], notes: [note] }
			return
		}

		this.noteTree.notes.push(note)
	}

	updateNote(noteId: string, patch: Partial<Note>) {
		const note = this.findNote(noteId)
		if (!note) return

		Object.assign(note, patch)
	}

}

export const notes = new NotesStore()
