<script lang="ts">
	import { ContextMenu, type WithoutChildrenOrChild } from "bits-ui";
	import type { Snippet } from "svelte";

	type Props = WithoutChildrenOrChild<ContextMenu.ItemProps> & {
		children?: Snippet;
	};

	let { children, ...restProps }: Props = $props();
</script>

<ContextMenu.Item
	{...restProps}
	class="px-2 py-0.75 hover:bg-blue-500/80 rounded text-sm"
>
	{@render children?.()}
</ContextMenu.Item>
