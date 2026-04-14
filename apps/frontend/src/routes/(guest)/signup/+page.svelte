<script lang="ts">
	import { createForm, Form } from "@formisch/svelte";
	import { createSignupSchema, getAuthStore } from "shared/stores/auth.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import OtpField from "ui/fields/otp-field.svelte";
	import Button from "ui/primitives/button.svelte";

	const authStore = getAuthStore();

	const signupForm = createForm({
		schema: createSignupSchema(() => authStore.verifying),
	});
</script>

<main class="flex min-h-screen bg-main-800 justify-center items-center">
	<button
		onclick={() => (authStore.verifying = !authStore.verifying)}
		class="absolute left-0 top-0">test</button
	>
	<div class="flex flex-col max-w-90 h-fit w-full items-center">
		<h1 class="text-xl font-semibold">Sign up</h1>
		<p class="text-main-400/75 mt-0.5">Create an account on Omnora</p>

		{#if !authStore.verifying}
			<Form
				of={signupForm}
				onsubmit={(output) => authStore.verifyEmail(output.email)}
				class="w-full"
			>
				<InputField
					of={signupForm}
					path={["email"]}
					id="email-input"
					label="Email"
					type="email"
					placeholder="john.doe@example.com"
					autocomplete="email"
				/>

				<InputField
					of={signupForm}
					path={["username"]}
					id="username-input"
					label="Username"
					type="text"
					autocomplete="off"
					data-1p-ignore
					placeholder="johndoe"
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
					Sign up
				</Button>
			</Form>
		{:else}
			<Form
				of={signupForm}
				onsubmit={(output) => authStore.signup(output)}
				class="w-full"
			>
				<OtpField
					of={signupForm}
					path={["code"]}
					id="verification-code-input"
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
