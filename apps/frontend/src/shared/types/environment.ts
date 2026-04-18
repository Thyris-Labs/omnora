import type { Basics } from "."
import type { Module } from "./module"

export interface Environment extends Basics {
	name: string
	avatar: string
	modules: Array<Module>
}
