<script lang="ts">
	import type { Module } from "shared/types/module";
	import Button from "ui/primitives/button.svelte";
	import { MODULES } from "./modules-informations";

	let { id, type }: Module = $props();
	let Icon = $derived(MODULES[type].Icon);
</script>

<Button variant="ghost" class="flex w-full justify-start gap-x-2 px-3 py-2">
	<Icon class="size-4.5" />
	{MODULES[type].name}
</Button>
