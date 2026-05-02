<script lang="ts">
	import PhTrashDuotone from "~icons/ph/trash-duotone";
	import FileTree from "./file-tree.svelte";
	import SidebarActionButton from "../buttons/sidebar-action-button.svelte";
	import { ContextMenu, ContextMenuItem } from "ui/primitives/context-menu";
	import { notes } from "modules/notes/store.svelte";
	import { shell } from "features/shell/store.svelte";
</script>

<aside
	class="w-56 h-full border-r border-main-800 flex flex-col justify-between p-2 relative"
>
	<FileTree />

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
