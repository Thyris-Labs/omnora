<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";
	import Button from "ui/primitives/button.svelte";
	import Spinner from "ui/icons/spinner.svelte";

	type Props = HTMLButtonAttributes & {
		src: string;
		uploading: boolean;
	};

	let { src, uploading, ...restProps }: Props = $props();
</script>

<Button
	{...restProps}
	variant="unstyled"
	aria-label="Upload avatar"
	aria-busy={uploading}
	disabled={uploading}
	class="relative aspect-square size-full border border-main-800 p-2 outline-none transition-ds hover:border-main-500 hover:bg-main-900"
>
	<img src={src} alt="" class="h-full w-full object-cover" />
	{#if uploading}
		<div
			class="absolute inset-2 flex items-center justify-center bg-main-950/70 text-main-200"
			aria-hidden="true"
		>
			<Spinner width={18} />
		</div>
	{/if}
</Button>
