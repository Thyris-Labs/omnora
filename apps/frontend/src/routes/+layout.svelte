<script lang="ts">
	import "@fontsource-variable/inter/wght.css";
	import { initAuthStore } from "../shared/stores/auth.svelte";
	import "./layout.css";

	let { children } = $props();

	initAuthStore();
</script>

<!-- <svelte:head><link rel="icon" href={favicon} /></svelte:head> -->
{@render children()}
