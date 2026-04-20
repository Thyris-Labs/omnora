import { apiFetch } from "shared/helpers/api"
import type { UpdateUserDataPayload } from "shared/schemas/settings"
import { auth } from "./auth.svelte"

class SettingsStore {
	isOpen = $state(false)

	openSettings() {
		this.isOpen = true
	}

	async saveAccountData(body: UpdateUserDataPayload) {
		const result = await apiFetch("/users/update", {
			method: "PATCH",
			body: JSON.stringify(body)
		})

		if (result.isErr()) {
			console.error(result.error)
			return false
		}

		if (!auth.userData) return false
		auth.userData = {
			...auth.userData,
			displayName: body.displayName,
			username: body.username
		}

		return true
	}
}

export const settings = new SettingsStore();
