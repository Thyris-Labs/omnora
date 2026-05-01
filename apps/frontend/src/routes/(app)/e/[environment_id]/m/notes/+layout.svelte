<script lang="ts">
	import Sidebar from "modules/notes/components/layout/sidebar.svelte";
	import { notes } from "modules/notes/store.svelte";
	import { onMount } from "svelte";
	import PhCaretRight from "~icons/ph/caret-right";

	let { children } = $props();

	onMount(async () => {
		await notes.init();
	});
</script>

<div class="flex flex-col h-full w-full select-none">
	<div class="flex justify-between border-b h-10 items-center px-4">
		<div class="flex text-main-400 items-center gap-x-1.5 text-sm">
			<span>My notes</span>
			{#if notes.currentNote}
				<PhCaretRight class="size-3" />
				<p class="text-main-50">{notes.currentNote.title}</p>
			{/if}
		</div>

		{#if notes.currentNote}
			<p class="text-main-400 text-xs">Edited 5 min ago</p>
		{/if}
	</div>
	<div class="flex flex-1">
		<Sidebar />
		{@render children()}
	</div>
</div>
