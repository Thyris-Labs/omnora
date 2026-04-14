import { getContext, setContext } from "svelte"
import * as v from "valibot"
import { apiFetch } from "shared/helpers/api"

export function createSignupSchema(isVerifying: () => boolean) {
	return v.pipe(
		v.object({
			email: v.pipe(v.string("An email is required"), v.trim(), v.email("The given email is invalid.")),
			username: v.pipe(v.string("A username is required"), v.trim()),
			code: v.optional(v.pipe(v.string(), v.trim())),
		}),
		v.forward(
			v.partialCheck(
				[["code"]],
				({ code }) => !isVerifying() || Boolean(code),
				"A verification code is required",
			),
			["code"],
		),
	)
}

export function createSigninSchema(isVerifying: () => boolean) {
	return v.pipe(
		v.object({
			email: v.pipe(v.string("An email is required"), v.trim(), v.email("The given email is invalid.")),
			code: v.optional(v.pipe(v.string(), v.trim())),
		}),
		v.forward(
			v.partialCheck(
				[["code"]],
				({ code }) => !isVerifying() || Boolean(code),
				"A verification code is required",
			),
			["code"],
		),
	)
}

type SignupSchema = ReturnType<typeof createSignupSchema>
type SigninSchema = ReturnType<typeof createSigninSchema>
type SignupInput = v.InferInput<SignupSchema>
type SigninInput = v.InferInput<SigninSchema>

class AuthStore {
	verifying = $state(false)
	submitting = $state(false)
	errorMessage = $state<string | null>(null)

	async verifyEmail(email: string) {
		this.submitting = true
		this.errorMessage = null

		const result = await apiFetch("/verify", {
			method: "POST",
			body: JSON.stringify({ email }),
		})

		this.submitting = false

		if (result.isErr()) {
			this.errorMessage = result.error.message
			return
		}

		this.verifying = true
	}

	async signup(body: SignupInput) {
		this.submitting = true
		this.errorMessage = null

		const result = await apiFetch("/signup", {
			method: "POST",
			body: JSON.stringify(body)
		})

		this.submitting = false

		if (result.isErr()) {
			this.errorMessage = result.error.message
			return
		}
	}

	async signin(body: SigninInput) {
		this.submitting = true
		this.errorMessage = null

		const result = await apiFetch("/signin", {
			method: "POST",
			body: JSON.stringify(body)
		})

		this.submitting = false

		if (result.isErr()) {
			this.errorMessage = result.error.message
			return
		}
	}
}

const AUTH_KEY = Symbol("AUTH_STORE")

export function initAuthStore() {
	return setContext(AUTH_KEY, new AuthStore())
}

export function getAuthStore() {
	return getContext<ReturnType<typeof initAuthStore>>(AUTH_KEY)
}
