import type { Directory, Note } from "./types"
import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { auth } from "features/auth/store.svelte"

// FIXME: Delete when connected to backend
const DIRECTORIES: Array<Directory> = [
	{
		id: "all-notes",
		name: "All notes",
		notes: [
			{ id: "11729", title: "First note", content: "hello world" },
			{ id: "237U918", title: "Second note" },
			{ id: "38213E", title: "Third note", content: "bye world" },
			{ id: "121827", title: "Some random thing", content: "yes" },
			{ id: "292723" },
		],
	},
];

class NotesStore {
	currentNote = $state<Note | null>(null)
	directories = $state<Directory[]>(DIRECTORIES)

	open(noteId: string) {
		let match: Note | null = null

		for (const directory of this.directories) {
			if (!directory.notes?.length) continue

			for (const note of directory.notes) {
				if (note.id === noteId) match = note
			}
		}

		if (!match) return

		this.currentNote = match
		goto(resolve('/(app)/e/[environment_id]/m/notes/[note_id]', { environment_id: auth.currentEnvironment.id, note_id: match.id }))
	}

}

export const notes = new NotesStore()
