<script lang="ts">
	import PhWarningDuotone from "~icons/ph/warning-duotone";

	interface Props {
		message?: string;
	}

	let { message }: Props = $props();
</script>

<div
	role="alert"
	class="mt-6 text-sm bg-main-900 w-fit py-1.5 px-2.5 text-main-100 flex items-center gap-x-2"
>
	<PhWarningDuotone aria-hidden="true" />
	{message}
</div>
