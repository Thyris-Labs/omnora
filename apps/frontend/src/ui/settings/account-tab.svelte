<script lang="ts">
	import { createForm, Form, reset } from "@formisch/svelte";
	import InputField from "ui/fields/input-field.svelte";
	import SettingsSection from "./section.svelte";
	import SaveBar from "./save-bar.svelte";
	import { updateUserDataSchema } from "shared/schemas/settings";
	import { settings } from "shared/stores/settings.svelte";
	import { auth } from "shared/stores/auth.svelte";

	const accountUpdateForm = createForm({
		schema: updateUserDataSchema,
		initialInput: {
			username: auth.userData?.username,
			displayName: auth.userData?.displayName,
		},
	});

	let user = auth.user;

	async function saveAccountData(output: Parameters<typeof settings.saveAccountData>[0]) {
		const didSave = await settings.saveAccountData(output);
		if (!didSave) return;

		reset(accountUpdateForm, {
			initialInput: output,
		});
	}
</script>

<div class="flex flex-col">
	<SettingsSection
		title="Account"
		description="Manage your public profile details."
	>
		<Form
			of={accountUpdateForm}
			onsubmit={saveAccountData}
			class="flex flex-col gap-y-6"
		>
			<div class="aspect-square w-24 border border-main-900 p-2">
				<img src={user.avatar} alt="" class="h-full w-full object-cover" />
			</div>

			<div class="w-2/3">
				<InputField
					of={accountUpdateForm}
					path={["displayName"]}
					id="displayname-input"
					label="Display Name"
					type="text"
					placeholder={user.displayName}
				/>

				<InputField
					of={accountUpdateForm}
					path={["username"]}
					id="username-input"
					label="Username"
					type="text"
					placeholder={user.username}
				/>
			</div>

			{#if accountUpdateForm.isDirty}
				<SaveBar onReset={() => reset(accountUpdateForm)} />
			{/if}
		</Form>
	</SettingsSection>
</div>
