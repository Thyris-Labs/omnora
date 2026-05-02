<script lang="ts">
	import { ContextMenu } from "bits-ui";
	import { cn } from "tailwind-variants";
	import {
		ContextMenuContent,
		ContextMenuItem,
	} from "ui/primitives/context-menu";
	import type {
		FileTreeContextMenuItem,
		FileTreeDirectory,
		FileTreeDirectoryActionContext,
		FileTreeItem,
		FileTreeItemActionContext,
	} from "./types";
	import DirectoryButton from "./directory-button.svelte";
	import TreeItemButton from "./tree-item-button.svelte";

	interface Props {
		directory: FileTreeDirectory;
		currentItemKey: string | null;
		directoryKey: string;
		getItemKey: (directoryId: string, item: FileTreeItem) => string;
		open: boolean;
		selectedItemId?: string | null;
		editingDirectoryId?: string | null;
		emptyItemTitle?: string;
		onDirectoryToggle: (directoryId: string) => void;
		onItemFocus: (key: string) => void;
		onItemKeydown: (event: KeyboardEvent, key: string) => void;
		onOpenItem: (item: FileTreeItem) => void;
		isItemSelected?: (item: FileTreeItem) => boolean;
		onEditingDirectoryChange?: (directoryId: string | null) => void;
		onRenameDirectory?: (
			directory: FileTreeDirectory,
			title: string,
		) => void | Promise<void>;
		getDirectoryActions?: (
			context: FileTreeDirectoryActionContext,
		) => FileTreeContextMenuItem[];
		getItemActions?: (
			context: FileTreeItemActionContext,
		) => FileTreeContextMenuItem[];
	}

	let {
		directory,
		currentItemKey,
		directoryKey,
		getItemKey,
		open,
		selectedItemId = null,
		editingDirectoryId = null,
		emptyItemTitle = "No name",
		onDirectoryToggle,
		onItemFocus,
		onItemKeydown,
		onOpenItem,
		isItemSelected,
		onEditingDirectoryChange,
		onRenameDirectory,
		getDirectoryActions,
		getItemActions,
	}: Props = $props();

	const directoryItems = $derived.by(() => {
		return [...directory.items].sort((a, b) => a.positionIdx - b.positionIdx);
	});

	const ITEM_SIZE = 2.125;
	const GAP = 0.125;

	const paddingBottom = $derived.by(() => {
		if (!directoryItems.length || !open) return 0;
		return directoryItems.length * (ITEM_SIZE + GAP) - GAP;
	});

	function itemTitle(item: FileTreeItem) {
		return item.title?.trim() || emptyItemTitle;
	}

	function itemSelected(item: FileTreeItem) {
		return isItemSelected?.(item) ?? item.id === selectedItemId;
	}
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
		hasChildren={directoryItems.length > 0}
		{editingDirectoryId}
		{onDirectoryToggle}
		{onItemFocus}
		{onItemKeydown}
		{onEditingDirectoryChange}
		{onRenameDirectory}
		{getDirectoryActions}
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
		{#each directoryItems as item (getItemKey(directory.id, item))}
			{@const itemKey = getItemKey(directory.id, item)}
			{@const ItemIcon = item.icon}
			{@const contextMenuItems =
				getItemActions?.({ item, directory }) ?? []}

			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<TreeItemButton
						data-tree-item-key={itemKey}
						role="treeitem"
						aria-level={2}
						aria-selected={itemSelected(item)}
						tabindex={open && currentItemKey === itemKey ? 0 : -1}
						onfocus={() => onItemFocus(itemKey)}
						onkeydown={(event: KeyboardEvent) => onItemKeydown(event, itemKey)}
						onclick={() => onOpenItem(item)}
					>
						{#if ItemIcon}
							<ItemIcon aria-hidden="true" />
						{/if}
						{itemTitle(item)}
					</TreeItemButton>
				</ContextMenu.Trigger>
				{#if contextMenuItems.length}
					<ContextMenu.Portal>
						<ContextMenuContent>
							{#each contextMenuItems as menuItem}
								<ContextMenuItem
									disabled={menuItem.disabled}
									onclick={() => void menuItem.action()}
								>
									{menuItem.label}
								</ContextMenuItem>
							{/each}
						</ContextMenuContent>
					</ContextMenu.Portal>
				{/if}
			</ContextMenu.Root>
		{/each}
	</div>
</div>
