<script lang="ts">
	import DropdownMenu from "ui/primitives/dropdown-menu";
	import { auth } from "features/auth/store.svelte";
	import { page } from "$app/state";
	import { cn } from "tailwind-variants";

	const currentEnvironment = $derived.by(() => {
		const firstEnvironment = auth.user.environments[0];

		const envID = page.params.environment_id;
		if (!envID) return firstEnvironment;

		const match = auth.user.environments.find((env) => env.id === envID);
		if (!match) return firstEnvironment;

		return match;
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="pl-2.5 pr-3 gap-x-2 items-center select-none h-full py-1.75 text-sm relative flex border-l border-main-900 text-main-50/40 hover:text-main-200 hover:bg-main-900 transition-colors duration-75 aria-expanded:text-main-200"
	>
		<img
			src={currentEnvironment.avatar}
			alt=""
			draggable="false"
			class="h-full aspect-square rounded-full object-cover select-none"
		/>
		{currentEnvironment.name}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" class="w-72" align="end">
		{#each auth.user.environments as env (env.id)}
			{@const isActive = env.id === currentEnvironment.id}

			{@render EnvironmentItem(isActive, env.avatar, env.name)}
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>

{#snippet EnvironmentItem(isActive: boolean, avatar: string, name: string)}
	<DropdownMenu.Item
		class="pl-2.5 pr-3 gap-x-2 select-none h-full py-1.75 text-sm relative flex text-main-50/40"
	>
		<img
			src={avatar}
			alt=""
			draggable="false"
			class="h-full aspect-square rounded-full object-cover select-none size-6"
		/>
		<div
			class={cn(
				"flex gap-x-1.5 items-center min-w-0 w-full",
				isActive && "text-main-50",
			)}
		>
			<span class="truncate min-w-0">{name}</span>
			{#if isActive}
				<span class="text-main-500 text-xs mt-0.5 shrink-0"> - CURRENT </span>
			{/if}
		</div>
	</DropdownMenu.Item>
{/snippet}
