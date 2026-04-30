<script lang="ts">
	import { Tabs } from "bits-ui";
	import Dialog from "ui/primitives/dialog";
	import AccountTab from "./account-tab.svelte";
	import { settings } from "features/settings/store.svelte";
	import SettingsTabTrigger from "./settings-tab-trigger.svelte";
	import SettingsCloseButton from "./settings-close-button.svelte";

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
				<aside class="h-full w-50 border-r border-main-800 p-1.5">
					<Dialog.Title class="sr-only">Settings</Dialog.Title>
					<Dialog.Description class="sr-only">
						Manage your account and workspace settings.
					</Dialog.Description>

					<Tabs.List aria-label="Settings sections">
						{#each TABS as tab, i (i)}
							<SettingsTabTrigger value={tab}>
								{tab}
							</SettingsTabTrigger>
						{/each}
					</Tabs.List>
				</aside>

				<div class="flex min-w-0 flex-1 flex-col">
					<SettingsCloseButton />

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
