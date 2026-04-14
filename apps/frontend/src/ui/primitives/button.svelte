<script lang="ts">
	import { Button as BitsButton } from "bits-ui";
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import type { ButtonRootProps } from "bits-ui";

	const buttonVariants = tv({
		base: "inline-flex items-center justify-center px-4 py-2 text-base transition-[background-color,box-shadow,transform] duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-800 aria-busy:cursor-progress aria-disabled:cursor-not-allowed",
		variants: {
			variant: {
				default:
					"bg-main-700 active:bg-main-750 active:shadow-button-pressed shadow-button text-main-100 font-medium rounded-lg min-h-11",
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
