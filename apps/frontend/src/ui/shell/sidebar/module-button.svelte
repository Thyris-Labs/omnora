<script lang="ts">
	import type { Module } from "shared/types/module";
	import Button from "ui/primitives/button.svelte";
	import { MODULES } from "./modules-informations";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";

	let { id, type }: Module = $props();
	let Icon = $derived(MODULES[type].Icon);

	const isActive = $derived(page.params.module_id === id);
</script>

<Button
	state={isActive ? "active" : "default"}
	onclick={() =>
		goto(
			resolve("/(app)/e/[environment_id]/m/[module_id]", {
				environment_id: page.params.environment_id!,
				module_id: id,
			}),
		)}
>
	<Icon class="size-4.5" />
	{MODULES[type].name}
</Button>
