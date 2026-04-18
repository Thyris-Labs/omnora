import type { Basics, Environment } from "./index"

interface IUser extends Basics {
	email: string
	username: string
	display_name: string
	avatar: string
}

export interface User extends IUser {
	environments: Array<Environment>
}
