<script lang="ts">
	import PhFolderSimpleDuotone from "~icons/ph/folder-simple-duotone";
	import type { Directory } from "../../types";
	import { cn } from "tailwind-variants";
	import PhNoteDuotone from "~icons/ph/note-duotone";
	import PhFolderOpenDuotone from "~icons/ph/folder-open-duotone";
	import { page } from "$app/state";
	import TreeItemButton from "./tree-item-button.svelte";
	import { notes as notesStore } from "modules/notes/store.svelte";
	import { ContextMenu } from "bits-ui";
	import {
		ContextMenuContent,
		ContextMenuItem,
	} from "ui/primitives/context-menu";
	import { tick } from "svelte";

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
	let notes = $derived(directory.notes);
	let isEditing = $derived(notesStore.editingDirectoryId === directory.id);
	let draftTitle = $state("");
	let inputElement = $state<HTMLInputElement | null>(null);

	const NOTE_SIZE = 2.125;
	const GAP = 0.125;
	const directoryItemClass =
		"mb-0.5 flex w-full items-center justify-start gap-x-2 px-2 py-1.5 text-sm text-main-300 outline-none hover:bg-main-700 hover:text-main-100 aria-selected:bg-main-600 aria-selected:text-main-50 rounded";

	const paddingBottom = $derived(
		!notes?.length || !open ? 0 : notes.length * (NOTE_SIZE + GAP) - GAP,
	);

	$effect(() => {
		if (!isEditing) return;
		void startEditing();
	});

	async function startEditing() {
		draftTitle = directory.title;

		await tick();

		inputElement?.focus();
		inputElement?.select();
	}

	function cancelEditing() {
		draftTitle = directory.title;
		notesStore.editingDirectoryId = null;
	}

	async function saveEditing() {
		if (!isEditing) return;

		const title = draftTitle.trim() || directory.title;
		notesStore.editingDirectoryId = null;

		if (title === directory.title) return;

		await notesStore.updateDirectoryTitle(directory.id, title);
	}

	function handleEditKeydown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault();
			inputElement?.blur();
			return;
		}

		if (event.key === "Escape") {
			event.preventDefault();
			cancelEditing();
		}
	}
</script>

<div
	class="overflow-hidden relative transition-[padding] ease-out-expo duration-300"
	style="padding-bottom: {paddingBottom}rem"
>
	<ContextMenu.Root>
		<ContextMenu.Trigger disabled={isEditing}>
			{#if isEditing}
				<div
					class={cn(directoryItemClass, "text-main-100 hover:bg-transparent")}
					data-tree-item-key={directoryKey}
					role="treeitem"
					aria-expanded={notes?.length ? open : undefined}
					aria-level={1}
					aria-selected={false}
				>
					{#if open}
						<PhFolderOpenDuotone aria-hidden="true" />
					{:else}
						<PhFolderSimpleDuotone aria-hidden="true" />
					{/if}
					<input
						bind:this={inputElement}
						bind:value={draftTitle}
						class="min-w-0 flex-1 bg-transparent text-sm text-main-50 outline-none"
						aria-label="Directory name"
						onblur={() => void saveEditing()}
						onkeydown={handleEditKeydown}
						onclick={(event) => event.stopPropagation()}
					/>
				</div>
			{:else}
				<TreeItemButton
					class="mb-0.5"
					onclick={() => onDirectoryToggle(directory.id)}
					onfocus={() => onItemFocus(directoryKey)}
					onkeydown={(event: KeyboardEvent) =>
						onItemKeydown(event, directoryKey)}
					data-tree-item-key={directoryKey}
					role="treeitem"
					aria-expanded={notes?.length ? open : undefined}
					aria-level={1}
					tabindex={currentItemKey === directoryKey ? 0 : -1}
				>
					{#if open}
						<PhFolderOpenDuotone aria-hidden="true" />
					{:else}
						<PhFolderSimpleDuotone aria-hidden="true" />
					{/if}
					{directory.title}
				</TreeItemButton>
			{/if}
		</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenuContent>
				<ContextMenuItem
					onclick={() => (notesStore.editingDirectoryId = directory.id)}
				>
					Rename
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu.Portal>
	</ContextMenu.Root>

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
		{#each directory.notes ?? [] as note (note.id)}
			{@const noteKey = getNoteKey(directory.id, note.id)}
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
				{note.title ?? "No name"}
			</TreeItemButton>
		{/each}
	</div>
</div>
