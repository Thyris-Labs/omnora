<script lang="ts">
	import { apiErrorMessage, client } from "lib/api";
	import { notes } from "modules/notes/store.svelte";
	import type { TrashDirectory, TrashNote } from "modules/notes/types";
	import { onMount } from "svelte";
	import Button from "ui/primitives/button.svelte";

	type TrashRow =
		| {
				kind: "note";
				item: TrashNote;
		  }
		| {
				kind: "directory";
				item: TrashDirectory;
		  };

	let deletedNotes = $state<TrashNote[]>([]);
	let deletedDirectories = $state<TrashDirectory[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let busyRowKey = $state<string | null>(null);

	const rows = $derived.by<TrashRow[]>(() => {
		return [
			...deletedDirectories.map((item) => ({ kind: "directory", item }) as const),
			...deletedNotes.map((item) => ({ kind: "note", item }) as const),
		];
	});

	onMount(() => {
		void loadTrash();
	});

	function rowKey(row: TrashRow) {
		return `${row.kind}:${row.item.id}`;
	}

	function rowTitle(row: TrashRow) {
		return row.item.title?.trim() || "Untitled";
	}

	function rowContent(row: TrashRow) {
		if (row.kind === "directory") return "Directory";
		return row.item.content?.trim() || "No content";
	}

	function removeRow(row: TrashRow) {
		if (row.kind === "directory") {
			deletedDirectories = deletedDirectories.filter(
				(directory) => directory.id !== row.item.id,
			);
			return;
		}

		deletedNotes = deletedNotes.filter((note) => note.id !== row.item.id);
	}

	async function loadTrash() {
		isLoading = true;
		errorMessage = null;

		const [data, error] = await client.get("/api/v1/notes/trash", {}).safe();

		isLoading = false;

		if (error) {
			errorMessage = apiErrorMessage(error);
			return;
		}

		deletedDirectories = data.directories;
		deletedNotes = data.notes;
	}

	async function recover(row: TrashRow) {
		const key = rowKey(row);
		busyRowKey = key;

		const succeeded =
			row.kind === "directory"
				? await notes.recoverDirectory(row.item.id)
				: await notes.recoverNote(row.item.id);

		busyRowKey = null;

		if (!succeeded) return;

		removeRow(row);
	}

	async function deleteForever(row: TrashRow) {
		const key = rowKey(row);
		busyRowKey = key;

		const succeeded =
			row.kind === "directory"
				? await notes.permanentlyDeleteDirectory(row.item.id)
				: await notes.permanentlyDeleteNote(row.item.id);

		busyRowKey = null;

		if (!succeeded) return;

		removeRow(row);
	}
</script>

<section class="flex-1 overflow-auto px-8 py-8">
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-y-4">
		<div>
			<h1 class="text-2xl font-semibold text-main-50">Trash</h1>
			<p class="mt-1 text-sm text-main-400">Deleted notes and directories</p>
		</div>

		{#if isLoading}
			<p class="text-sm text-main-400">Loading trash...</p>
		{:else if errorMessage}
			<p class="text-sm text-red-300">{errorMessage}</p>
		{:else if rows.length === 0}
			<p class="text-sm text-main-400">Trash is empty.</p>
		{:else}
			<div class="overflow-hidden rounded border border-main-800">
				{#each rows as row (rowKey(row))}
					<div
						class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b border-main-800 px-4 py-3 last:border-b-0"
					>
						<div class="min-w-0">
							<div class="flex items-center gap-x-2">
								<p class="truncate text-sm font-medium text-main-100">
									{rowTitle(row)}
								</p>
								<span class="text-xs capitalize text-main-500">{row.kind}</span>
							</div>
							<p class="mt-1 line-clamp-2 text-sm text-main-400">
								{rowContent(row)}
							</p>
						</div>

						<div class="flex items-center gap-x-2">
							<Button
								class="rounded px-2.5 py-1 text-xs"
								disabled={busyRowKey === rowKey(row)}
								onclick={() => void recover(row)}
							>
								Recover
							</Button>
							<Button
								variant="unstyled"
								class="rounded border border-red-500/30 px-2.5 py-1 text-xs text-red-300 hover:border-red-400/60 hover:text-red-200"
								disabled={busyRowKey === rowKey(row)}
								onclick={() => void deleteForever(row)}
							>
								Delete
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
