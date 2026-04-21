<script lang="ts">
	import PhWarningDuotone from "~icons/ph/warning-duotone";

	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<div
	role="alert"
	class="flex w-full items-center justify-center gap-x-2 border border-rose-500 bg-rose-800 px-3 py-2 text-sm text-main-50"
>
	<PhWarningDuotone class="size-4 shrink-0" aria-hidden="true" />
	<p>{message}</p>
</div>
