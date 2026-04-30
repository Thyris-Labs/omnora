<script lang="ts">
	import DropdownMenu from "ui/primitives/dropdown-menu";
	import Avatar from "ui/primitives/avatar.svelte";
	import { auth } from "features/auth/store.svelte";
	import { cn } from "tailwind-variants";
	import { goto } from "$app/navigation";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="relative flex h-full select-none items-center gap-x-2 border-l border-main-800 py-1.75 pl-2.5 pr-3 text-sm text-main-500 outline-none transition-ds hover:bg-main-900 hover:text-main-200 aria-expanded:text-main-200"
	>
		<Avatar
			src={auth.currentEnvironment.avatar}
			name={auth.currentEnvironment.name}
			class="size-5.5 shrink-0"
		/>
		<span class="text-nowrap">{auth.currentEnvironment.name}</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" class="w-72" align="end">
		{#each auth.user.environments as env (env.id)}
			{@const isActive = env.id === auth.currentEnvironment.id}
			<DropdownMenu.Item
				class={cn(
					"relative flex h-full select-none gap-x-2 py-1.75 pl-2.5 pr-3 text-sm text-main-500",
					isActive && "data-highlighted:bg-main-900",
				)}
				onSelect={() => goto(`/e/${env.id}`)}
			>
				<Avatar src={env.avatar} name={env.name} class="size-6" />
				<div
					class={cn(
						"flex gap-x-1.5 items-center min-w-0 w-full",
						isActive && "text-main-100",
					)}
				>
					<span class="truncate min-w-0">{env.name}</span>
					{#if isActive}
						<span class="text-main-500 text-xs mt-0.5 shrink-0">
							- CURRENT
						</span>
					{/if}
				</div>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
