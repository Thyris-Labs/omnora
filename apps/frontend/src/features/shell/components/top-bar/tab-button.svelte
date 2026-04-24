<script lang="ts">
	import { shell, type ShellTab } from "features/shell/store.svelte";
	import { cn } from "tailwind-variants";
	import Button from "ui/primitives/button.svelte";
	import PhXBold from "~icons/ph/x-bold";

	let { tab }: { tab: ShellTab } = $props();

	const isActive = $derived(shell.activeTabId === tab.id);
</script>

<li
	class="h-full border border-transparent data-[active=true]:border-main-800 data-[active=true]:bg-main-900 flex items-center relative group pr-2"
	data-active={isActive}
>
	<Button
		variant="ghost"
		aria-current={isActive ? "page" : undefined}
		class={cn(
			"max-w-44 pl-2 pr-1.5 gap-x-2 select-none h-full py-1.75 text-sm relative active:scale-100 rounded-none hover:bg-transparent duration-0",
			isActive ? "text-main-50 hover:text-main-50" : "text-main-50/30",
		)}
		onclick={() => shell.selectTab(tab.id)}
	>
		<tab.Icon class="size-4 shrink-0" />
		<span class="truncate">{tab.name}</span>
	</Button>

	<Button
		variant="ghost"
		class="p-0 size-4.5 text-main-500 duration-0"
		onclick={() => shell.closeTab(tab.id)}
	>
		<PhXBold width={12} />
	</Button>
</li>
