<script lang="ts">
	import { page } from "$app/state";
	import NoteActionButton from "modules/notes/components/buttons/note-action-button.svelte";
	import { notes } from "modules/notes/store.svelte";
	import { onMount } from "svelte";
	import Editor from "ui/components/editor/editor.svelte";
	import Input from "ui/primitives/input.svelte";
	import PhImageDuotone from "~icons/ph/image-duotone";

	onMount(() => {
		if (!notes.currentNote && page.params.note_id) {
			notes.open(page.params.note_id);
		}
	});
</script>

<div class="flex-1 h-full px-24 pt-20 relative flex flex-col">
	{#if notes.currentNote}
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
				value={notes.currentNote.title ?? ""}
			/>
		</div>

		<Editor class="ml-1 mt-8" />
	{/if}
</div>
