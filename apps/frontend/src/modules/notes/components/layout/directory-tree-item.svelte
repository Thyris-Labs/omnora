<script lang="ts">
	import { page } from "$app/state";
	import type { Directory } from "../../types";
	import DirectoryButton from "../buttons/directory-button.svelte";
	import TreeItemButton from "../buttons/tree-item-button.svelte";
	import { notes as notesStore } from "modules/notes/store.svelte";
	import { cn } from "tailwind-variants";
	import PhNoteDuotone from "~icons/ph/note-duotone";
	import { ContextMenu } from "bits-ui";
	import {
		ContextMenuContent,
		ContextMenuItem,
	} from "ui/primitives/context-menu";

	interface Props {
		directory: Directory;
		currentItemKey: string | null;
		directoryKey: string;
		getNoteKey: (directoryId: string, noteId: string) => string;
		open: boolean;
		onDirectoryToggle: (directoryId: string) => void;
		onItemFocus: (key: string) => void;
		onItemKeydown: (event: KeyboardEvent, key: string) => void;
	}

	let {
		directory,
		currentItemKey,
		directoryKey,
		getNoteKey,
		open,
		onDirectoryToggle,
		onItemFocus,
		onItemKeydown,
	}: Props = $props();
	let directoryNotes = $derived(directory.notes);

	const NOTE_SIZE = 2.125;
	const GAP = 0.125;

	const paddingBottom = $derived.by(() => {
		if (!directoryNotes?.length || !open) return 0;
		return directoryNotes.length * (NOTE_SIZE + GAP) - GAP;
	});
</script>

<div
	class="overflow-hidden relative transition-[padding] ease-out-expo duration-300"
	style="padding-bottom: {paddingBottom}rem"
>
	<DirectoryButton
		{directory}
		{currentItemKey}
		{directoryKey}
		{open}
		{onDirectoryToggle}
		{onItemFocus}
		{onItemKeydown}
	/>

	<div
		class={cn(
			"hidden flex-col gap-y-0.5 pl-6.5 absolute w-full opacity-0 blur-xs transition-[opacity,filter,display] transition-discrete ease-out-expo starting:opacity-0 starting:blur-xs",
			open ? "flex blur-none opacity-100 duration-300" : "duration-600",
		)}
		role="group"
		aria-hidden={open ? undefined : "true"}
	>
		<div
			aria-hidden="true"
			class="w-px absolute left-4 h-full bg-main-600"
		></div>
		{#each directoryNotes ?? [] as note (note.id)}
			{@const noteKey = getNoteKey(directory.id, note.id)}
			{@const title = note.title === "" || !note.title ? "No name" : note.title}

			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<TreeItemButton
						data-tree-item-key={noteKey}
						role="treeitem"
						aria-level={2}
						aria-selected={note.id === page.params.note_id}
						tabindex={open && currentItemKey === noteKey ? 0 : -1}
						onfocus={() => onItemFocus(noteKey)}
						onkeydown={(event: KeyboardEvent) => onItemKeydown(event, noteKey)}
						onclick={() => notesStore.open(note.id)}
					>
						<PhNoteDuotone aria-hidden="true" />
						{title}
					</TreeItemButton>
				</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenuContent>
						<ContextMenuItem onclick={() => void notesStore.deleteNote(note.id)}>
							Delete note
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu.Portal>
			</ContextMenu.Root>
		{/each}
	</div>
</div>
