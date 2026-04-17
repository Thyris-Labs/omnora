<script lang="ts">
	import { createForm, Form } from "@formisch/svelte";
	import PhFinnTheHumanFill from "~icons/ph/finn-the-human-fill";
	import { createSignupSchema, getAuthStore } from "shared/stores/auth.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import OtpField from "ui/fields/otp-field.svelte";
	import Button from "ui/primitives/button.svelte";

	const authStore = getAuthStore();

	const signupForm = createForm({
		schema: createSignupSchema(() => authStore.verifying),
	});
</script>

<div class="min-h-screen bg-main-850 flex items-center justify-center">
	<main class="mx-auto w-full max-w-90 flex flex-col">
		<div class="flex flex-col items-start gap-y-4">
			<div
				class="flex size-12 items-center justify-center rounded-2xl bg-main-400 text-main-950"
			>
				<!-- FIXME: change this logo when we have our own -->
				<PhFinnTheHumanFill class="size-7" />
			</div>
			<div class="flex flex-col gap-y-1">
				<h1 class="text-xl font-semibold">Create an account</h1>
				<p class="text-main-400/75">Lucky you, it's free!</p>
			</div>
		</div>

		{#if !authStore.verifying}
			<Form
				of={signupForm}
				onsubmit={(output) => authStore.verifyEmail(output.email)}
				class="mt-6 w-full"
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
				class="mt-7 w-full"
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

				<Button type="submit" class="mt-8 w-full">Verify Email</Button>
			</Form>
		{/if}

		<p class="mt-4 text-sm text-main-500">
			Already have an account?
			<a class="text-main-50" href="/signin">Sign in</a>
		</p>
	</main>
</div>
