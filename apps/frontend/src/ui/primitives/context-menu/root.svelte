<script lang="ts">
	import { ContextMenu } from "bits-ui";
	import ContextMenuContent from "./content.svelte";

	let { children } = $props();
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger class="absolute inset-0 outline-0"></ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenuContent>
			{@render children?.()}
		</ContextMenuContent>
	</ContextMenu.Portal>
</ContextMenu.Root>
