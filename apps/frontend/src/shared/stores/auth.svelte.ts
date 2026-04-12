import { getContext, setContext } from "svelte"
import * as v from "valibot"
import { apiFetch } from "shared/helpers/api"

export const SignupSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	username: v.pipe(v.string()),
	code: v.optional(v.string()),
})

export const SigninSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	code: v.optional(v.string()),
})

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

	async signup(body: v.InferInput<typeof SignupSchema>) {
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

	async signin(body: v.InferInput<typeof SigninSchema>) {
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
