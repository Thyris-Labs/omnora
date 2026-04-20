import type { UpdateUserDataPayload } from "shared/schemas/settings"
import { getContext, setContext } from "svelte"

class SettingsStore {
	isOpen = $state(false)

	openSettings() {
		this.isOpen = true
	}

	async saveAccountData(body: UpdateUserDataPayload) {

	}
}

const SETTINGS_KEY = Symbol("SETTINGS_STORE")

export function initSettingsStore() {
	return setContext(SETTINGS_KEY, new SettingsStore())
}

export function getSettingsStore() {
	return getContext<ReturnType<typeof initSettingsStore>>(SETTINGS_KEY)
}
