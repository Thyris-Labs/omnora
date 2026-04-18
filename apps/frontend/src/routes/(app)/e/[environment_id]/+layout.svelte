<script lang="ts">
	import { EnvironmentsBar } from "ui/shell/environments-bar";
	import { Sidebar } from "ui/shell/sidebar";

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
