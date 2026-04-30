<script lang="ts">
	import { TopBar } from "features/shell/components/top-bar";

	let { children } = $props();
</script>

<div class="flex flex-col h-dvh p-2">
	<TopBar />
	<main class="flex-1">
		{@render children?.()}
	</main>
</div>
