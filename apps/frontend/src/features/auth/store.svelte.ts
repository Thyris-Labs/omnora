import { apiErrorMessage, client } from "lib/api";
import type { TuyauError } from "@tuyau/core/client";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import type { Environment, User } from "lib/types";
import type { SigninPayload, SignupPayload } from "features/auth/schemas";

type VerifyFlow = "signup" | "signin";

class AuthStore {
	userData = $state<User | null>(null);

	verifying = $state(false);
	submitting = $state(false);
	errorMessage = $state<string | null>(null);

	async setup(signal?: AbortSignal): Promise<TuyauError | null> {
		if (this.userData) return null;

		const [body, error] = await client.get("/api/v1/users/setup", { signal }).safe();

		if (error) {
			if (error.status === 401) this.userData = null;
			return error;
		}

		if (!body) return null;

		this.userData = {
			...body.user,
			environments: body.environments,
		};

		return null;
	}

	async verifyEmail(email: string, flow: VerifyFlow) {
		this.submitting = true;
		this.errorMessage = null;

		const [, error] = await client.post("/api/v1/auth/verify", { body: { email, flow } }).safe();

		this.submitting = false;

		if (error) {
			this.errorMessage = apiErrorMessage(error);
			return;
		}

		this.verifying = true;
	}

	async signup(body: SignupPayload) {
		this.submitting = true;
		this.errorMessage = null;

		const [, error] = await client
			.post("/api/v1/auth/signup", {
				body: {
					email: body.email,
					username: body.username,
					code: body.code ?? "",
				},
			})
			.safe();

		this.submitting = false;

		if (error) {
			this.errorMessage = apiErrorMessage(error);
			return;
		}

		goto(resolve("/(app)/e"));
	}

	async signin(body: SigninPayload) {
		this.submitting = true;
		this.errorMessage = null;

		const [, error] = await client
			.post("/api/v1/auth/signin", {
				body: {
					email: body.email,
					code: body.code ?? "",
				},
			})
			.safe();

		this.submitting = false;

		if (error) {
			this.errorMessage = apiErrorMessage(error);
			return;
		}

		goto(resolve("/(app)/e"));
	}

	async logout() {
		const [, error] = await client.post("/api/v1/auth/logout", {}).safe();

		if (error) {
			console.error(error);
			return;
		}

		this.userData = null;

		goto(resolve("/signin"));
	}

	get user(): User {
		if (!this.userData) throw new Error("User is not ready");
		return this.userData;
	}

	get currentEnvironment(): Environment {
		const envs = this.user.environments;
		const envID = page.params.environment_id;
		return envs.find((env) => env.id === envID) ?? envs[0];
	}
}

export const auth = new AuthStore();
