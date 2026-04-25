<script lang="ts">
	import { Button as BitsButton } from "bits-ui";
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import type { ButtonRootProps } from "bits-ui";

	const buttonVariants = tv({
		base: "inline-flex items-center justify-center transition-[background-color,border-color,box-shadow,transform,scale,color] duration-75 active:scale-[0.98] focus-visible:outline-none aria-busy:cursor-progress aria-disabled:cursor-not-allowed aria-disabled:opacity-70 aria-disabled:active:scale-100",
		variants: {
			variant: {
				default:
					"flex w-full justify-start gap-x-2 border border-transparent text-main-500 hover:text-main-300 hocus:bg-main-900",
				action:
					"bg-main-50 text-main-900 hocus:bg-main-100 focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-950",
				outline:
					"border border-main-900 hocus:border-main-700 hocus:text-main-200",
				positive: "bg-green-600/70 text-main-50 hocus:bg-green-600",
				danger: "bg-rose-600/70 text-main-50 hocus:bg-rose-600",
				ghost: "hocus:bg-main-900 hocus:text-main-200",
			},
			size: {
				sm: "px-2 py-1.5 text-sm",
				md: "px-2.5 py-1 text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "sm",
		},
	});

	type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	type Props = ButtonRootProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		leading?: Snippet;
		children?: Snippet;
		trailing?: Snippet;
	};

	let {
		variant = "default",
		size = "sm",
		class: className = "",
		leading,
		children,
		trailing,
		disabled = false,
		...restProps
	}: Props = $props();

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
	class={cn(buttonVariants({ variant, size }), className)}
>
	{@render leading?.()}
	{@render children?.()}
	{@render trailing?.()}
</BitsButton.Root>
