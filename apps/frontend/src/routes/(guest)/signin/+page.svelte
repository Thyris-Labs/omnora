<script lang="ts">
	import { createForm, Form } from "@formisch/svelte";
	import { createSigninSchema, getAuthStore } from "shared/stores/auth.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import OtpField from "ui/fields/otp-field.svelte";
	import Button from "ui/primitives/button.svelte";

	const authStore = getAuthStore();

	const signinForm = createForm({
		schema: createSigninSchema(() => authStore.verifying),
	});
</script>

<main class="flex min-h-screen bg-main-800 justify-center items-center">
	<div class="flex flex-col max-w-90 h-fit w-full items-center">
		<h1 class="text-xl font-semibold">Sign in</h1>
		<p class="text-main-400/75 mt-0.5">Access your Omnora account</p>

		{#if !authStore.verifying}
			<Form
				of={signinForm}
				onsubmit={(output) => authStore.verifyEmail(output.email)}
				class="w-full"
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
					<div role="alert" class="mt-6 text-sm text-rose-500">
						{authStore.errorMessage}
					</div>
				{/if}

				<Button
					type="submit"
					disabled={authStore.submitting}
					aria-busy={authStore.submitting}
					class="mt-6 w-full"
				>
					Sign in
				</Button>
			</Form>
		{:else}
			<Form of={signinForm} onsubmit={(output) => authStore.signin(output)} class="w-full">
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

				<Button type="submit" class="mt-6 w-full">Verify Email</Button>
			</Form>
		{/if}
	</div>
</main>
