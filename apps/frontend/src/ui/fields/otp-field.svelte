<script
	lang="ts"
	generics="TSchema extends Schema, TFieldPath extends RequiredPath"
>
	import { Field } from "@formisch/svelte";
	import type { ComponentProps } from "svelte";
	import { tv, cn } from "tailwind-variants";
	import type * as v from "valibot";
	import type { RequiredPath, Schema, ValidPath } from "@formisch/svelte";
	import type { FormStore } from "@formisch/svelte";
	import Otp from "ui/primitives/otp.svelte";

	const fieldVariants = tv({
		slots: {
			root: "flex flex-col",
			label: "text-sm font-[435] text-main-400",
			error: "mt-1 text-sm text-rose-500",
		},
		variants: {
			spacing: {
				default: {
					root: "",
				},
			},
		},
		defaultVariants: {
			spacing: "default",
		},
	});

	type OtpFieldProps = Omit<ComponentProps<typeof Otp>, "value"> & {
		of: FormStore<TSchema>;
		path: ValidPath<v.InferInput<TSchema>, TFieldPath>;
		label: string;
		id?: string;
		class?: string;
		otpClass?: string;
		cellClass?: string;
		labelClass?: string;
		errorClass?: string;
	};

	let {
		of,
		path,
		label,
		id,
		class: className = "",
		otpClass = "",
		cellClass = "",
		labelClass = "",
		errorClass = "",
		maxlength = 6,
		...restProps
	}: OtpFieldProps = $props();

	const { root, label: labelStyles, error } = fieldVariants();
	const inputId = $derived(id ?? `field-${String(path).replaceAll(",", "-")}`);
	const errorId = $derived(`${inputId}-error`);
</script>

<Field {of} {path}>
	{#snippet children(field)}
		<div class={cn(root(), className)}>
			<label for={inputId} class={cn(labelStyles(), labelClass)}>{label}</label>
			<Otp
				{...restProps}
				{...field.props}
				{inputId}
				value={typeof field.input === "string" ? field.input : ""}
				{maxlength}
				class={cn(otpClass)}
				{cellClass}
				aria-invalid={field.errors ? "true" : undefined}
				aria-describedby={field.errors ? errorId : undefined}
			/>
			{#if field.errors}
				<div
					id={errorId}
					role="alert"
					aria-live="polite"
					class={cn(error(), errorClass)}
				>
					{field.errors[0]}
				</div>
			{/if}
		</div>
	{/snippet}
</Field>
