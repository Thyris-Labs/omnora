<script lang="ts">
	import { createForm, Form } from "@formisch/svelte";
	import { getAuthStore } from "shared/stores/auth.svelte";
	import InputField from "ui/fields/input-field.svelte";
	import * as v from "valibot";
	import SettingsSection from "./section.svelte";

	let user = getAuthStore().user;

	const accountUpdateForm = createForm({
		schema: v.object({
			avatar: v.pipe(
				v.file(),
				v.mimeType(
					["image/jpeg", "image/png"],
					"Please select a JPEG or PNG file.",
				),
				v.maxSize(1024 * 1024 * 10, "Please select a file smaller than 10 MB."),
			),
			displayName: v.pipe(
				v.string(),
				v.maxLength(24, "Your display name must be less than 24 characters"),
			),
			username: v.pipe(
				v.string(),
				v.maxLength(24, "Your username must be less than 24 characters"),
			),
		}),

		initialInput: {
			displayName: user.display_name,
			username: user.username,
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
		</Form>
	</SettingsSection>
</div>
