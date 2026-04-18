<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import { apiFetch } from "shared/helpers/api";
	import { getAuthStore } from "shared/stores/auth.svelte";

	let { children } = $props();
	const authStore = getAuthStore();
	let authCheckController: AbortController | null = null;

	async function redirectIfAuthenticated() {
		if (authStore.userData) {
			goto(resolve("/(app)/e"), { replaceState: true });
			return;
		}

		authCheckController?.abort();
		authCheckController = new AbortController();

		const result = await apiFetch("/auth/check", {
			signal: authCheckController.signal,
		});

		if (result.isOk()) {
			goto(resolve("/(app)/e"), { replaceState: true });
		}
	}

	onMount(() => {
		void redirectIfAuthenticated();

		return () => {
			authCheckController?.abort();
		};
	});
</script>

{@render children()}
