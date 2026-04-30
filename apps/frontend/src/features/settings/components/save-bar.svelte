<script lang="ts">
	import Button from "ui/primitives/button.svelte";

	interface Props {
		onReset: () => void;
	}

	let { onReset }: Props = $props();
</script>

<div
	class="flex w-full items-center justify-between border border-main-800 bg-main-950 py-2 pr-2 pl-3"
>
	<p class="text-sm">Some changes are not saved yet!</p>

	<div class="flex gap-x-2">
		<Button
			variant="unstyled"
			class="px-2.5 py-1 text-sm text-main-500 outline-none transition-ds hover:text-main-200 hover:underline"
			onclick={() => onReset()}
		>
			Reset
		</Button>
		<Button
			variant="unstyled"
			type="submit"
			class="border border-main-100 bg-main-900 px-3 py-1 text-sm font-medium text-main-100 outline-none transition-ds hover:bg-main-900/80 active:scale-[0.98]"
		>
			Save
		</Button>
	</div>
</div>
