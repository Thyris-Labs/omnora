import type { Basics } from "."

export type ModuleTypes = "NOTES"

export interface Module extends Basics {
	type: ModuleTypes
	environment_id: string
}

