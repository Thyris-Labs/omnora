<script lang="ts">
	import PhDotsThreeBold from "~icons/ph/dots-three-bold";
	import PhSignOutDuotone from "~icons/ph/sign-out-duotone";
	import PhGearDuotone from "~icons/ph/gear-duotone";
	import DropdownMenu from "ui/primitives/dropdown-menu";
	import { settings } from "features/settings/store.svelte";
	import { auth } from "features/auth/store.svelte";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="h-11 flex w-full items-center gap-x-2 border-t border-main-900 px-3 text-sm text-main-100 select-none outline-none transition-colors duration-75 group focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main-950"
	>
		<img
			class="size-6 rounded-full object-cover"
			alt=""
			src={auth.userData?.avatar}
			draggable="false"
		/>
		{auth.userData?.displayName}

		<span
			aria-hidden="true"
			class="ml-auto flex size-5.5 items-center justify-center rounded-full border border-main-700 transition-[background-color,border-color] duration-75 group-hover:border-main-700 group-hover:bg-main-900 group-data-[state=open]:border-main-700 group-data-[state=open]:bg-main-900"
		>
			<PhDotsThreeBold class="size-4 text-main-300" />
		</span>
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="mb-2 w-[calc(var(--bits-dropdown-menu-anchor-width)-1rem)]"
		>
			<DropdownMenu.Item
				textValue="Settings"
				onSelect={() => settings.openSettings()}
			>
				Settings
				<PhGearDuotone
					class="size-4 text-main-50/50 group-data-highlighted:text-main-50"
				/>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				variant="danger"
				textValue="Log out"
				onSelect={() => auth.logout()}
			>
				Log out
				<PhSignOutDuotone
					class="size-4 text-main-50/50 group-data-highlighted:text-rose-600"
				/>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
