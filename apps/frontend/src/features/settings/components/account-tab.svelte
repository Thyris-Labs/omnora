<script lang="ts">
	import { createForm, Form, reset } from "@formisch/svelte";
	import InputField from "ui/fields/input-field.svelte";
	import SettingsSection from "./section.svelte";
	import SaveBar from "./save-bar.svelte";
	import ErrorBar from "./error-bar.svelte";
	import { updateUserDataSchema } from "features/settings/schemas";
	import { settings } from "features/settings/store.svelte";
	import { auth } from "features/auth/store.svelte";
	import { cn } from "tailwind-variants";
	import { presence } from "lib/transitions/presence";
	import AvatarUploadButton from "./avatar-upload-button.svelte";

	const accountUpdateForm = createForm({
		schema: updateUserDataSchema,
		initialInput: {
			username: auth.userData?.username,
			displayName: auth.userData?.displayName,
		},
	});

	let avatarInput: HTMLInputElement;

	async function saveAccountData(
		output: Parameters<typeof settings.saveAccountData>[0],
	) {
		const didSave = await settings.saveAccountData(output);
		if (!didSave) return;

		reset(accountUpdateForm, {
			initialInput: output,
		});
	}

	async function onFile(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.files?.length) return;
		if (settings.avatarUploading) return;

		const file = target.files?.[0];
		await settings.updateAvatar(file);
		target.value = "";
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
			<div class="size-24">
				<AvatarUploadButton
					src={auth.user.avatar}
					uploading={settings.avatarUploading}
					onclick={() => avatarInput.click()}
				/>
				<input
					bind:this={avatarInput}
					id="avatar-input"
					type="file"
					accept="image/jpeg,image/png,image/webp"
					disabled={settings.avatarUploading}
					class="hidden"
					onchange={onFile}
				/>
			</div>

			<div class="w-2/3">
				<InputField
					of={accountUpdateForm}
					path={["displayName"]}
					id="displayname-input"
					label="Display Name"
					type="text"
					placeholder={auth.user.displayName}
				/>

				<InputField
					of={accountUpdateForm}
					path={["username"]}
					id="username-input"
					label="Username"
					type="text"
					placeholder={auth.user.username}
				/>
			</div>

			{#if settings.errorMessage || accountUpdateForm.isDirty}
				<div
					class={cn(
						"absolute -bottom-4 left-1/2 flex -translate-x-1/2 flex-col gap-y-2",
						settings.errorMessage ? "w-120" : "w-125",
					)}
					in:presence={{ duration: 100, y: 4, blur: 4 }}
					out:presence={{ duration: 100, y: 8, blur: 4 }}
				>
					{#if settings.errorMessage}
						<ErrorBar message={settings.errorMessage} />
					{/if}
					{#if accountUpdateForm.isDirty}
						<SaveBar onReset={() => reset(accountUpdateForm)} />
					{/if}
				</div>
			{/if}
		</Form>
	</SettingsSection>
</div>
