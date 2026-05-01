<script lang="ts">
	import type { JSONContent } from "@tiptap/core";
	import { page } from "$app/state";
	import { client } from "lib/api";
	import { notes } from "modules/notes/store.svelte";
	import type { Note } from "modules/notes/types";
	import { useDebounce } from "runed";
	import { onDestroy, onMount } from "svelte";
	import Editor from "ui/components/editor/editor.svelte";
	import Input from "ui/primitives/input.svelte";
	import PhImageDuotone from "~icons/ph/image-duotone";
	import NoteActionButton from "./buttons/note-action-button.svelte";

	interface Props {
		mode: "create" | "edit";
	}

	const EMPTY_DOCUMENT: JSONContent = {
		type: "doc",
		content: [{ type: "paragraph" }],
	};
	const SAVE_DELAY = 600;

	let { mode }: Props = $props();
	let draftId = crypto.randomUUID();
	let draftTitle = $state("");
	let draftRawContent = $state<JSONContent>(EMPTY_DOCUMENT);
	let draftContent = $state("");
	let isCreating = false;
	let isCreated = false;

	const activeNote = $derived(mode === "edit" ? notes.currentNote : null);
	const shouldRender = $derived(mode === "create" || Boolean(activeNote));
	const editorKey = $derived(mode === "create" ? draftId : activeNote?.id);
	const titleValue = $derived(
		mode === "create" ? draftTitle : (activeNote?.title ?? ""),
	);
	const editorContent = $derived(
		mode === "create"
			? draftRawContent
			: ((activeNote?.rawContent as JSONContent | null) ?? EMPTY_DOCUMENT),
	);
	const hasDraftContent = $derived(
		Boolean(draftTitle.trim() || draftContent.trim()),
	);

	onMount(() => {
		if (mode === "edit" && !notes.currentNote && page.params.note_id) {
			void notes.open(page.params.note_id);
		}
	});

	function buildPayload(note: Note) {
		return {
			id: note.id,
			directoryId: note.directoryId,
			positionIdx: note.positionIdx,
			title: note.title?.trim(),
			rawContent: (note.rawContent as JSONContent | null) ?? EMPTY_DOCUMENT,
			content: note.content ?? "",
		};
	}

	const saveNote = useDebounce(async (note: Note) => {
		const [, error] = await client
			.post("/api/v1/notes/save", { body: buildPayload(note) })
			.safe();

		if (error) {
			console.error(error);
		}
	}, SAVE_DELAY);

	const createNote = useDebounce(async () => {
		if (isCreated || isCreating || !hasDraftContent) return;

		isCreating = true;

		if (!notes.noteTree) await notes.init();

		const draft: Note = {
			id: draftId,
			title: draftTitle.trim(),
			cover: null,
			content: draftContent,
			rawContent: draftRawContent,
			directoryId: null,
			positionIdx: notes.noteTree?.notes.length ?? 0,
			createdAt: null,
			updatedAt: null,
		};

		const [, error] = await client
			.post("/api/v1/notes/save", { body: buildPayload(draft) })
			.safe();

		if (error) {
			console.error(error);
			isCreating = false;
			return;
		}

		isCreated = true;
		notes.addStandaloneNote(draft);
		notes.open(draftId);
	}, SAVE_DELAY);

	function handleTitleInput(event: Event) {
		const value = (event.target as HTMLInputElement).value ?? "";

		if (mode === "create") {
			draftTitle = value;
			void createNote();
			return;
		}

		if (!activeNote) return;

		notes.updateNote(activeNote.id, { title: value.trim() });
		void saveNote(activeNote);
	}

	function handleEditorUpdate(next: {
		rawContent: JSONContent;
		content: string;
	}) {
		if (mode === "create") {
			draftRawContent = next.rawContent;
			draftContent = next.content;
			void createNote();
			return;
		}

		if (!activeNote) return;

		notes.updateNote(activeNote.id, next);
		void saveNote(activeNote);
	}

	onDestroy(() => {
		createNote.cancel();
		saveNote.cancel();
	});
</script>

<div class="flex-1 h-full px-24 pt-20 relative flex flex-col">
	{#if shouldRender}
		<div class="group relative">
			<div
				class="w-full h-60 group absolute left-0 top-0 opacity-0 hover:opacity-100 transition-opacity"
			></div>

			<NoteActionButton>
				<PhImageDuotone />
				Add a cover
			</NoteActionButton>
			<Input
				variant="unstyled"
				placeholder="Title"
				class="focus-within:ring-0"
				inputClass="text-6xl placeholder:font-semibold font-semibold placeholder:text-main-500 text-main-50 z-1 relative"
				value={titleValue}
				oninput={handleTitleInput}
			/>
		</div>

		{#key editorKey}
			<Editor
				class="ml-1 mt-8"
				content={editorContent}
				onUpdate={handleEditorUpdate}
			/>
		{/key}
	{/if}
</div>
