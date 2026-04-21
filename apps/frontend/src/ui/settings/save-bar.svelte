<script lang="ts">
	import Button from "ui/primitives/button.svelte";

	interface Props {
		onReset: () => void;
	}

	let { onReset }: Props = $props();
</script>

<div
	class="flex w-full items-center justify-between border border-main-900 bg-main-950 py-2 pr-2 pl-3"
>
	<p class="text-sm">Some changes are not saved yet!</p>

	<div class="flex gap-x-2">
		<Button
			variant="ghost"
			class="text-sm text-main-500 hover:underline px-2.5 py-1"
			onclick={() => onReset()}
		>
			Reset
		</Button>
		<Button variant="positive" type="submit" class="text-sm">Save</Button>
	</div>
</div>
