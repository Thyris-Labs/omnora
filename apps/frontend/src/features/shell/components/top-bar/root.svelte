<script lang="ts">
	import PhPlusBold from "~icons/ph/plus-bold";
	import TabButton from "./tab-button.svelte";
	import PhGearDuotone from "~icons/ph/gear-duotone";
	import { settings } from "features/settings/store.svelte";
	import EnvironmentSelector from "./environment-selector.svelte";
	import { shell } from "features/shell/store.svelte";
	import TopBarIconButton from "./top-bar-icon-button.svelte";
</script>

<nav class="h-7 w-full flex justify-between">
	<div class="flex gap-x-1">
		<ul class="flex items-center gap-x-1">
			{#each shell.tabs as tab (tab.id)}
				<TabButton {tab} />
			{/each}
		</ul>

		<TopBarIconButton label="New tab" onclick={() => shell.newTab()}>
			<PhPlusBold aria-hidden="true" class="size-4" />
		</TopBarIconButton>
	</div>

	<div class="flex gap-x-1">
		<EnvironmentSelector />
		<TopBarIconButton
			label="Open settings"
			onclick={() => settings.openSettings()}
		>
			<PhGearDuotone aria-hidden="true" />
		</TopBarIconButton>
	</div>
</nav>
