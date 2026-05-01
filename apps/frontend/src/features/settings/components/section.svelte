<script lang="ts">
	import { cn } from "tailwind-variants";
	import type { Snippet } from "svelte";

	type Props = {
		title: string;
		description?: string;
		class?: string;
		children?: Snippet;
	};

	let { title, description, class: className = "", children }: Props = $props();
</script>

<section class="last:border-0 border-b border-main-800">
	<header
		class="border-b border-main-800 px-4.5 py-2.5 flex items-center gap-x-2"
	>
		<h2 class="text-sm font-[465] text-main-50">{title}</h2>
		{#if description}
			<p class="text-sm text-main-300 mt-px">{description}</p>
		{/if}
	</header>

	<div class={cn("px-6 py-6", className)}>
		{@render children?.()}
	</div>
</section>
