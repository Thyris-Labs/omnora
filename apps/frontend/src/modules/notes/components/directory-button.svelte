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

	interface Props {
		directory: Directory;
		currentItemKey: string | null;
		directoryKey: string;
		getNoteKey: (directoryId: string, noteId: string) => string;
		open: boolean;
		onDirectoryToggle: (directoryId: string) => void;
		onItemFocus: (key: string) => void;
		onItemKeydown: (event: KeyboardEvent, key: string) => void;
	}

	let {
		directory,
		currentItemKey,
		directoryKey,
		getNoteKey,
		open,
		onDirectoryToggle,
		onItemFocus,
		onItemKeydown,
	}: Props = $props();
	let notes = $derived(directory.notes);

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
		class="mb-0.5 active:scale-100 active:bg-main-900/80 duration-0"
		onclick={() => onDirectoryToggle(directory.id)}
		onfocus={() => onItemFocus(directoryKey)}
		onkeydown={(event: KeyboardEvent) => onItemKeydown(event, directoryKey)}
		data-tree-item-key={directoryKey}
		role="treeitem"
		aria-expanded={notes?.length ? open : undefined}
		aria-level={1}
		tabindex={currentItemKey === directoryKey ? 0 : -1}
	>
		{#if open}
			<PhFolderOpenDuotone />
		{:else}
			<PhFolderSimpleDuotone />
		{/if}
		{directory.name}
	</Button>

	<div
		class={cn(
			"hidden flex-col gap-y-0.5 pl-6.5 absolute w-full opacity-0 blur-xs transition-[opacity,filter,display] transition-discrete ease-out-expo starting:opacity-0 starting:blur-xs",
			open ? "flex blur-none opacity-100 duration-300" : "duration-600",
		)}
		role="group"
		aria-hidden={open ? undefined : "true"}
	>
		<div
			aria-hidden="true"
			class="w-px absolute left-4 h-full bg-main-900"
		></div>
		{#each directory.notes ?? [] as note (note.id)}
			{@const noteKey = getNoteKey(directory.id, note.id)}
			<Button
				class={cn(
					"duration-0",
					note.id === page.params.note_id &&
						"bg-main-900 text-main-50 hover:text-main-50",
				)}
				data-tree-item-key={noteKey}
				role="treeitem"
				aria-level={2}
				aria-selected={note.id === page.params.note_id}
				tabindex={open && currentItemKey === noteKey ? 0 : -1}
				onfocus={() => onItemFocus(noteKey)}
				onkeydown={(event: KeyboardEvent) => onItemKeydown(event, noteKey)}
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
