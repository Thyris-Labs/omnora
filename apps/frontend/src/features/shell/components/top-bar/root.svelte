<script lang="ts">
	import Button from "ui/primitives/button.svelte";
	import PhPlusBold from "~icons/ph/plus-bold";
	import TabButton from "./tab-button.svelte";
	import PhGearDuotone from "~icons/ph/gear-duotone";
	import { settings } from "features/settings/store.svelte";
	import EnvironmentSelector from "./environment-selector.svelte";
	import { shell } from "features/shell/store.svelte";
</script>

<nav class="h-9 w-full flex border-b border-main-800 relative">
	<div class="flex">
		<ul class="flex items-center">
			{#each shell.tabs as tab (tab.id)}
				<TabButton {tab} />
			{/each}
		</ul>

		<Button
			variant="ghost"
			class="aspect-square h-full text-main-50/30 border-r border-main-900"
			onmousedown={() => shell.newTab()}
		>
			<PhPlusBold />
		</Button>
	</div>

	<div class="absolute flex items-center h-full right-0">
		<EnvironmentSelector />
		<Button
			variant="ghost"
			class="aspect-square h-full flex items-center justify-center border-l border-main-900 text-main-50/40 p-0 active:scale-100"
			onmousedown={() => settings.openSettings()}
		>
			<PhGearDuotone />
		</Button>
	</div>
</nav>
