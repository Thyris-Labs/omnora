<script lang="ts">
	import { createForm, Form, getInput, setErrors } from "@formisch/svelte";
	import PhFinnTheHumanFill from "~icons/ph/finn-the-human-fill";
	import PhWarningDuotone from "~icons/ph/warning-duotone";
	import { createSignupSchema, getAuthStore } from "shared/stores/auth.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import OtpField from "ui/fields/otp-field.svelte";
	import Button from "ui/primitives/button.svelte";
	import { useDebounce } from "runed";
	import { apiFetch } from "shared/helpers/api";

	type UsernameState = "idle" | "checking" | "taken" | "available" | "error";

	const authStore = getAuthStore();
	const signupForm = createForm({
		schema: createSignupSchema(() => authStore.verifying),
	});

	let usernameState = $state<UsernameState>("idle");
	let usernameMessage = $state<string | null>(null);
	let controller = $state<AbortController | null>();

	const checkUsername = useDebounce(async () => {
		const username = getInput(signupForm, { path: ["username"] });
		if (!username) {
			controller = null;
			usernameState = "idle";
			return;
		}

		const currentController = new AbortController();
		controller = currentController;

		usernameState = "checking";
		usernameMessage = null;
		setErrors(signupForm, {
			path: ["username"],
			errors: null,
		});

		const result = await apiFetch(`/check_username`, {
			method: "POST",
			body: JSON.stringify({ username }),
			signal: currentController.signal,
		});

		if (result.isErr()) {
			if (result.error.code === "ERR_ABORTED") return;

			controller = null;
			usernameState = "taken";
			setErrors(signupForm, {
				path: ["username"],
				errors: [result.error.message],
			});
			return;
		}

		controller = null;
		usernameState = "available";
		usernameMessage = "This username is available.";
	}, 200);

	function onInput() {
		controller?.abort();
		void checkUsername();
	}
</script>

<div class="min-h-screen flex items-center justify-center">
	<main class="mx-auto w-full max-w-90 flex flex-col">
		<div class="flex flex-col items-start gap-y-4">
			<div
				class="flex size-12 items-center justify-center bg-accent/10 border border-accent/60 text-accent"
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
					oninput={onInput}
				/>

				{@render messages()}

				<Button
					type="submit"
					disabled={authStore.submitting}
					aria-busy={authStore.submitting}
					class="mt-6 w-full px-4 py-2 font-medium"
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

				<Button type="submit" class="mt-8 w-full px-4 py-2 font-medium"
					>Verify Email</Button
				>
			</Form>
		{/if}

		<p class="mt-4 text-sm text-main-500">
			Already have an account?
			<a class="text-main-50" href="/signin">Sign in</a>
		</p>
	</main>
</div>

{#snippet messages()}
	{#if authStore.errorMessage}
		<div
			role="alert"
			class="mt-6 text-sm bg-rose-500/20 w-fit py-1.5 px-2.5 text-rose-500 flex items-center gap-x-2"
		>
			<PhWarningDuotone />
			{authStore.errorMessage}
		</div>
	{/if}

	{#if usernameState === "checking"}
		<div class="mt-2 text-sm w-fit flex items-center gap-x-2 text-main-600">
			Checking availability...
		</div>
	{/if}

	{#if usernameState === "available"}
		<div class="mt-2 text-sm w-fit flex items-center gap-x-2 text-accent">
			{usernameMessage}
		</div>
	{/if}
{/snippet}
