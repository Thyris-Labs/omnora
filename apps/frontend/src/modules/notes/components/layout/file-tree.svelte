<script lang="ts">
	import { tick } from "svelte";
	import type { Directory } from "../../types";
	import DirectoryTreeItem from "./directory-tree-item.svelte";
	import { notes } from "modules/notes/store.svelte";
	import TreeItemButton from "../buttons/tree-item-button.svelte";
	import PhNoteDuotone from "~icons/ph/note-duotone";
	import { page } from "$app/state";

	let treeElement = $state<HTMLDivElement | null>(null);
	let currentItemKey = $state<string | null>(null);
	let openDirectoryIds = $state<Set<string>>(new Set());

	type TreeItem =
		| {
				key: string;
				kind: "directory";
				directory: Directory;
		  }
		| {
				key: string;
				kind: "note";
				noteId: string;
				directoryId?: string;
		  };

	function getDirectoryKey(directoryId: string) {
		return `directory:${directoryId}`;
	}

	function getNoteKey(directoryId: string, noteId: string) {
		return `note:${directoryId}:${noteId}`;
	}

	function getStandaloneNoteKey(noteId: string) {
		return `note:${noteId}`;
	}

	const visibleItems = $derived.by(() => {
		const items: Array<TreeItem> = [];

		for (const item of notes.tree) {
			if ("notes" in item) {
				items.push({
					key: getDirectoryKey(item.id),
					kind: "directory",
					directory: item,
				});

				if (!openDirectoryIds.has(item.id)) {
					continue;
				}

				for (const note of item.notes ?? []) {
					items.push({
						key: getNoteKey(item.id, note.id),
						kind: "note",
						directoryId: item.id,
						noteId: note.id,
					});
				}
				continue;
			}

			items.push({
				key: getStandaloneNoteKey(item.id),
				kind: "note",
				noteId: item.id,
			});
		}

		return items;
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

			if (!directory.notes?.length) {
				return;
			}

			if (!openDirectoryIds.has(directory.id)) {
				setDirectoryOpen(directory.id, true);
				return;
			}

			focusItem(getNoteKey(directory.id, directory.notes[0].id));
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
	aria-label="Notes"
>
	{#each notes.tree as treeItem (treeItem.id)}
		{#if "notes" in treeItem}
			<DirectoryTreeItem
				directory={treeItem}
				{currentItemKey}
				directoryKey={getDirectoryKey(treeItem.id)}
				{getNoteKey}
				open={openDirectoryIds.has(treeItem.id)}
				onDirectoryToggle={toggleDirectory}
				onItemFocus={(key) => (currentItemKey = key)}
				onItemKeydown={handleItemKeydown}
			/>
		{:else}
			{@const noteKey = getStandaloneNoteKey(treeItem.id)}
			{@const title =
				treeItem.title === "" || !treeItem.title ? "No name" : treeItem.title}

			<TreeItemButton
				data-tree-item-key={noteKey}
				role="treeitem"
				aria-level={1}
				aria-selected={treeItem.id === page.params.note_id}
				tabindex={currentItemKey === noteKey ? 0 : -1}
				onfocus={() => (currentItemKey = noteKey)}
				onkeydown={(event: KeyboardEvent) => handleItemKeydown(event, noteKey)}
				onclick={() => notes.open(treeItem.id)}
			>
				<PhNoteDuotone aria-hidden="true" />
				{title}
			</TreeItemButton>
		{/if}
	{/each}
</div>
