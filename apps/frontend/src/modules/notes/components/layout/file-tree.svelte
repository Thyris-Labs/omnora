<script lang="ts">
	import { tick } from "svelte";
	import type { Directory } from "../../types";
	import DirectoryButton from "../buttons/directory-button.svelte";
	import { notes } from "modules/notes/store.svelte";

	let treeElement = $state<HTMLDivElement | null>(null);
	let currentItemKey = $state<string | null>(null);
	let openDirectoryIds = $state<Set<string>>(new Set());

	type TreeItem = {
		key: string;
		kind: "directory" | "note";
		directory: Directory;
		noteId?: string;
	};

	function getDirectoryKey(directoryId: string) {
		return `directory:${directoryId}`;
	}

	function getNoteKey(directoryId: string, noteId: string) {
		return `note:${directoryId}:${noteId}`;
	}

	const visibleItems = $derived.by(() => {
		const items: Array<TreeItem> = [];

		for (const directory of notes.directories) {
			items.push({
				key: getDirectoryKey(directory.id),
				kind: "directory",
				directory,
			});

			if (!openDirectoryIds.has(directory.id)) {
				continue;
			}

			for (const note of directory.notes ?? []) {
				items.push({
					key: getNoteKey(directory.id, note.id),
					kind: "note",
					directory,
					noteId: note.id,
				});
			}
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

			focusItem(getDirectoryKey(currentItem.directory.id));
		}
	}
</script>

<div
	bind:this={treeElement}
	class="flex flex-col gap-y-1"
	role="tree"
	aria-label="Notes"
>
	{#each notes.directories as directory}
		<DirectoryButton
			{directory}
			{currentItemKey}
			directoryKey={getDirectoryKey(directory.id)}
			{getNoteKey}
			open={openDirectoryIds.has(directory.id)}
			onDirectoryToggle={toggleDirectory}
			onItemFocus={(key) => (currentItemKey = key)}
			onItemKeydown={handleItemKeydown}
		/>
	{/each}
</div>
