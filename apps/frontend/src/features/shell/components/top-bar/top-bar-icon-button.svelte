<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { cn } from "tailwind-variants";
	import Button from "ui/primitives/button.svelte";

	type Props = HTMLButtonAttributes & {
		label: string;
		bordered?: boolean;
		class?: string;
		children?: Snippet;
	};

	let {
		label,
		bordered = false,
		class: className = "",
		children,
		...restProps
	}: Props = $props();
</script>

<Button
	{...restProps}
	variant="unstyled"
	aria-label={label}
	class={cn(
		"flex h-full aspect-square items-center justify-center text-main-500 outline-none transition-ds hover:bg-main-900 hover:text-main-200",
		bordered && "border-l border-main-800",
		className,
	)}
>
	{@render children?.()}
</Button>
