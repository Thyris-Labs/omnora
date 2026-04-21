<script lang="ts">
	import "@fontsource-variable/inter/wght.css";
	import "./layout.css";

	let { children } = $props();
</script>

<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
{@render children()}
