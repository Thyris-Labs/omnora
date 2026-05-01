<script lang="ts">
	import { shell } from "features/shell/store.svelte";
	import type { ShellTab } from "features/shell/types";
	import { cn } from "tailwind-variants";
	import Button from "ui/primitives/button.svelte";
	import PhXBold from "~icons/ph/x-bold";

	let { tab }: { tab: ShellTab } = $props();

	const isActive = $derived(shell.activeTabId === tab.id);
</script>

<li
	class="h-full data-[active=true]:bg-main-600/75 flex items-center relative group pr-2 rounded"
	data-active={isActive}
>
	<Button
		variant="unstyled"
		aria-current={isActive ? "page" : undefined}
		class={cn(
			"flex h-full max-w-44 items-center gap-x-2 pl-2 pr-1.5 text-sm outline-none",
			isActive ? "text-main-50" : "text-main-300 hover:text-main-100",
		)}
		onclick={() => shell.selectTab(tab.id)}
	>
		<tab.Icon class="size-4 shrink-0" />
		<span class="truncate">{tab.name}</span>
	</Button>

	<Button
		variant="unstyled"
		aria-label={`Close ${tab.name}`}
		class="flex size-4.5 shrink-0 items-center justify-center group-data-[active=true]:text-main-200 group-data-[active=true]:hover:text-main-50 text-main-300 hover:text-main-100 outline-none transition-ds delay-50"
		onclick={() => shell.closeTab(tab.id)}
	>
		<PhXBold width={12} aria-hidden="true" />
	</Button>
</li>
