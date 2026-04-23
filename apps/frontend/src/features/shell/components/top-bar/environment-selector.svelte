<script lang="ts">
	import DropdownMenu from "ui/primitives/dropdown-menu";
	import Avatar from "ui/primitives/avatar.svelte";
	import { auth } from "features/auth/store.svelte";
	import { cn } from "tailwind-variants";
	import { goto } from "$app/navigation";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="pl-2.5 pr-3 gap-x-2 items-center select-none h-full py-1.75 text-sm relative flex border-l border-main-900 text-main-50/40 hover:text-main-200 hover:bg-main-900 transition-colors duration-75 aria-expanded:text-main-200"
	>
		<Avatar
			src={auth.currentEnvironment.avatar}
			name={auth.currentEnvironment.name}
			class="h-full"
		/>
		{auth.currentEnvironment.name}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" class="w-72" align="end">
		{#each auth.user.environments as env (env.id)}
			{@const isActive = env.id === auth.currentEnvironment.id}
			<DropdownMenu.Item
				class={cn(
					"pl-2.5 pr-3 gap-x-2 select-none h-full py-1.75 text-sm relative flex text-main-50/40",
					isActive && "data-highlighted:bg-main-900/35",
				)}
				onSelect={() => goto(`/e/${env.id}`)}
			>
				<Avatar src={env.avatar} name={env.name} class="size-6" />
				<div
					class={cn(
						"flex gap-x-1.5 items-center min-w-0 w-full",
						isActive && "text-main-50",
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
