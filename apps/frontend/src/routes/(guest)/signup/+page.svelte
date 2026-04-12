<script lang="ts">
	import { createForm, Field, Form } from "@formisch/svelte";
	import { Button } from "bits-ui";
	import { getAuthStore, SignupSchema } from "shared/stores/auth.svelte";

	const signupForm = createForm({
		schema: SignupSchema,
	});

	const authStore = getAuthStore();
</script>

{#if !authStore.verifying}
	<Form
		of={signupForm}
		onsubmit={(output) => authStore.verifyEmail(output.email)}
	>
		<Field of={signupForm} path={["email"]}>
			{#snippet children(field)}
				<div>
					<input {...field.props} value={field.input} type="email" />
					{#if field.errors}
						<div>{field.errors[0]}</div>
					{/if}
				</div>
			{/snippet}
		</Field>

		<Field of={signupForm} path={["username"]}>
			{#snippet children(field)}
				<div>
					<input {...field.props} value={field.input} type="text" />
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
			Sign up
		</Button.Root>
	</Form>
{:else}
	<Form of={signupForm} onsubmit={(output) => authStore.signup(output)}>
		<Field of={signupForm} path={["code"]}>
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
