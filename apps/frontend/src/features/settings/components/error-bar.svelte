<script lang="ts">
	import PhWarningDuotone from "~icons/ph/warning-duotone";

	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<div
	role="alert"
	class="flex w-full items-center justify-center gap-x-2 border border-main-100 bg-main-900 px-3 py-2 text-sm text-main-100"
>
	<PhWarningDuotone class="size-4 shrink-0" aria-hidden="true" />
	<p>{message}</p>
</div>
