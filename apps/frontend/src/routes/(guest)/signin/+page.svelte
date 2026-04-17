<script lang="ts">
	import { createForm, Form } from "@formisch/svelte";
	import { createSigninSchema, getAuthStore } from "shared/stores/auth.svelte";
	import AuthShell from "ui/auth/auth-shell.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import OtpField from "ui/fields/otp-field.svelte";
	import Button from "ui/primitives/button.svelte";
	import ErrorMessage from "ui/auth/error-message.svelte";

	const authStore = getAuthStore();
	authStore.errorMessage = null;

	const signinForm = createForm({
		schema: createSigninSchema(() => authStore.verifying),
	});
</script>

<AuthShell
	title="Sign in"
	description="Access your Omnora account"
	footerPrompt="Don&apos;t have an account? "
	footerHref="/signup"
	footerLabel="Sign up"
>
	{#if !authStore.verifying}
		<Form
			of={signinForm}
			onsubmit={(output) => authStore.verifyEmail(output.email, "signin")}
			class="mt-6 w-full"
		>
			<InputField
				of={signinForm}
				path={["email"]}
				id="signin-email-input"
				label="Email"
				type="email"
				placeholder="john.doe@example.com"
				autocomplete="email"
			/>

			{#if authStore.errorMessage}
				<ErrorMessage message={authStore.errorMessage} />
			{/if}

			<Button
				type="submit"
				disabled={authStore.submitting}
				aria-busy={authStore.submitting}
				class="mt-6 w-full px-4 py-2"
			>
				Sign in
			</Button>
		</Form>
	{:else}
		<Form
			of={signinForm}
			onsubmit={(output) => authStore.signin(output)}
			class="mt-7 w-full flex flex-col items-center"
		>
			<OtpField
				of={signinForm}
				path={["code"]}
				id="signin-verification-code-input"
				label="Verification code"
				maxlength={6}
				autocomplete="one-time-code"
				inputmode="numeric"
				pattern="[0-9]*"
				class="w-fit mx-auto"
				labelClass="invisible absolute"
			/>

			{#if authStore.errorMessage}
				<ErrorMessage message={authStore.errorMessage} />
			{/if}

			<Button type="submit" class="mt-8 w-full px-4 py-2">Verify Email</Button>
		</Form>
	{/if}
</AuthShell>
