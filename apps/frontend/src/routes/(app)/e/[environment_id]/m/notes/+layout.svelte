<script lang="ts">
	import Sidebar from "modules/notes/components/layout/sidebar.svelte";
	import PhCaretRight from "~icons/ph/caret-right";

	let { children } = $props();
</script>

<div class="flex flex-col h-full w-full select-none">
	<div class="flex justify-between border-b h-10 items-center px-4">
		<div class="flex text-main-400 items-center gap-x-1.5 text-sm">
			<span>My notes</span>
			<PhCaretRight class="size-3" />
			<p class="text-main-50">Omnora</p>
		</div>

		<p class="text-main-400 text-xs">Edited 5 min ago</p>
	</div>
	<div class="flex flex-1">
		<Sidebar />
		{@render children()}
	</div>
</div>
