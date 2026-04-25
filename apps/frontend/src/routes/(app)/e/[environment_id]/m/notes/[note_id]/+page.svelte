<script lang="ts">
	import Editor from "ui/primitives/editor/editor.svelte";
	import Input from "ui/primitives/input.svelte";
</script>

<div class="flex-1 h-full px-24 pt-20 relative flex flex-col gap-y-8">
	<Input
		variant="ghost"
		placeholder="Title"
		class="focus-within:ring-0"
		inputClass="text-6xl placeholder:font-semibold font-semibold"
	/>

	<Editor class="ml-1" />
</div>
