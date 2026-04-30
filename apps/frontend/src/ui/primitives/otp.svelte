<script lang="ts">
	import { PinInput } from "bits-ui";
	import { cn, tv, type VariantProps } from "tailwind-variants";
	import type { ComponentProps } from "svelte";

	const otpVariants = tv({
		slots: {
			root: "mt-1 flex items-center gap-2",
			cell: "flex size-11 select-none items-center justify-center bg-main-950 border border-main-800 aria-invalid:border-main-100 px-0 py-0 text-base font-medium tabular-nums text-main-100 transition-[background-color,color,box-shadow,border-color] duration-100",
			caret: "h-5 w-px bg-main-100",
		},
		variants: {
			variant: {
				default: {},
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

	type PinInputRootProps = ComponentProps<typeof PinInput.Root>;

	type OtpVariant = VariantProps<typeof otpVariants>["variant"];
	type OtpState = VariantProps<typeof otpVariants>["state"];

	type Props = Omit<PinInputRootProps, "children"> & {
		variant?: OtpVariant;
		state?: OtpState;
		class?: string;
		cellClass?: string;
	};

	let {
		variant = "default",
		state = "default",
		class: className = "",
		cellClass = "",
		disabled = false,
		maxlength = 6,
		value = $bindable(""),
		"aria-invalid": ariaInvalid,
		...restProps
	}: Props = $props();

	const resolvedState = $derived(disabled ? "disabled" : state);

	const otpStyles = $derived(
		otpVariants({
			variant,
			state: resolvedState,
		}),
	);

	function preventDisabledInput(
		event: KeyboardEvent | InputEvent | ClipboardEvent,
	) {
		if (!disabled) {
			return;
		}

		if (event instanceof KeyboardEvent) {
			const allowedKeys = new Set([
				"Tab",
				"Shift",
				"Escape",
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown",
				"Home",
				"End",
			]);

			if (allowedKeys.has(event.key)) {
				return;
			}
		}

		event.preventDefault();
		event.stopPropagation();
	}
</script>

<PinInput.Root
	{...restProps}
	bind:value
	{maxlength}
	aria-disabled={disabled ? "true" : undefined}
	onkeydowncapture={preventDisabledInput}
	onbeforeinputcapture={preventDisabledInput}
	onpastecapture={preventDisabledInput}
	class={cn(otpStyles.root(), className)}
>
	{#snippet children({ cells, isFocused })}
		{#each cells as currentCell}
			<PinInput.Cell
				cell={currentCell}
				class={cn(
					otpStyles.cell(),
					resolvedState === "default" &&
						currentCell.isActive &&
						isFocused &&
						"ring-3 ring-main-800 border-main-500",
					cellClass,
				)}
			>
				{#if currentCell.char}
					{currentCell.char}
				{:else if currentCell.hasFakeCaret}
					<span class={otpStyles.caret()}></span>
				{/if}
			</PinInput.Cell>
		{/each}
	{/snippet}
</PinInput.Root>
