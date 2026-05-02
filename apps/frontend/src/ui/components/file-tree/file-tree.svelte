<script lang="ts">
	import { tick } from "svelte";
	import { ContextMenu } from "bits-ui";
	import {
		ContextMenuContent,
		ContextMenuItem,
	} from "ui/primitives/context-menu";
	import { comparePositions } from "lib/position";
	import type {
		FileTreeContextMenuItem,
		FileTreeDirectory,
		FileTreeDirectoryActionContext,
		FileTreeEntry,
		FileTreeItem,
		FileTreeItemActionContext,
	} from "./types";
	import DirectoryTreeItem from "./directory-tree-item.svelte";
	import TreeItemButton from "./tree-item-button.svelte";

	interface Props {
		items: FileTreeEntry[];
		ariaLabel?: string;
		selectedItemId?: string | null;
		editingDirectoryId?: string | null;
		emptyItemTitle?: string;
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
		items,
		ariaLabel = "File tree",
		selectedItemId = null,
		editingDirectoryId = null,
		emptyItemTitle = "No name",
		onOpenItem,
		isItemSelected,
		onEditingDirectoryChange,
		onRenameDirectory,
		getDirectoryActions,
		getItemActions,
	}: Props = $props();

	let treeElement = $state<HTMLDivElement | null>(null);
	let currentItemKey = $state<string | null>(null);
	let openDirectoryIds = $state<Set<string>>(new Set());

	type VisibleTreeItem =
		| {
				key: string;
				kind: "directory";
				directory: FileTreeDirectory;
		  }
		| {
				key: string;
				kind: "item";
				item: FileTreeItem;
				directoryId?: string;
		  };

	function getDirectoryKey(directoryId: string) {
		return `directory:${directoryId}`;
	}

	function getItemKey(directoryId: string, item: FileTreeItem) {
		return `item:${directoryId}:${item.type}:${item.id}`;
	}

	function getStandaloneItemKey(item: FileTreeItem) {
		return `item:${item.type}:${item.id}`;
	}

	function getRenderKey(item: FileTreeEntry) {
		if (item.kind === "directory") {
			return getDirectoryKey(item.id);
		}

		return getStandaloneItemKey(item);
	}

	const sortedItems = $derived.by(() => {
		return [...items].sort((a, b) =>
			comparePositions(a.positionIdx, b.positionIdx),
		);
	});

	const visibleItems = $derived.by(() => {
		const visible: Array<VisibleTreeItem> = [];

		for (const item of sortedItems) {
			if (item.kind === "directory") {
				visible.push({
					key: getDirectoryKey(item.id),
					kind: "directory",
					directory: item,
				});

				if (!openDirectoryIds.has(item.id)) {
					continue;
				}

				for (const directoryItem of item.items) {
					visible.push({
						key: getItemKey(item.id, directoryItem),
						kind: "item",
						directoryId: item.id,
						item: directoryItem,
					});
				}
				continue;
			}

			visible.push({
				key: getStandaloneItemKey(item),
				kind: "item",
				item,
			});
		}

		return visible;
	});

	$effect(() => {
		if (visibleItems.length === 0) {
			currentItemKey = null;
			return;
		}

		if (
			!currentItemKey ||
			!visibleItems.some((item) => item.key === currentItemKey)
		) {
			currentItemKey = visibleItems[0].key;
		}
	});

	function setDirectoryOpen(directoryId: string, open: boolean) {
		const nextOpenDirectoryIds = new Set(openDirectoryIds);

		if (open) {
			nextOpenDirectoryIds.add(directoryId);
		} else {
			nextOpenDirectoryIds.delete(directoryId);
		}

		openDirectoryIds = nextOpenDirectoryIds;
	}

	function toggleDirectory(directoryId: string) {
		setDirectoryOpen(directoryId, !openDirectoryIds.has(directoryId));
	}

	async function focusItem(key: string | undefined) {
		if (!key) return;

		currentItemKey = key;
		await tick();

		const item = treeElement?.querySelector<HTMLButtonElement>(
			`[data-tree-item-key="${CSS.escape(key)}"]`,
		);
		item?.focus();
	}

	function itemTitle(item: FileTreeItem) {
		return item.title?.trim() || emptyItemTitle;
	}

	function itemSelected(item: FileTreeItem) {
		return isItemSelected?.(item) ?? item.id === selectedItemId;
	}

	function handleItemKeydown(event: KeyboardEvent, key: string) {
		const keys = [
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight",
			"Home",
			"End",
		];
		if (!keys.includes(event.key)) return;

		event.preventDefault();

		const currentIndex = visibleItems.findIndex((item) => item.key === key);
		const currentItem = visibleItems[currentIndex];
		if (!currentItem) return;

		if (event.key === "ArrowDown") {
			focusItem(
				visibleItems[Math.min(currentIndex + 1, visibleItems.length - 1)]?.key,
			);
			return;
		}

		if (event.key === "ArrowUp") {
			focusItem(visibleItems[Math.max(currentIndex - 1, 0)]?.key);
			return;
		}

		if (event.key === "Home") {
			focusItem(visibleItems[0]?.key);
			return;
		}

		if (event.key === "End") {
			focusItem(visibleItems[visibleItems.length - 1]?.key);
			return;
		}

		if (event.key === "ArrowRight" && currentItem.kind === "directory") {
			const directory = currentItem.directory;

			if (!directory.items.length) {
				return;
			}

			if (!openDirectoryIds.has(directory.id)) {
				setDirectoryOpen(directory.id, true);
				return;
			}

			focusItem(getItemKey(directory.id, directory.items[0]));
			return;
		}

		if (event.key === "ArrowLeft") {
			if (currentItem.kind === "directory") {
				setDirectoryOpen(currentItem.directory.id, false);
				return;
			}

			if (currentItem.directoryId) {
				focusItem(getDirectoryKey(currentItem.directoryId));
			}
		}
	}
</script>

<div
	bind:this={treeElement}
	class="flex flex-col gap-y-1 relative z-1"
	role="tree"
	aria-label={ariaLabel}
>
	{#each sortedItems as treeItem (getRenderKey(treeItem))}
		{#if treeItem.kind === "directory"}
			<DirectoryTreeItem
				directory={treeItem}
				{currentItemKey}
				directoryKey={getDirectoryKey(treeItem.id)}
				{getItemKey}
				open={openDirectoryIds.has(treeItem.id)}
				{selectedItemId}
				{isItemSelected}
				{editingDirectoryId}
				{emptyItemTitle}
				onDirectoryToggle={toggleDirectory}
				onItemFocus={(key) => (currentItemKey = key)}
				onItemKeydown={handleItemKeydown}
				{onOpenItem}
				{onEditingDirectoryChange}
				{onRenameDirectory}
				{getDirectoryActions}
				{getItemActions}
			/>
		{:else}
			{@const itemKey = getStandaloneItemKey(treeItem)}
			{@const ItemIcon = treeItem.icon}
			{@const contextMenuItems = getItemActions?.({ item: treeItem }) ?? []}

			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<TreeItemButton
						data-tree-item-key={itemKey}
						role="treeitem"
						aria-level={1}
						aria-selected={itemSelected(treeItem)}
						tabindex={currentItemKey === itemKey ? 0 : -1}
						onfocus={() => (currentItemKey = itemKey)}
						onkeydown={(event: KeyboardEvent) =>
							handleItemKeydown(event, itemKey)}
						onclick={() => onOpenItem(treeItem)}
					>
						{#if ItemIcon}
							<ItemIcon aria-hidden="true" />
						{/if}
						{itemTitle(treeItem)}
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
		{/if}
	{/each}
</div>
