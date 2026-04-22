import type { Basics } from "."

export interface Environment extends Basics {
	name: string
	avatar: string
	ownerId: string
}
