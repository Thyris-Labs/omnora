<script lang="ts">
	import { presence } from "shared/transitions/presence";
	import Button from "ui/primitives/button.svelte";

	interface Props {
		onReset: () => void;
	}

	let { onReset }: Props = $props();
</script>

<div
	class="flex items-center absolute left-1/2 -translate-x-1/2 -bottom-4 w-2/3 bg-main-950 border border-main-900 justify-between py-2 pr-2 pl-3"
	in:presence={{ duration: 100, y: 4, blur: 4 }}
	out:presence={{ duration: 100, y: 8, blur: 4 }}
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
		<Button variant="positive" type="submit">Save</Button>
	</div>
</div>
