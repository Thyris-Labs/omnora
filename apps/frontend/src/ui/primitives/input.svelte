<script lang="ts">
	import { tv, type VariantProps } from "tailwind-variants";
	import type { HTMLInputAttributes, SVGAttributes } from "svelte/elements";
	import type { Component } from "svelte";

	const inputVariants = tv({
		slots: {
			root: "flex w-full items-center text-base transition-[background-color,color,box-shadow,border-color] focus-within:outline-none focus-within:ring-3 focus-within:ring-main-800 has-aria-invalid:ring-3 has-aria-invalid:ring-rose-500/20 has-aria-invalid:focus-within:ring-rose-500/30",
			input:
				"w-full min-w-0 bg-transparent outline-none text-main-100 placeholder:font-[465] placeholder:text-main-700 aria-disabled:cursor-not-allowed",
			leftIcon: "flex shrink-0 items-center pr-2 text-main-500",
			rightIcon: "flex shrink-0 items-center pl-2 text-main-500",
		},
		variants: {
			variant: {
				default: {
					root: "px-3.25 py-2 bg-main-950 border border-main-900 has-aria-invalid:border-rose-700 focus-within:border-main-500",
				},
				ghost: {},
			},
			state: {
				default: {},
				disabled: {
					root: "opacity-70",
				},
			},
		},
		defaultVariants: {
			variant: "default",
			state: "default",
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
	const slots = $derived(inputVariants({ variant, state: resolvedState }));
</script>

<div class={slots.root({ class: className })}>
	{#if LeftIcon}
		<div class={slots.leftIcon({ class: leftIconClass })}>
			<LeftIcon class="size-4" aria-hidden="true" />
		</div>
	{/if}

	<input
		{...restProps}
		readonly={disabled || readonly}
		aria-disabled={disabled ? "true" : undefined}
		class={slots.input()}
	/>

	{#if RightIcon}
		<div class={slots.rightIcon({ class: rightIconClass })}>
			<RightIcon class="size-4" aria-hidden="true" />
		</div>
	{/if}
</div>
