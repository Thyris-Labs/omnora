<script lang="ts">
	import { Tabs } from "bits-ui";
	import type { ComponentProps, Snippet } from "svelte";
	import { cn } from "tailwind-variants";

	type Props = Omit<ComponentProps<typeof Tabs.Trigger>, "children" | "child"> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className = "", children, ...restProps }: Props = $props();
</script>

<Tabs.Trigger
	{...restProps}
	class={cn(
		"flex w-full items-center justify-start gap-x-2 border border-transparent px-2 py-1.5 text-sm text-main-500 capitalize outline-none transition-ds hover:bg-main-900 hover:text-main-200 active:scale-[0.98] data-[state=active]:border-main-800 data-[state=active]:bg-main-900 data-[state=active]:text-main-100",
		className,
	)}
>
	{@render children?.()}
</Tabs.Trigger>
