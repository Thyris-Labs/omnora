import type { Component } from "svelte"
import type { SVGAttributes } from "svelte/elements"
import PhNotePencilDuotone from "~icons/ph/note-pencil-duotone"

export type ModuleTypes = "NOTES" | "INBOX" | "GALLERY" | "VAULT" | "PASSWORDS" | "REPOSITORIES" | "CHAT"

interface ModuleInformations {
	name: string
	Icon: Component<SVGAttributes<SVGSVGElement>, {}>
}

export const MODULES: Record<ModuleTypes, ModuleInformations> = {
	NOTES: { name: "Notes", Icon: PhNotePencilDuotone },
	INBOX: { name: "Inbox", Icon: PhNotePencilDuotone },
	GALLERY: { name: "Gallery", Icon: PhNotePencilDuotone },
	VAULT: { name: "Vault", Icon: PhNotePencilDuotone },
	PASSWORDS: { name: "Passwords", Icon: PhNotePencilDuotone },
	REPOSITORIES: { name: "Repositories", Icon: PhNotePencilDuotone },
	CHAT: { name: "Chat", Icon: PhNotePencilDuotone }
}
