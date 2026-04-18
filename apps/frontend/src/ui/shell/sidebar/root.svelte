<script lang="ts">
	import Button from "ui/primitives/button.svelte";
	import Input from "ui/primitives/input.svelte";
	import PhMagnifyingGlassDuotone from "~icons/ph/magnifying-glass-duotone";
	import PhDotsThreeBold from "~icons/ph/dots-three-bold";
</script>

<aside class="w-60 border-r border-main-900 flex-1 flex flex-col">
	<Input
		id="search-bar"
		name="search-bar"
		variant="ghost"
		class="border-b border-main-900 py-2.5 px-2 focus-visible:ring-0"
		leftIconClass="text-main-600"
		placeholder="Find..."
		icons={{ left: PhMagnifyingGlassDuotone }}
	/>

	<nav class="flex-1">
		<ul></ul>
	</nav>

	<div
		class="h-11 flex items-center px-3 gap-x-2 border-t border-main-900 text-sm"
	>
		<img
			class="size-6 rounded-full object-cover"
			alt=""
			src="https://i.pinimg.com/736x/0b/ed/9c/0bed9c847df1776b9c18fe7edb0ad0a2.jpg"
		/>
		okzmo

		<Button
			aria-label="settings"
			variant="ghost"
			class="size-5.5 border border-main-700 rounded-full ml-auto"
		>
			<PhDotsThreeBold class="size-4 text-main-300" />
		</Button>
	</div>
</aside>
