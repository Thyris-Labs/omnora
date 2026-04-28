<script lang="ts">
	import { createForm, Form, getInput, setErrors } from "@formisch/svelte";
	import AuthShell from "features/auth/components/auth-shell.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import OtpField from "ui/fields/otp-field.svelte";
	import Button from "ui/primitives/button.svelte";
	import { useDebounce } from "runed";
	import { client } from "lib/api";
	import ErrorMessage from "features/auth/components/error-message.svelte";
	import { createSignupSchema } from "features/auth/schemas";
	import { auth } from "features/auth/store.svelte";

	type UsernameState = "idle" | "checking" | "taken" | "available" | "error";

	auth.errorMessage = null;
	const signupForm = createForm({
		schema: createSignupSchema(() => auth.verifying),
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

		const [_, err] = await client
			.post("/api/v1/auth/check_username", {
				body: { username },
				signal: controller.signal,
			})
			.safe();

		if (currentController.signal.aborted) return;

		if (err?.isStatus(400)) {
			usernameState = "taken";
			setErrors(signupForm, {
				path: ["username"],
				errors: [err.response.message],
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

<AuthShell
	title="Create an account"
	description="Lucky you, it's free!"
	footerPrompt="Already have an account? "
	footerHref="/signin"
	footerLabel="Sign in"
>
	{#if !auth.verifying}
		<Form
			of={signupForm}
			onsubmit={(output) => auth.verifyEmail(output.email, "signup")}
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
				inputClass={usernameState === "available" ? "border-accent!" : ""}
			/>

			{@render messages()}

			<Button
				type="submit"
				disabled={auth.submitting}
				aria-busy={auth.submitting}
				class="mt-6 w-full px-4 py-2 font-medium"
				variant="action"
			>
				Sign up
			</Button>
		</Form>
	{:else}
		<Form
			of={signupForm}
			onsubmit={(output) => auth.signup(output)}
			class="mt-7 w-full flex flex-col items-center"
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

			{#if auth.errorMessage}
				<ErrorMessage message={auth.errorMessage} />
			{/if}

			<Button
				type="submit"
				class="mt-8 w-full px-4 py-2 font-medium"
				variant="action"
			>
				Verify Email
			</Button>
		</Form>
	{/if}
</AuthShell>

{#snippet messages()}
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

	{#if auth.errorMessage}
		<ErrorMessage message={auth.errorMessage} />
	{/if}
{/snippet}
