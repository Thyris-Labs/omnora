<script lang="ts">
	import { tv, type VariantProps, cn } from "tailwind-variants";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	const buttonVariants = tv({
		base: "outline-none aria-busy:cursor-progress aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
		variants: {
			variant: {
				default:
					"inline-flex items-center justify-center gap-x-2 border border-transparent bg-main-100 px-3 py-1.5 text-sm font-medium text-main-950 transition-ds hover:bg-main-100/90 active:scale-[0.98] aria-disabled:active:scale-100",
				unstyled: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

	type Props = HTMLButtonAttributes & {
		variant?: ButtonVariant;
		class?: string;
		children?: Snippet;
	};

	let {
		variant = "default",
		class: className = "",
		children,
		disabled = false,
		type = "button",
		...restProps
	}: Props = $props();

	const resolvedType = $derived(
		disabled && type === "submit" ? "button" : (type ?? "button"),
	);

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

<button
	{...restProps}
	type={resolvedType}
	aria-disabled={disabled ? "true" : undefined}
	onclickcapture={preventDisabledInteraction}
	onkeydowncapture={preventDisabledInteraction}
	class={cn(buttonVariants({ variant }), className)}
>
	{@render children?.()}
</button>
