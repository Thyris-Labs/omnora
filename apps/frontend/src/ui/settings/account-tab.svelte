<script lang="ts">
	import { createForm, Form, reset } from "@formisch/svelte";
	import InputField from "ui/fields/input-field.svelte";
	import SettingsSection from "./section.svelte";
	import SaveBar from "./save-bar.svelte";
	import ErrorBar from "./error-bar.svelte";
	import { updateUserDataSchema } from "shared/schemas/settings";
	import { settings } from "shared/stores/settings.svelte";
	import { auth } from "shared/stores/auth.svelte";
	import PhSpinnerGapBold from "~icons/ph/spinner-gap-bold";
	import { cn } from "tailwind-variants";
	import { presence } from "shared/transitions/presence";
	import Spinner from "ui/icons/spinner.svelte";

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
				<button
					type="button"
					aria-label="Upload avatar"
					aria-busy={settings.avatarUploading}
					disabled={settings.avatarUploading}
					onclick={() => avatarInput.click()}
					class="relative aspect-square size-full border border-main-900 p-2 transition-colors duration-75 hover:border-main-700 hover:bg-main-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-950 aria-busy:cursor-progress disabled:pointer-events-none"
				>
					<img
						src={auth.user.avatar}
						alt=""
						class="h-full w-full object-cover"
					/>
					{#if settings.avatarUploading}
						<div
							class="absolute inset-2 flex items-center justify-center bg-main-950/70 text-main-50/60"
							aria-hidden="true"
						>
							<Spinner width={18} />
						</div>
					{/if}
				</button>
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
