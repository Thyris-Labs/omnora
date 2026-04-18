<script lang="ts">
	import Button from "ui/primitives/button.svelte";
	import PhFinnTheHumanFill from "~icons/ph/finn-the-human-fill";
	import PhPlusBold from "~icons/ph/plus-bold";
	import EnvironmentsButton from "./button.svelte";

	// FIXME: Remove when we start actually fetching the environments
	const environments: Array<Environment> = [
		{
			id: "1",
			avatar:
				"https://i.pinimg.com/1200x/84/93/76/8493765a2644be06f4dff2566f67ff38.jpg",
			name: "Life",
			created_at: "2026-04-17 19:03:45.258142+00",
			updated_at: "2026-04-17 19:03:45.258142+00",
		},
		{
			id: "2",
			avatar:
				"https://i.pinimg.com/736x/11/e2/99/11e29975760d0df23ef8ad03f3401f89.jpg",
			name: "Work",
			created_at: "2026-04-17 22:03:45.258142+00",
			updated_at: "2026-04-17 22:03:45.258142+00",
		},
	];
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
		{#each environments as env (env.id)}
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
