<script lang="ts">
	import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import { presence } from "lib/transitions/presence";

	type Props = WithoutChildrenOrChild<Dialog.ContentProps> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className = "", children, ...restProps }: Props = $props();
</script>

<Dialog.Content {...restProps} forceMount>
	{#snippet child({ props, open })}
		{#if open}
			<div
				{...props}
				in:presence={{ duration: 150, scale: 0.95, blur: 2 }}
				out:presence={{ duration: 75, scale: 0.98, blur: 2 }}
				class={cn(
					"fixed left-1/2 top-1/2 -translate-1/2 border border-main-800 bg-main-950 shadow-2xl shadow-main-950 z-9999",
					className,
				)}
			>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Dialog.Content>
