import { apiFetch } from "shared/helpers/api"
import type { UpdateUserDataPayload } from "shared/schemas/settings"
import { auth } from "./auth.svelte"

class SettingsStore {
	isOpen = $state(false)
	avatarUploading = $state(false)
	errorMessage = $state<string | null>(null)
	errorTimeout: ReturnType<typeof setTimeout> | null = null

	openSettings() {
		this.isOpen = true
	}

	clearError() {
		if (this.errorTimeout) clearTimeout(this.errorTimeout)
		this.errorTimeout = null
		this.errorMessage = null
	}

	setError(message: string) {
		this.clearError()
		this.errorMessage = message
		this.errorTimeout = setTimeout(() => {
			this.errorMessage = null
			this.errorTimeout = null
		}, 2000)
	}

	async saveAccountData(body: UpdateUserDataPayload) {
		this.clearError()

		const result = await apiFetch("/users/edit", {
			method: "PATCH",
			body: JSON.stringify(body)
		})

		if (result.isErr()) {
			console.error(result.error)
			this.setError(result.error.message)
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

	async updateAvatar(avatar: File) {
		this.avatarUploading = true
		this.clearError()

		const formData = new FormData()
		formData.append("avatar", avatar)

		const result = await apiFetch("/users/avatar", {
			method: "PATCH",
			body: formData,
		})

		this.avatarUploading = false

		if (result.isErr()) {
			console.error(result.error)
			this.setError(result.error.message)
			return false
		}

		const body = await result.value.json() as { avatarUrl: string }

		if (!auth.userData) {
			this.setError("Your session is not ready. Please try again.")
			return false
		}

		auth.userData = {
			...auth.userData,
			avatar: body.avatarUrl
		}

		return true
	}
}

export const settings = new SettingsStore();
