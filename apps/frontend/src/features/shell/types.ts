import type { ModuleInformations, ModuleTypes } from "modules/registry";
import PhSquareDuotone from "~icons/ph/square-duotone";

export interface NewShellTabContent extends ModuleInformations {
	type: "NEW_TAB";
	slug: "";
}

interface ShellTabModuleOverrides {
	NOTES: {
		noteId?: string;
	};
}

export type ModuleShellTabContent<T extends ModuleTypes = ModuleTypes> =
	T extends ModuleTypes
	? ModuleInformations & {
		type: T;
	} & (T extends keyof ShellTabModuleOverrides
		? ShellTabModuleOverrides[T]
		: {})
	: never;

export interface ShellTabBase {
	id: string;
}

export type ShellTab = ShellTabBase & (NewShellTabContent | ModuleShellTabContent);
export type ShellTabContent = NewShellTabContent | ModuleShellTabContent;

export const DEFAULT_SHELL_TAB: NewShellTabContent = {
	type: "NEW_TAB",
	name: "New Tab",
	Icon: PhSquareDuotone,
	slug: "",
};
