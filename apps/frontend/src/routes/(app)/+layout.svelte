<script lang="ts">
	import { afterNavigate, goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import { client } from "lib/api";
	import { Settings } from "features/settings";
	import { auth } from "features/auth/store.svelte";

	let { children } = $props();
	let appReady = $state(false);
	let setupFailed = $state(false);
	let showLoading = $state(false);
	let authCheckController: AbortController | null = null;

	async function checkAuth() {
		authCheckController?.abort();
		authCheckController = new AbortController();

		const [, error] = await client.get("/api/v1/auth/check", {
			signal: authCheckController.signal,
		}).safe();

		if (!error) return;
		if (error.status !== 401) return;

		goto(resolve("/(guest)/signin"), { replaceState: true });
	}

	afterNavigate(() => {
		void checkAuth();
	});

	onMount(() => {
		const setupController = new AbortController();
		const loadingTimer = window.setTimeout(() => {
			showLoading = true;
		}, 200);

		void auth.setup(setupController.signal).then(async (error) => {
			window.clearTimeout(loadingTimer);

			if (error?.status === 401) {
				goto(resolve("/(guest)/signin"), { replaceState: true });
				setupFailed = true;
				return;
			}

			const firstEnvironment = auth.user.environments[0];
			if (!page.params.environment_id && firstEnvironment) {
				await goto(
					resolve("/(app)/e/[environment_id]", {
						environment_id: firstEnvironment.id,
					}),
					{ replaceState: true },
				);
			}

			appReady = true;
		});

		return () => {
			window.clearTimeout(loadingTimer);
			setupController.abort();
		};
	});
</script>

{#if appReady}
	{@render children()}
	<Settings />
{:else if setupFailed}
	<div
		class="min-h-dvh bg-main-950 text-main-100 flex items-center justify-center px-6"
	>
		<p class="text-sm text-main-400">Could not load your session.</p>
	</div>
{:else}
	<div
		class="min-h-dvh bg-main-950 text-main-100 flex items-center justify-center px-6"
		aria-busy="true"
	>
		{#if showLoading}
			<div class="flex items-center gap-x-3 text-sm text-main-400">
				<div class="size-2 rounded-full bg-main-400 animate-pulse"></div>
				Loading your workspace...
			</div>
		{/if}
	</div>
{/if}
