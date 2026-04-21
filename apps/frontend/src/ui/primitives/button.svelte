<script lang="ts">
	import { Button as BitsButton } from "bits-ui";
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import type { ButtonRootProps } from "bits-ui";

	const buttonVariants = tv({
		base: "inline-flex active:scale-[0.98] items-center px-2.5 py-1 justify-center text-base transition-[background-color,box-shadow,transform,scale,color] duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-950 aria-busy:cursor-progress aria-disabled:cursor-not-allowed",
		variants: {
			variant: {
				default:
					"flex w-full justify-start gap-x-2 px-2 py-1.5 text-sm text-main-500 hover:text-main-300 hover:bg-main-900 border border-transparent",
				action: "bg-main-50 hover:bg-main-100 text-main-900",
				positive: "bg-green-600/70 hover:bg-green-600 text-main-50",
				danger: "bg-rose-600/70 hover:bg-rose-600 text-main-50",
				ghost: "",
			},
			state: {
				default: "",
				active:
					"text-main-50 bg-main-900 border border-main-800 hover:text-main-50",
				disabled: "opacity-70",
			},
		},
		defaultVariants: {
			variant: "default",
			state: "default",
		},
	});

	type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	type ButtonState = VariantProps<typeof buttonVariants>["state"];

	type Props = ButtonRootProps & {
		variant?: ButtonVariant;
		state?: ButtonState;
		class?: string;
		children?: Snippet;
	};

	let {
		variant = "default",
		state = "default",
		class: className = "",
		children,
		disabled = false,
		...restProps
	}: Props = $props();

	const resolvedState = $derived(disabled ? "disabled" : state);

	function preventDisabledInteraction(event: MouseEvent | KeyboardEvent) {
		if (!disabled) {
			return;
		}

		if (
			event instanceof KeyboardEvent &&
			event.key !== "Enter" &&
			event.key !== " "
		) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
	}
</script>

<BitsButton.Root
	{...restProps}
	aria-disabled={disabled ? "true" : undefined}
	onclickcapture={preventDisabledInteraction}
	onkeydowncapture={preventDisabledInteraction}
	class={cn(buttonVariants({ variant, state: resolvedState }), className)}
>
	{@render children?.()}
</BitsButton.Root>
