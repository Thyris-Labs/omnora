<script lang="ts">
	import { tick } from "svelte";
	import { cn } from "tailwind-variants";
	import PhFolderOpenDuotone from "~icons/ph/folder-open-duotone";
	import PhFolderSimpleDuotone from "~icons/ph/folder-simple-duotone";
	import { ContextMenu } from "bits-ui";
	import {
		ContextMenuContent,
		ContextMenuItem,
	} from "ui/primitives/context-menu";
	import type {
		FileTreeContextMenuItem,
		FileTreeDirectory,
		FileTreeDirectoryActionContext,
	} from "./types";
	import TreeItemButton from "./tree-item-button.svelte";

	interface Props {
		directory: FileTreeDirectory;
		currentItemKey: string | null;
		directoryKey: string;
		open: boolean;
		hasChildren: boolean;
		editingDirectoryId?: string | null;
		onDirectoryToggle: (directoryId: string) => void;
		onItemFocus: (key: string) => void;
		onItemKeydown: (event: KeyboardEvent, key: string) => void;
		onEditingDirectoryChange?: (directoryId: string | null) => void;
		onRenameDirectory?: (
			directory: FileTreeDirectory,
			title: string,
		) => void | Promise<void>;
		getDirectoryActions?: (
			context: FileTreeDirectoryActionContext,
		) => FileTreeContextMenuItem[];
	}

	let {
		directory,
		currentItemKey,
		directoryKey,
		open,
		hasChildren,
		editingDirectoryId = null,
		onDirectoryToggle,
		onItemFocus,
		onItemKeydown,
		onEditingDirectoryChange,
		onRenameDirectory,
		getDirectoryActions,
	}: Props = $props();

	let isEditing = $derived(editingDirectoryId === directory.id);
	let draftTitle = $state("");
	let inputElement = $state<HTMLInputElement | null>(null);

	const directoryItemClass =
		"mb-0.5 flex w-full items-center justify-start gap-x-2 px-2 py-1.5 text-sm text-main-300 outline-none hover:bg-main-700 hover:text-main-100 aria-selected:bg-main-600 aria-selected:text-main-50 rounded";

	const contextMenuItems = $derived.by(() => {
		return (
			getDirectoryActions?.({
				directory,
				open,
				toggle: () => onDirectoryToggle(directory.id),
				startEditing,
			}) ?? []
		);
	});

	$effect(() => {
		if (!isEditing) return;
		void focusInput();
	});

	function startEditing() {
		onEditingDirectoryChange?.(directory.id);
	}

	async function focusInput() {
		draftTitle = directory.title;

		await tick();

		inputElement?.focus();
		inputElement?.select();
	}

	function cancelEditing() {
		draftTitle = directory.title;
		onEditingDirectoryChange?.(null);
	}

	async function saveEditing() {
		if (!isEditing) return;

		const title = draftTitle.trim() || directory.title;
		onEditingDirectoryChange?.(null);

		if (title === directory.title) return;

		await onRenameDirectory?.(directory, title);
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

<ContextMenu.Root>
	<ContextMenu.Trigger disabled={isEditing}>
		{#if isEditing}
			<div
				class={cn(directoryItemClass, "text-main-100 hover:bg-transparent")}
				data-tree-item-key={directoryKey}
				role="treeitem"
				aria-expanded={hasChildren ? open : undefined}
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
				onkeydown={(event: KeyboardEvent) => onItemKeydown(event, directoryKey)}
				data-tree-item-key={directoryKey}
				role="treeitem"
				aria-expanded={hasChildren ? open : undefined}
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
	{#if contextMenuItems.length}
		<ContextMenu.Portal>
			<ContextMenuContent>
				{#each contextMenuItems as item}
					<ContextMenuItem
						disabled={item.disabled}
						onclick={() => void item.action()}
					>
						{item.label}
					</ContextMenuItem>
				{/each}
			</ContextMenuContent>
		</ContextMenu.Portal>
	{/if}
</ContextMenu.Root>
