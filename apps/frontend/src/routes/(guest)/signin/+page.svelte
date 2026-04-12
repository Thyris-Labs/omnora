<script lang="ts">
	import { createForm, Field, Form } from "@formisch/svelte";
	import { Button } from "bits-ui";
	import { getAuthStore, SigninSchema } from "shared/stores/auth.svelte";

	const signinForm = createForm({
		schema: SigninSchema,
	});

	const authStore = getAuthStore();
</script>

{#if !authStore.verifying}
	<Form
		of={signinForm}
		onsubmit={(output) => authStore.verifyEmail(output.email)}
	>
		<Field of={signinForm} path={["email"]}>
			{#snippet children(field)}
				<div>
					<input {...field.props} value={field.input} type="email" />
					{#if field.errors}
						<div>{field.errors[0]}</div>
					{/if}
				</div>
			{/snippet}
		</Field>

		{#if authStore.errorMessage}
			<div>{authStore.errorMessage}</div>
		{/if}

		<Button.Root type="submit" disabled={authStore.submitting}>
			Sign in
		</Button.Root>
	</Form>
{:else}
	<Form of={signinForm} onsubmit={(output) => authStore.signin(output)}>
		<Field of={signinForm} path={["code"]}>
			{#snippet children(field)}
				<div>
					<input {...field.props} value={field.input} type="text" />
					{#if field.errors}
						<div>{field.errors[0]}</div>
					{/if}
				</div>
			{/snippet}
		</Field>

		<Button.Root type="submit">Verify Email</Button.Root>
	</Form>
{/if}
