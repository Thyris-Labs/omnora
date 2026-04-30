<script lang="ts">
	import PhPlusBold from "~icons/ph/plus-bold";
	import TabButton from "./tab-button.svelte";
	import PhGearDuotone from "~icons/ph/gear-duotone";
	import { settings } from "features/settings/store.svelte";
	import EnvironmentSelector from "./environment-selector.svelte";
	import { shell } from "features/shell/store.svelte";
	import TopBarIconButton from "./top-bar-icon-button.svelte";
</script>

<nav class="h-10 w-full flex border-b border-main-800 justify-between">
	<div class="flex p-1 gap-x-1">
		<ul class="flex items-center gap-x-1">
			{#each shell.tabs as tab (tab.id)}
				<TabButton {tab} />
			{/each}
		</ul>

		<TopBarIconButton label="New tab" onclick={() => shell.newTab()}>
			<PhPlusBold aria-hidden="true" />
		</TopBarIconButton>
	</div>

	<div class="flex">
		<EnvironmentSelector />
		<TopBarIconButton
			label="Open settings"
			bordered
			onclick={() => settings.openSettings()}
		>
			<PhGearDuotone aria-hidden="true" />
		</TopBarIconButton>
	</div>
</nav>
