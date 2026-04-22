<script lang="ts">
	import { EnvironmentsBar } from "features/shell/components/environments-bar";
	import { Sidebar } from "features/shell/components/sidebar";

	let { children } = $props();
</script>

<div class="flex flex-col h-dvh">
	<EnvironmentsBar />
	<div class="flex flex-1">
		<Sidebar />
		<main class="flex-1">
			{@render children?.()}
		</main>
	</div>
</div>
