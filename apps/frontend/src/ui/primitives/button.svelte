<script lang="ts">
	import { Button as BitsButton } from "bits-ui";
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import type { ButtonRootProps } from "bits-ui";

	const buttonVariants = tv({
		base: "inline-flex items-center justify-center transition-[background-color,box-shadow,transform,scale,color] duration-75 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-950 aria-busy:cursor-progress aria-disabled:cursor-not-allowed aria-disabled:opacity-70 aria-disabled:active:scale-100",
		variants: {
			variant: {
				default:
					"flex w-full justify-start gap-x-2 text-main-500 hover:text-main-300 hover:bg-main-900 border border-transparent",
				action: "bg-main-50 hover:bg-main-100 text-main-900",
				positive: "bg-green-600/70 hover:bg-green-600 text-main-50",
				danger: "bg-rose-600/70 hover:bg-rose-600 text-main-50",
				ghost: "hover:text-main-200 hover:bg-main-900",
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
