import type { Component } from "svelte"
import type { SVGAttributes } from "svelte/elements"
import PhNotePencilDuotone from "~icons/ph/note-pencil-duotone"

export type ModuleTypes = "NOTES"

interface ModuleInformations {
	name: string
	Icon: Component<SVGAttributes<SVGSVGElement>, {}>
}

export const MODULES: Record<ModuleTypes, ModuleInformations> = {
	NOTES: { name: "Notes", Icon: PhNotePencilDuotone }
}
