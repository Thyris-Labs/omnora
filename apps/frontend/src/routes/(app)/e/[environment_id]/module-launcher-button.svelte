<script lang="ts">
	import type { Component } from "svelte";
	import type { HTMLButtonAttributes, SVGAttributes } from "svelte/elements";
	import Button from "ui/primitives/button.svelte";

	type Props = HTMLButtonAttributes & {
		icon: Component<SVGAttributes<SVGSVGElement>, {}>;
		label: string;
	};

	let { icon: Icon, label, ...restProps }: Props = $props();
</script>

<Button
	{...restProps}
	variant="unstyled"
	aria-label={label}
	class="flex size-18 items-center justify-center border border-main-800 text-main-500/50 outline-none transition-ds hover:border-main-500 hover:bg-main-900 hover:text-main-200"
>
	<Icon width={24} height={24} aria-hidden="true" />
</Button>
