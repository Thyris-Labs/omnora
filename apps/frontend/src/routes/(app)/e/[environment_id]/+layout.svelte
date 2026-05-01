<script lang="ts">
	import { TopBar } from "features/shell/components/top-bar";

	let { children } = $props();
</script>

<div class="flex flex-col h-dvh p-2 gap-y-1.5">
	<TopBar />
	<main class="flex-1 bg-main-900 border border-main-800 rounded-lg">
		{@render children?.()}
	</main>
</div>
