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
		variant="unstyled"
		aria-current={isActive ? "page" : undefined}
		class={cn(
			"flex h-full max-w-44 items-center gap-x-2 py-1.75 pl-2 pr-1.5 text-sm outline-none transition-ds",
			isActive ? "text-main-100" : "text-main-500 hover:text-main-200",
		)}
		onclick={() => shell.selectTab(tab.id)}
	>
		<tab.Icon class="size-4 shrink-0" />
		<span class="truncate">{tab.name}</span>
	</Button>

	<Button
		variant="unstyled"
		aria-label={`Close ${tab.name}`}
		class="flex size-4.5 shrink-0 items-center justify-center text-main-500 outline-none transition-ds hover:text-main-200"
		onclick={() => shell.closeTab(tab.id)}
	>
		<PhXBold width={12} aria-hidden="true" />
	</Button>
</li>
