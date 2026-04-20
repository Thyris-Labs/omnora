import { setContext, getContext } from "svelte"
import * as v from "valibot"
import { apiFetch, type ApiRequestError } from "shared/helpers/api"
import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import type { Environment, User } from "shared/types"

interface SetupResponse {
	user: Omit<User, "environments">
	environments: Array<Environment>
}

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

type VerifyFlow = "signup" | "signin"

class AuthStore {
	userData = $state<User | null>(null)

	verifying = $state(false)
	submitting = $state(false)
	errorMessage = $state<string | null>(null)

	async setup(signal?: AbortSignal): Promise<ApiRequestError | null> {
		if (this.userData) return null

		const result = await apiFetch("/users/setup", { signal })

		if (result.isErr()) {
			if (result.error.status === 401) this.userData = null
			return result.error
		}

		const body = await result.value.json().catch(() => null) as SetupResponse | null
		if (!body) return null

		this.userData = {
			...body.user,
			environments: body.environments,
		}

		return null
	}

	async verifyEmail(email: string, flow: VerifyFlow) {
		this.submitting = true
		this.errorMessage = null

		const result = await apiFetch("/verify", {
			method: "POST",
			body: JSON.stringify({ email, flow }),
		})

		this.submitting = false

		if (result.isErr()) {
			this.errorMessage = result.error.message
			return
		}

		this.verifying = true
	}

	async signup(body: v.InferInput<ReturnType<typeof createSignupSchema>>) {
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

		goto(resolve("/(app)/e"))
	}

	async signin(body: v.InferInput<ReturnType<typeof createSigninSchema>>) {
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

		goto(resolve("/(app)/e"))
	}

	async logout() {
		const result = await apiFetch("/logout", {
			method: "POST",
		})

		if (result.isErr()) {
			console.error(result.error)
			return
		}

		this.userData = null

		goto(resolve("/signin"))
	}

	get user(): User {
		if (!this.userData) throw new Error("User is not ready")
		return this.userData
	}
}

const AUTH_KEY = Symbol("AUTH_STORE")

export function initAuthStore() {
	return setContext(AUTH_KEY, new AuthStore())
}

export function getAuthStore() {
	return getContext<ReturnType<typeof initAuthStore>>(AUTH_KEY)
}
