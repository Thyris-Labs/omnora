<script lang="ts">
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { HTMLInputAttributes, SVGAttributes } from "svelte/elements";
	import type { Component } from "svelte";

	const inputVariants = tv({
		base: "w-full text-base transition-[background-color,color,box-shadow,border-color] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-main-800 aria-disabled:cursor-not-allowed aria-invalid:ring-3 aria-invalid:ring-rose-500/20 aria-invalid:ring-offset-0 aria-invalid:focus-visible:ring-rose-500/30 placeholder:text-main-700",
		variants: {
			variant: {
				default:
					"px-3.25 py-2 bg-main-950 border border-main-900 aria-invalid:border-rose-700 text-main-100 placeholder:font-[465] focus-visible:border-main-500",
				ghost: "",
			},
			state: {
				default: "",
				disabled: "opacity-70",
			},
			hasLeftIcon: {
				true: "",
				false: "",
			},
			hasRightIcon: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			{
				variant: ["default", "ghost"],
				hasLeftIcon: true,
				class: "pl-10!",
			},
			{
				variant: ["default", "ghost"],
				hasRightIcon: true,
				class: "pr-10!",
			},
		],
		defaultVariants: {
			variant: "default",
			state: "default",
			hasLeftIcon: false,
			hasRightIcon: false,
		},
	});

	type InputVariant = VariantProps<typeof inputVariants>["variant"];
	type InputState = VariantProps<typeof inputVariants>["state"];

	type InputProps = HTMLInputAttributes & {
		variant?: InputVariant;
		state?: InputState;
		class?: string;
		leftIconClass?: string;
		rightIconClass?: string;
		icons?: {
			right?: Component<SVGAttributes<SVGSVGElement>, {}>;
			left?: Component<SVGAttributes<SVGSVGElement>, {}>;
		};
		[key: symbol]: unknown;
	};

	let {
		variant = "default",
		state = "default",
		class: className = "",
		leftIconClass = "",
		rightIconClass = "",
		disabled = false,
		readonly = false,
		icons,
		...restProps
	}: InputProps = $props();

	const resolvedState = $derived(disabled ? "disabled" : state);
	const LeftIcon = $derived(icons?.left);
	const RightIcon = $derived(icons?.right);
</script>

<div class="relative w-full">
	{#if LeftIcon}
		<div
			class={cn(
				"pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-main-500 z-10",
				leftIconClass,
			)}
		>
			<LeftIcon class="size-4" aria-hidden="true" />
		</div>
	{/if}

	<input
		{...restProps}
		readonly={disabled || readonly}
		aria-disabled={disabled ? "true" : undefined}
		class={cn(
			inputVariants({
				variant,
				state: resolvedState,
				hasLeftIcon: Boolean(LeftIcon),
				hasRightIcon: Boolean(RightIcon),
			}),
			className,
		)}
	/>

	{#if RightIcon}
		<div
			class={cn(
				"pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-main-500",
				rightIconClass,
			)}
		>
			<RightIcon class="size-4" aria-hidden="true" />
		</div>
	{/if}
</div>
