<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { cn } from "tailwind-variants";
	import Button from "ui/primitives/button.svelte";
	import type { Environment } from "lib/types";

	let { id, avatar, name }: Environment = $props();
	const isActive = $derived(page.params.environment_id === id);
</script>

<li class="h-full border-r border-main-900 flex items-center">
	<Button
		variant="ghost"
		class={cn(
			"pl-2.5 pr-3 gap-x-2 select-none h-full py-1.75 text-sm relative active:scale-100",
			isActive ? "text-main-50" : "text-main-50/30 hover:text-main-50/50",
			isActive &&
				"after:absolute after:content-[''] after:w-full after:h-px after:bg-main-950 after:-bottom-px after:left-0",
		)}
		onclick={() =>
			goto(resolve("/(app)/e/[environment_id]", { environment_id: id }))}
	>
		<img
			src={avatar}
			alt=""
			draggable="false"
			class="h-full aspect-square rounded-full object-cover select-none"
		/>
		{name}
	</Button>
</li>
