import type { ModuleTypes } from "modules/registry"
import type { Basics } from "."

export interface Module extends Basics {
	type: ModuleTypes
	environment_id: string
}

