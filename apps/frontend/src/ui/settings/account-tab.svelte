<script lang="ts">
	import { createForm, Form, reset } from "@formisch/svelte";
	import { getAuthStore } from "shared/stores/auth.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import SettingsSection from "./section.svelte";
	import SaveBar from "./save-bar.svelte";
	import { updateUserDataSchema } from "shared/schemas/settings";

	let user = getAuthStore().user;
	const accountUpdateForm = createForm({
		schema: updateUserDataSchema,
		initialInput: {
			username: user.username,
			displayName: user.display_name,
		},
	});
</script>

<div class="flex flex-col">
	<SettingsSection
		title="Account"
		description="Manage your public profile details."
	>
		<Form
			of={accountUpdateForm}
			onsubmit={(output) => console.log(output)}
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
					placeholder={user.display_name}
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
