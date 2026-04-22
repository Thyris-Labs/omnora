<script lang="ts">
	import Input from "ui/primitives/input.svelte";
	import PhMagnifyingGlassDuotone from "~icons/ph/magnifying-glass-duotone";
	import { page } from "$app/state";
	import ModuleButton from "./module-button.svelte";
	import UserBar from "./user-bar.svelte";
	import { auth } from "features/auth/store.svelte";

	const environments = auth.user.environments;
	const modules = $derived.by(() => {
		const currEnvID = page.params.environment_id;
		if (!currEnvID) return [];

		const environment = environments.find((e) => e.id === currEnvID);
		if (!environment) return [];

		return environment.modules;
	});
</script>

<aside class="w-60 border-r border-main-900 flex flex-col">
	<Input
		id="search-bar"
		name="search-bar"
		variant="ghost"
		class="border-b border-main-900 py-2.5 px-2 focus-visible:ring-0"
		leftIconClass="text-main-600 mb-0.25"
		placeholder="Find..."
		icons={{ left: PhMagnifyingGlassDuotone }}
	/>

	<nav class="flex-1">
		<ul class="flex flex-col p-2">
			{#each modules as module (module.id)}
				<ModuleButton {...module} />
			{/each}
		</ul>
	</nav>

	<UserBar />
</aside>
