import type { Component } from "svelte";
import type { SVGAttributes } from "svelte/elements";
import PhChatDuotone from "~icons/ph/chat-duotone";
import PhGitBranchDuotone from "~icons/ph/git-branch-duotone";
import PhImageSquareDuotone from "~icons/ph/image-square-duotone";
import PhEnvelopeDuotone from "~icons/ph/envelope-duotone";
import PhKeyDuotone from "~icons/ph/key-duotone";
import PhVaultDuotone from "~icons/ph/vault-duotone";

export type ModuleTypes =
  | "INBOX"
  | "GALLERY"
  | "VAULT"
  | "PASSWORDS"
  | "REPOSITORIES"
  | "CHAT";

export interface ModuleInformations {
  name: string;
  slug: string;
  Icon: Component<SVGAttributes<SVGSVGElement>, {}>;
}

export interface ModuleEntry extends ModuleInformations {
  type: ModuleTypes;
}

export const MODULES: Record<ModuleTypes, ModuleInformations> = {
  INBOX: { name: "Inbox", slug: "inbox", Icon: PhEnvelopeDuotone },
  GALLERY: { name: "Gallery", slug: "gallery", Icon: PhImageSquareDuotone },
  VAULT: { name: "Vault", slug: "vault", Icon: PhVaultDuotone },
  PASSWORDS: { name: "Passwords", slug: "passwords", Icon: PhKeyDuotone },
  REPOSITORIES: {
    name: "Repositories",
    slug: "repositories",
    Icon: PhGitBranchDuotone,
  },
  CHAT: { name: "Chat", slug: "chat", Icon: PhChatDuotone },
};

export const MODULE_ENTRIES = Object.entries(MODULES).map(([type, module]) => ({
  type: type as ModuleTypes,
  ...module,
})) satisfies ModuleEntry[];

export const MODULES_BY_SLUG = Object.fromEntries(
  MODULE_ENTRIES.map((module) => [module.slug, module]),
) as Record<string, ModuleEntry>;
