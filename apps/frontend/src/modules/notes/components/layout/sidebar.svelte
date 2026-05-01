<script lang="ts">
	import PhTrashDuotone from "~icons/ph/trash-duotone";
	import FileTree from "./file-tree.svelte";
	import SidebarActionButton from "../buttons/sidebar-action-button.svelte";
</script>

<aside
	class="w-56 h-full border-r border-main-800 flex flex-col justify-between p-2"
>
	<FileTree />

	<SidebarActionButton>
		<PhTrashDuotone aria-hidden="true" />
		Trash
	</SidebarActionButton>
</aside>
