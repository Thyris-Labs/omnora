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
		side = "top",
		...restProps
	}: Props = $props();

	const offsets = {
		top: { x: 0, y: 4 },
		bottom: { x: 0, y: -4 },
		left: { x: -4, y: 0 },
		right: { x: 4, y: 0 },
	} as const;

	const { x, y } = $derived(offsets[side]);
</script>

<DropdownMenu.Content {...restProps} {sideOffset} forceMount>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div
					{...props}
					in:presence={{ duration: 0 }}
					out:presence={{ duration: 140, y, x, blur: 4 }}
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
