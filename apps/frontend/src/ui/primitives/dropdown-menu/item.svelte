<script lang="ts">
	import { DropdownMenu, type WithoutChildrenOrChild } from "bits-ui";
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { Snippet } from "svelte";

	const itemVariants = tv({
		base: "group flex w-full select-none items-center gap-x-3 px-2 py-1.5 text-sm outline-none transition-[background-color,color,transform] duration-75 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		variants: {
			variant: {
				default:
					"text-main-200 data-highlighted:bg-main-900 data-highlighted:text-main-100",
				danger:
					"text-main-200 data-highlighted:bg-main-900 data-highlighted:text-main-100",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	type ItemVariant = VariantProps<typeof itemVariants>["variant"];

	type Props = WithoutChildrenOrChild<DropdownMenu.ItemProps> & {
		variant?: ItemVariant;
		class?: string;
		children?: Snippet;
	};

	let {
		variant = "default",
		class: className = "",
		children,
		...restProps
	}: Props = $props();
</script>

<DropdownMenu.Item
	{...restProps}
	class={cn(itemVariants({ variant }), className)}
>
	{@render children?.()}
</DropdownMenu.Item>
