<script lang="ts">
	import { Editor, type JSONContent } from "@tiptap/core";
	import { onDestroy, onMount } from "svelte";
	import StarterKit from "@tiptap/starter-kit";
	import { Placeholder } from "@tiptap/extensions/placeholder";
	import { cn } from "tailwind-variants";

	interface Props {
		class?: string;
		content?: string | JSONContent;
		onUpdate?: (content: { rawContent: JSONContent; content: string }) => void;
	}

	let { class: classes, content = "", onUpdate }: Props = $props();
	let element = $state<HTMLElement | null>(null);
	let editorState = $state<{ editor: Editor | null }>({ editor: null });

	onMount(() => {
		editorState.editor = new Editor({
			content,
			element: element,
			extensions: [
				StarterKit,
				Placeholder.configure({ placeholder: "Start typing here..." }),
			],
			onUpdate: ({ editor }) => {
				onUpdate?.({
					rawContent: editor.getJSON(),
					content: editor.getText(),
				});
			},
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
