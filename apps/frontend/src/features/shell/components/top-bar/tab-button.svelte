<script lang="ts">
	import { shell, type ShellTab } from "features/shell/store.svelte";
	import { cn } from "tailwind-variants";
	import Button from "ui/primitives/button.svelte";
	import PhXBold from "~icons/ph/x-bold";

	let { tab }: { tab: ShellTab } = $props();

	const isActive = $derived(shell.activeTabId === tab.id);
</script>

<li
	class={cn(
		"h-full border-r border-r-main-900 has-[+[data-active=true]]:border-r-main-800 data-[active=true]:border-r-main-800 flex items-center relative group pr-2.5",
		isActive &&
			"after:absolute after:content-[''] after:w-full after:z-10 after:h-px after:bg-main-950 after:-bottom-px after:left-0",
	)}
	data-active={isActive}
>
	<Button
		variant="ghost"
		aria-current={isActive ? "page" : undefined}
		class={cn(
			"max-w-44 pl-3 pr-1.5 gap-x-2 select-none h-full py-1.75 text-sm relative active:scale-100 rounded-none hover:bg-transparent",
			isActive ? "text-main-50" : "text-main-50/30",
		)}
		onclick={() => shell.selectTab(tab.id)}
	>
		<tab.Icon class="size-4 shrink-0" />
		<span class="truncate">{tab.name}</span>
	</Button>

	<Button
		variant="ghost"
		class="p-0 size-4.5 text-main-500"
		onclick={() => shell.closeTab(tab.id)}
	>
		<PhXBold width={12} />
	</Button>
</li>
