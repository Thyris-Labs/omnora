<script lang="ts">
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { HTMLInputAttributes } from "svelte/elements";

	const inputVariants = tv({
		base: "w-full text-base transition-[background-color,color,box-shadow,border-color] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-main-800 aria-disabled:cursor-not-allowed aria-invalid:ring-3 aria-invalid:ring-rose-500/20 aria-invalid:ring-offset-0 aria-invalid:focus-visible:ring-rose-500/30",
		variants: {
			variant: {
				default:
					"px-3.25 py-2 bg-main-950 border border-main-900 aria-invalid:border-rose-700 text-main-100 placeholder:font-[465] placeholder:text-main-600 focus-visible:border-main-500",
			},
			state: {
				default: "",
				disabled: "opacity-70",
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
		[key: symbol]: unknown;
	};

	let {
		variant = "default",
		state = "default",
		class: className = "",
		disabled = false,
		readonly = false,
		...restProps
	}: InputProps = $props();

	const resolvedState = $derived(disabled ? "disabled" : state);
</script>

<input
	{...restProps}
	readonly={disabled || readonly}
	aria-disabled={disabled ? "true" : undefined}
	class={cn(inputVariants({ variant, state: resolvedState }), className)}
/>
