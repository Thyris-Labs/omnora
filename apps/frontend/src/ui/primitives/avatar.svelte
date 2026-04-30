<script lang="ts">
	import { Avatar, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "tailwind-variants";

	type Props = WithoutChildrenOrChild<Avatar.RootProps> & {
		src?: string;
		alt?: string;
		name: string;
		class?: string;
	};

	let {
		src,
		alt,
		name,
		class: className = "",
		...restProps
	}: Props = $props();

	const initials = $derived(
		name
			.split(/\s+/)
			.slice(0, 2)
			.map((word) => word[0]?.toUpperCase() ?? "")
			.join(""),
	);
</script>

<Avatar.Root
	{...restProps}
	class={cn(
		"inline-flex aspect-square items-center justify-center overflow-hidden rounded-full select-none bg-main-900 text-main-200 text-xs",
		className,
	)}
>
	<Avatar.Image
		{src}
		alt={alt ?? name}
		draggable="false"
		class="h-full w-full object-cover"
	/>
	<Avatar.Fallback>
		{initials}
	</Avatar.Fallback>
</Avatar.Root>
