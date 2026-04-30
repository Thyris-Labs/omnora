<script lang="ts">
	import type { Snippet } from "svelte";
	import PhFinnTheHumanFill from "~icons/ph/finn-the-human-fill";

	type Props = {
		title: string;
		description: string;
		footerPrompt: string;
		footerHref: string;
		footerLabel: string;
		children?: Snippet;
	};

	let {
		title,
		description,
		footerPrompt,
		footerHref,
		footerLabel,
		children,
	}: Props = $props();
</script>

<div class="min-h-screen flex items-center justify-center">
	<main class="mx-auto w-full max-w-90 flex flex-col">
		<div class="flex flex-col items-start gap-y-4">
			<div
				class="flex size-12 items-center justify-center border border-main-800 bg-main-900 text-main-200"
			>
				<!-- FIXME: change this logo when we have our own -->
				<PhFinnTheHumanFill class="size-7" />
			</div>
			<div class="flex flex-col gap-y-1">
				<h1 class="text-xl font-semibold">{title}</h1>
				<p class="text-main-500/75">{description}</p>
			</div>
		</div>

		{@render children?.()}

		<p class="mt-4 text-sm text-main-500">
			{footerPrompt}
			<a class="text-main-100" href={footerHref}>{footerLabel}</a>
		</p>
	</main>
</div>
