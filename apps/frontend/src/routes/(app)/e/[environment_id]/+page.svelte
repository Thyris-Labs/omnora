<script lang="ts">
	import { MODULE_ENTRIES } from "modules/registry";
	import { shell } from "features/shell/store.svelte";
	import ModuleLauncherButton from "./module-launcher-button.svelte";
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="grid grid-cols-4 w-fit gap-4 justify-center">
		{#each MODULE_ENTRIES as mod}
			{@const Icon = mod.Icon}
			<ModuleLauncherButton
				icon={Icon}
				label={mod.name}
				onclick={() => shell.openModule(mod)}
			/>
		{/each}
	</div>
</div>
