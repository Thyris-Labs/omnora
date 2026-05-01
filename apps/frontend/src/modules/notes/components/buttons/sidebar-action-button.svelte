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
		"flex w-full items-center justify-start gap-x-2 px-2 py-1.5 text-sm text-main-300 outline-none hover:bg-main-700 hover:text-main-100 rounded z-1",
		className,
	)}
>
	{@render children?.()}
</Button>
