<script lang="ts">
	import { ContextMenu, type WithoutChildrenOrChild } from "bits-ui";
	import type { Snippet } from "svelte";
	import { cn } from "tailwind-variants";

	type Props = WithoutChildrenOrChild<ContextMenu.ContentProps> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<ContextMenu.Content
	{...restProps}
	class={cn(
		"bg-main-800/80 backdrop-blur-md border-[0.5px] border-main-500! rounded-lg p-1 z-9999 min-w-50 shadow-xl",
		className,
	)}
>
	{@render children?.()}
</ContextMenu.Content>
