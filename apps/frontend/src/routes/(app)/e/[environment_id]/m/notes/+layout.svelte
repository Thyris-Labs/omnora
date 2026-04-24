<script lang="ts">
	import Sidebar from "modules/notes/components/sidebar.svelte";

	let { children } = $props();
</script>

<div class="flex h-full w-full">
	<Sidebar />
	{@render children()}
</div>
