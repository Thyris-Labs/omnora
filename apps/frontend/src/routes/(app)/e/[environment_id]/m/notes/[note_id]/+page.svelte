<script lang="ts">
	import Input from "ui/primitives/input.svelte";
</script>

<div class="flex-1 h-full px-24 pt-20">
	<Input
		variant="ghost"
		placeholder="Title"
		class="focus-within:ring-0"
		inputClass="text-6xl placeholder:font-semibold font-semibold"
	/>

	<Input
		variant="ghost"
		placeholder="Start typing here..."
		class="focus-within:ring-0 mt-8 px-1"
	/>
</div>
