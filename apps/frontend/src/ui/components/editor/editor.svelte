<script lang="ts">
	import { Editor } from "@tiptap/core";
	import { onDestroy, onMount } from "svelte";
	import StarterKit from "@tiptap/starter-kit";
	import { Placeholder } from "@tiptap/extensions/placeholder";
	import { cn } from "tailwind-variants";

	interface Props {
		class?: string;
	}

	let { class: classes }: Props = $props();
	let element = $state<HTMLElement | null>(null);
	let editorState = $state<{ editor: Editor | null }>({ editor: null });

	onMount(() => {
		editorState.editor = new Editor({
			content: "",
			element: element,
			extensions: [
				StarterKit,
				Placeholder.configure({ placeholder: "Start typing here..." }),
			],
			onTransaction: ({ editor }) => {
				editorState.editor = editor;
			},
		});
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div bind:this={element} class={cn("w-full h-full relative", classes)}></div>
