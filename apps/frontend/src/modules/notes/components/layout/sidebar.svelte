<script lang="ts">
	import { page } from "$app/state";
	import PhTrashDuotone from "~icons/ph/trash-duotone";
	import PhNoteDuotone from "~icons/ph/note-duotone";
	import SidebarActionButton from "../buttons/sidebar-action-button.svelte";
	import { ContextMenu, ContextMenuItem } from "ui/primitives/context-menu";
	import { notes } from "modules/notes/store.svelte";
	import type { Note } from "modules/notes/types";
	import { shell } from "features/shell/store.svelte";
	import { FileTree } from "ui/components/file-tree";
	import type {
		FileTreeContextMenuItem,
		FileTreeDirectory,
		FileTreeDirectoryActionContext,
		FileTreeEntry,
		FileTreeItem,
		FileTreeItemActionContext,
	} from "ui/components/file-tree";

	const NOTE_ITEM_TYPE = "note";

	function toNoteTreeItem(note: Note): FileTreeItem {
		return {
			kind: "item",
			id: note.id,
			type: NOTE_ITEM_TYPE,
			title: note.title,
			positionIdx: note.positionIdx,
			data: note,
			icon: PhNoteDuotone,
		};
	}

	const fileTreeItems = $derived.by<FileTreeEntry[]>(() => {
		return notes.tree.map((treeItem) => {
			if ("notes" in treeItem) {
				return {
					kind: "directory",
					id: treeItem.id,
					title: treeItem.title,
					positionIdx: treeItem.positionIdx,
					data: treeItem,
					items: treeItem.notes.map(toNoteTreeItem),
				};
			}

			return toNoteTreeItem(treeItem);
		});
	});

	function handleOpenItem(item: FileTreeItem) {
		if (item.type !== NOTE_ITEM_TYPE) return;

		void notes.open(item.id);
	}

	function isNoteSelected(item: FileTreeItem) {
		return item.type === NOTE_ITEM_TYPE && item.id === page.params.note_id;
	}

	function handleDirectoryRename(directory: FileTreeDirectory, title: string) {
		return notes.updateDirectoryTitle(directory.id, title);
	}

	function getDirectoryActions({
		directory,
		open,
		toggle,
		startEditing,
	}: FileTreeDirectoryActionContext): FileTreeContextMenuItem[] {
		return [
			{
				label: "Create a note",
				action: async () => {
					if (!open) {
						toggle();
					}

					await notes.createNote({ directoryId: directory.id });
				},
			},
			{
				label: "Rename",
				action: startEditing,
			},
			{
				label: "Delete directory",
				action: async () => {
					await notes.deleteDirectory(directory.id);
				},
			},
		];
	}

	function getItemActions({
		item,
	}: FileTreeItemActionContext): FileTreeContextMenuItem[] {
		if (item.type !== NOTE_ITEM_TYPE) return [];

		return [
			{
				label: "Delete note",
				action: async () => {
					await notes.deleteNote(item.id);
				},
			},
		];
	}
</script>

<aside
	class="w-56 h-full border-r border-main-800 flex flex-col justify-between p-2 relative"
>
	<FileTree
		ariaLabel="Notes"
		items={fileTreeItems}
		selectedItemId={page.params.note_id}
		isItemSelected={isNoteSelected}
		editingDirectoryId={notes.editingDirectoryId}
		onEditingDirectoryChange={(directoryId) =>
			(notes.editingDirectoryId = directoryId)}
		onRenameDirectory={handleDirectoryRename}
		onOpenItem={handleOpenItem}
		{getDirectoryActions}
		{getItemActions}
	/>

	<SidebarActionButton onclick={() => shell.openNotesTrash()}>
		<PhTrashDuotone aria-hidden="true" />
		Trash
	</SidebarActionButton>

	<ContextMenu>
		<ContextMenuItem onclick={() => void notes.createNote()}>
			Create a note
		</ContextMenuItem>
		<ContextMenuItem
			onclick={() => void notes.createDirectory({ moduleType: "NOTES" })}
		>
			Create a directory
		</ContextMenuItem>
	</ContextMenu>
</aside>
