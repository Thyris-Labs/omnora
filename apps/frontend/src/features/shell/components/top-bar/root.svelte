<script lang="ts">
	import Button from "ui/primitives/button.svelte";
	import PhFinnTheHumanFill from "~icons/ph/finn-the-human-fill";
	import PhPlusBold from "~icons/ph/plus-bold";
	import EnvironmentsButton from "./button.svelte";
	import PhGearDuotone from "~icons/ph/gear-duotone";
	import { auth } from "features/auth/store.svelte";
	import { settings } from "features/settings/store.svelte";
	import EnvironmentSelector from "./environment-selector.svelte";
</script>

<nav class="h-9 w-full flex border-b border-main-900 justify-between">
	<div class="flex">
		<ul class="flex items-center">
			{#each auth.user.environments as env (env.id)}
				<EnvironmentsButton {...env} />
			{/each}
		</ul>

		<Button
			variant="ghost"
			class="aspect-square h-full text-main-50/30 border-r border-main-900"
		>
			<PhPlusBold />
		</Button>
	</div>

	<div class="flex">
		<EnvironmentSelector />
		<Button
			variant="ghost"
			class="aspect-square h-full flex items-center justify-center border-l border-main-900 text-main-50/40 p-0"
			onclick={() => settings.openSettings()}
		>
			<PhGearDuotone />
		</Button>
	</div>
</nav>
