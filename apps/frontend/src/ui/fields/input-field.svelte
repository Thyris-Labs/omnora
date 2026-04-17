<script
	lang="ts"
	generics="TSchema extends Schema, TFieldPath extends RequiredPath"
>
	import { Field } from "@formisch/svelte";
	import { tv, cn } from "tailwind-variants";
	import type { HTMLInputAttributes } from "svelte/elements";
	import type * as v from "valibot";
	import Input from "ui/primitives/input.svelte";
	import type { RequiredPath, Schema, ValidPath } from "@formisch/svelte";
	import type { FormStore } from "@formisch/svelte";

	const fieldVariants = tv({
		slots: {
			root: "flex flex-col",
			label: "text-sm font-[435] text-main-400",
			error: "mt-2 text-sm text-rose-500",
		},
		variants: {
			spacing: {
				default: {
					root: "mt-4 first:mt-0",
				},
			},
		},
		defaultVariants: {
			spacing: "default",
		},
	});

	type InputFieldProps = HTMLInputAttributes & {
		of: FormStore<TSchema>;
		path: ValidPath<v.InferInput<TSchema>, TFieldPath>;
		label: string;
		id?: string;
		class?: string;
		inputClass?: string;
		labelClass?: string;
		errorClass?: string;
		[key: symbol]: unknown;
	};

	let {
		of,
		path,
		label,
		id,
		class: className = "",
		inputClass = "",
		labelClass = "",
		errorClass = "",
		onfocus,
		oninput,
		onchange,
		onblur,
		...restProps
	}: InputFieldProps = $props();

	const { root, label: labelStyles, error } = fieldVariants();

	const inputId = $derived(id ?? `field-${String(path).replaceAll(",", "-")}`);
	const errorId = $derived(`${inputId}-error`);

	function mergeFieldProps(fieldProps: {
		name: string;
		autofocus: boolean;
		onfocus: NonNullable<InputFieldProps["onfocus"]>;
		oninput: NonNullable<InputFieldProps["oninput"]>;
		onchange: NonNullable<InputFieldProps["onchange"]>;
		onblur: NonNullable<InputFieldProps["onblur"]>;
		[key: symbol]: unknown;
	}) {
		return {
			...fieldProps,
			onfocus(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
				fieldProps.onfocus(event);
				onfocus?.(event);
			},
			oninput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
				fieldProps.oninput(event);
				oninput?.(event);
			},
			onchange(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
				fieldProps.onchange(event);
				onchange?.(event);
			},
			onblur(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
				fieldProps.onblur(event);
				onblur?.(event);
			},
		};
	}
</script>

<Field {of} {path}>
	{#snippet children(field)}
		<div class={cn(root(), className)}>
			<label for={inputId} class={cn(labelStyles(), labelClass)}>{label}</label>
			<Input
				{...restProps}
				{...mergeFieldProps(field.props)}
				id={inputId}
				value={field.input ?? ""}
				class={cn("mt-1", inputClass)}
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
