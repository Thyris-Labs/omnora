<script lang="ts">
	import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";

	type Props = WithoutChildrenOrChild<Dialog.OverlayProps> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className = "", children, ...restProps }: Props = $props();
</script>

<Dialog.Overlay {...restProps} forceMount>
	{#snippet child({ props, open })}
		{#if open}
			<div
				{...props}
				transition:fade={{ duration: 120 }}
				class={cn("fixed inset-0 bg-black/65 z-9998", className)}
			>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Dialog.Overlay>
