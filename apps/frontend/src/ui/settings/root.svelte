<script lang="ts">
	import { Tabs } from "bits-ui";
	import Dialog from "ui/primitives/dialog";
	import PhXBold from "~icons/ph/x-bold";
	import AccountTab from "./account-tab.svelte";
	import { settings } from "shared/stores/settings.svelte";

	const TABS = ["account"] as const;

	let activeTab = $state<(typeof TABS)[number]>("account");
</script>

<Dialog.Root bind:open={settings.isOpen}>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content class="flex h-150 w-200">
			<Tabs.Root
				bind:value={activeTab}
				orientation="vertical"
				class="flex min-h-0 flex-1"
			>
				<aside class="h-full w-50 border-r border-main-900 p-1.5">
					<Dialog.Title class="sr-only">Settings</Dialog.Title>
					<Dialog.Description class="sr-only">
						Manage your account and workspace settings.
					</Dialog.Description>

					<Tabs.List aria-label="Settings sections">
						{#each TABS as tab, i (i)}
							<Tabs.Trigger
								value={tab}
								class="flex w-full justify-start gap-x-2 border border-transparent px-2 py-1.5 text-sm text-main-500 capitalize outline-none transition-[background-color,box-shadow,transform,scale,color] duration-75 hover:bg-main-900 hover:text-main-300 active:scale-[0.98] data-[state=active]:border-main-800 data-[state=active]:bg-main-900 data-[state=active]:text-main-50 focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-950"
							>
								{tab}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</aside>

				<div class="flex min-w-0 flex-1 flex-col">
					<Dialog.Close
						aria-label="Close settings"
						class="absolute top-2 right-2 flex size-6 items-center justify-center border border-main-800 text-main-500 outline-none transition duration-75 hover:border-main-700 hover:bg-main-900 hover:text-main-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-950"
					>
						<PhXBold class="size-3.5" aria-hidden="true" />
					</Dialog.Close>

					<div class="min-h-0 flex-1 overflow-y-auto">
						<Tabs.Content value="account">
							<AccountTab />
						</Tabs.Content>
					</div>
				</div>
			</Tabs.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
