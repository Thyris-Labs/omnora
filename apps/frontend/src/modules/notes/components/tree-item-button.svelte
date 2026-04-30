<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { cn } from "tailwind-variants";
	import Button from "ui/primitives/button.svelte";

	type Props = HTMLButtonAttributes & {
		class?: string;
		children?: Snippet;
	};

	let { class: className = "", children, ...restProps }: Props = $props();
</script>

<Button
	{...restProps}
	variant="unstyled"
	class={cn(
		"flex w-full items-center justify-start gap-x-2 border border-transparent px-2 py-1.5 text-sm text-main-500 outline-none transition-ds hover:bg-main-900 hover:text-main-200 active:bg-main-900/80 aria-selected:border-main-800 aria-selected:bg-main-900 aria-selected:text-main-100",
		className,
	)}
>
	{@render children?.()}
</Button>
