import { setContext, getContext } from "svelte"
import { apiFetch, type ApiRequestError } from "lib/api"
import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { page } from "$app/state"
import type { Environment, User } from "lib/types"
import type { SigninPayload, SignupPayload } from "features/auth/schemas"

interface SetupResponse {
	user: Omit<User, "environments">
	environments: Array<Environment>
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

	async signup(body: SignupPayload) {
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

	async signin(body: SigninPayload) {
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

	get currentEnvironment(): Environment {
		const envs = this.user.environments
		const envID = page.params.environment_id
		return envs.find((env) => env.id === envID) ?? envs[0]
	}
}

export const auth = new AuthStore();
