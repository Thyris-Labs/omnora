import type { Basics, Environment } from "."

interface IUser extends Basics {
	email: string
	username: string
	display_name: string
	avatar: string
}

export interface User extends IUser {
	environments: Array<Environment>
}
