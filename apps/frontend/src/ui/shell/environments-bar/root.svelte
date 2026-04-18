<script lang="ts">
	import Button from "ui/primitives/button.svelte";
	import PhFinnTheHumanFill from "~icons/ph/finn-the-human-fill";
	import PhPlusBold from "~icons/ph/plus-bold";
	import EnvironmentsButton from "./button.svelte";
	import { getAuthStore } from "shared/stores/auth.svelte";

	const user = getAuthStore().user;
</script>

<nav class="h-9 w-full flex border-b border-main-900">
	<!-- LOGO -->
	<div
		class="h-full aspect-square flex items-center justify-center border-r border-main-900"
	>
		<PhFinnTheHumanFill class="text-main-50/40 size-4" />
	</div>

	<!-- ENVIRONMENTS -->
	<ul class="flex items-center">
		{#each user.environments as env (env.id)}
			<EnvironmentsButton {...env} />
		{/each}
	</ul>

	<!-- CREATE ENVIRONMENT -->
	<Button
		variant="ghost"
		class="aspect-square h-full text-main-50/30 border-r border-main-900"
	>
		<PhPlusBold />
	</Button>
</nav>
