<script lang="ts">
	import { DropdownMenu, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import { presence } from "lib/transitions/presence";

	type Props = WithoutChildrenOrChild<DropdownMenu.ContentProps> & {
		class?: string;
		children?: Snippet;
	};

	let {
		class: className = "",
		children,
		sideOffset = 8,
		...restProps
	}: Props = $props();
</script>

<DropdownMenu.Content {...restProps} {sideOffset} forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div
					{...props}
					in:presence={{ duration: 0 }}
					out:presence={{ duration: 140, y: 4, blur: 4 }}
					class={cn(
						"z-50 border border-main-900 bg-main-950 p-1 shadow-xl shadow-black/20 focus-visible:outline-none",
						className,
					)}
				>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</DropdownMenu.Content>
