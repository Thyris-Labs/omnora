<script lang="ts">
	import { createForm, Form } from "@formisch/svelte";
	import PhFinnTheHumanFill from "~icons/ph/finn-the-human-fill";
	import { createSigninSchema, getAuthStore } from "shared/stores/auth.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import OtpField from "ui/fields/otp-field.svelte";
	import Button from "ui/primitives/button.svelte";

	const authStore = getAuthStore();

	const signinForm = createForm({
		schema: createSigninSchema(() => authStore.verifying),
	});
</script>

<div class="min-h-screen bg-main-850 flex items-center justify-center">
	<main class="mx-auto w-full max-w-90 flex flex-col">
		<div class="flex flex-col items-start gap-y-4">
			<div
				class="flex size-12 items-center justify-center bg-accent/10 border border-accent/60 text-accent"
			>
				<!-- FIXME: change this logo when we have our own -->
				<PhFinnTheHumanFill class="size-7" />
			</div>
			<div class="flex flex-col gap-y-1">
				<h1 class="text-xl font-semibold">Sign in</h1>
				<p class="text-main-400/75">Access your Omnora account</p>
			</div>
		</div>

		{#if !authStore.verifying}
			<Form
				of={signinForm}
				onsubmit={(output) => authStore.verifyEmail(output.email)}
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
					<div role="alert" class="mt-6 text-sm text-rose-500">
						{authStore.errorMessage}
					</div>
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
				class="mt-7 w-full"
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

				<Button type="submit" class="mt-8 w-full px-4 py-2">Verify Email</Button
				>
			</Form>
		{/if}

		<p class="mt-4 text-sm text-main-500">
			Don&apos;t have an account?
			<a class="text-main-50" href="/signup">Sign up</a>
		</p>
	</main>
</div>
