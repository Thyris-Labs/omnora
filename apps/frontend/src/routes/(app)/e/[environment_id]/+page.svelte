<script lang="ts">
	import { MODULE_ENTRIES } from "modules/registry";
	import Button from "ui/primitives/button.svelte";
	import { shell } from "features/shell/store.svelte";
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="grid grid-cols-4 w-fit gap-4 justify-center">
		{#each MODULE_ENTRIES as mod}
			{@const Icon = mod.Icon}
			<Button
				variant="outline"
				class="size-18 flex items-center justify-center text-main-700"
				onclick={() => shell.openModule(mod)}
			>
				<Icon width={24} height={24} />
			</Button>
		{/each}
	</div>
</div>
