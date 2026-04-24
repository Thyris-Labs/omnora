<script lang="ts">
	import Button from "ui/primitives/button.svelte";
	import type { Directory } from "../types";
	import PhTrashDuotone from "~icons/ph/trash-duotone";
	import DirectoryButton from "./directory-button.svelte";

	// FIXME: Delete when connected to backend
	const DIRECTORIES: Array<Directory> = [
		{
			id: "all-notes",
			name: "All notes",
			notes: [
				{ id: "11729", title: "First note", content: "hello world" },
				{ id: "237U918", title: "Second note" },
				{ id: "38213E", title: "Third note", content: "bye world" },
				{ id: "121827", title: "Some random thing", content: "yes" },
				{ id: "292723" },
			],
		},
		{
			id: "main",
			name: "Main",
			notes: [
				{ id: "11729", title: "First note", content: "hello world" },
				{ id: "237U918", title: "First note", content: "hello world" },
				{ id: "38213E", title: "First note", content: "hello world" },
			],
		},
		{
			id: "secondary",
			name: "Secondary",
			notes: [
				{ id: "121827", title: "Some random thing", content: "yes" },
				{ id: "292723" },
			],
		},
	];
</script>

<aside
	class="w-56 h-full border-r border-main-900 flex flex-col justify-between p-2"
>
	<div class="flex flex-col gap-y-1">
		{#each DIRECTORIES as directory}
			<DirectoryButton {...directory} />
		{/each}
	</div>

	<Button>
		<PhTrashDuotone />
		Trash
	</Button>
</aside>
