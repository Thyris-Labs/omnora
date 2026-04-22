<script lang="ts">
	import { shell, type ShellTab } from "features/shell/store.svelte";
	import { cn } from "tailwind-variants";
	import Button from "ui/primitives/button.svelte";
	import PhXBold from "~icons/ph/x-bold";

	let { tab }: { tab: ShellTab } = $props();

	const isActive = $derived(shell.activeTabId === tab.id);
</script>

<li
	class="h-full border-r border-r-main-900 has-[+[data-active=true]]:border-r-main-800 data-[active=true]:border-r-main-800 flex items-center relative hover:pr-5 transition-[padding] group"
	data-active={isActive}
>
	<Button
		variant="ghost"
		aria-current={isActive ? "page" : undefined}
		class={cn(
			"min-w-24 max-w-44 pl-2.5 pr-3 gap-x-2 select-none h-full py-1.75 text-sm relative active:scale-100 rounded-none hover:bg-transparent",
			isActive ? "text-main-50" : "text-main-50/30",
			isActive &&
				"after:absolute after:content-[''] after:w-full group-hover:after:w-[calc(100%+1.25rem)] after:z-10 after:transition-[color,width] after:duration-150 after:h-px after:bg-main-950 after:-bottom-px after:left-0",
		)}
		onclick={() => shell.selectTab(tab.id)}
	>
		<tab.Icon class="size-4 shrink-0" />
		<span class="truncate">{tab.name}</span>
	</Button>

	<Button
		variant="ghost"
		class="absolute right-1.5 p-0 size-4.5 group-hover:opacity-100 opacity-0 pointer-events-none group-hover:pointer-events-auto transition-[opacity,filter] blur-xs group-hover:blur-none duration-75 group-hover:duration-200 text-main-500"
		onclick={() => shell.closeTab(tab.id)}
	>
		<PhXBold width={12} />
	</Button>
</li>
