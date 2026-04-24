<script lang="ts">
	import Button from "ui/primitives/button.svelte";
	import PhFolderSimpleDuotone from "~icons/ph/folder-simple-duotone";
	import type { Directory } from "../types";
	import { cn } from "tailwind-variants";
	import PhNoteDuotone from "~icons/ph/note-duotone";
	import PhFolderOpenDuotone from "~icons/ph/folder-open-duotone";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { auth } from "features/auth/store.svelte";
	import { page } from "$app/state";

	let { name, notes }: Directory = $props();
	let open = $state(false);

	const NOTE_SIZE = 2.125;
	const GAP = 0.125;

	const paddingBottom = $derived(
		!notes?.length || !open ? 0 : notes.length * (NOTE_SIZE + GAP) - GAP,
	);
</script>

<div
	class="overflow-hidden relative transition-[padding] ease-out-expo duration-300"
	style="padding-bottom: {paddingBottom}rem"
>
	<Button
		class="mb-0.5 active:scale-100 active:bg-main-900/80"
		onclick={() => (open = !open)}
	>
		{#if open}
			<PhFolderOpenDuotone />
		{:else}
			<PhFolderSimpleDuotone />
		{/if}
		{name}
	</Button>

	<div
		class={cn(
			"flex flex-col gap-y-0.5 pl-6.5 absolute w-full opacity-0 blur-xs transition-[opacity,filter] ease-out-expo",
			open ? "blur-none opacity-100 duration-300" : "duration-600",
		)}
	>
		<div
			aria-hidden="true"
			class="w-px absolute left-4 h-full bg-main-900"
		></div>
		{#each notes ?? [] as note (note.id)}
			<Button
				class={note.id === page.params.note_id
					? "bg-main-900 text-main-50 hover:text-main-50"
					: ""}
				onclick={() =>
					goto(
						resolve("/(app)/e/[environment_id]/m/notes/[note_id]", {
							environment_id: auth.currentEnvironment.id,
							note_id: note.id,
						}),
					)}
			>
				<PhNoteDuotone />
				{note.title ?? "No name"}
			</Button>
		{/each}
	</div>
</div>
