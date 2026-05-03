import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { auth } from "features/auth/store.svelte";
import type { ModuleEntry } from "modules/registry";
import { DEFAULT_SHELL_TAB } from "./types";
import type { ShellTab, ShellTabContent } from "./types";

function getEnvironmentPath() {
	return resolve("/(app)/e/[environment_id]", {
		environment_id: auth.currentEnvironment.id,
	});
}

function getTabPath(tab: ShellTab) {
	const base = getEnvironmentPath();
	return tab.slug ? `${base}/m/${tab.slug}` : base;
}

class ShellStore {
	tabs = $state<ShellTab[]>([]);
	activeTabId = $state<string | null>(null);
	activeTab = $derived(this.tabs.find((tab) => tab.id === this.activeTabId));

	#createTab(content: ShellTabContent): ShellTab {
		return { ...content, id: crypto.randomUUID() };
	}

	#activate(tab: ShellTab) {
		this.activeTabId = tab.id;
		goto(getTabPath(tab));
	}

	newTab() {
		const tab = this.#createTab(DEFAULT_SHELL_TAB);
		this.tabs.push(tab);
		this.#activate(tab);
	}

	selectTab(id: string) {
		const tab = this.tabs.find((tab) => tab.id === id);
		if (!tab) return;
		this.#activate(tab);
	}

	openModule(module: ModuleEntry) {
		const active = this.activeTab;
		if (!active) {
			const tab = this.#createTab(module);
			this.tabs.push(tab);
			this.#activate(tab);
			return;
		}

		Object.assign(active, module);
		this.#activate(active);
	}

	closeTab(id: string) {
		const idx = this.tabs.findIndex((tab) => tab.id === id);
		if (idx === -1) return;

		this.tabs.splice(idx, 1);

		if (id !== this.activeTabId) return;

		const next = this.tabs[idx] ?? this.tabs[idx - 1];
		if (next) {
			this.#activate(next);
		} else {
			this.activeTabId = null;
			goto(getEnvironmentPath());
		}
	}
}

export const shell = new ShellStore();
