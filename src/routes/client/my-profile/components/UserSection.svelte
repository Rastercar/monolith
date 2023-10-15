<script lang="ts">
	import type { User } from '$lib/api/auth';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import CreatedAtText from './CreatedAtText.svelte';

	export let user: User;
</script>

<div class="sm:card sm:p-4 sm:rounded-lg">
	<div class="flex space-x-4">
		{#if !user.profilePicture}
			<div class="h-32">
				<Avatar
					src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
					width="w-32"
					rounded="rounded-full"
				/>
			</div>
		{/if}

		<div class="flex w-full">
			<div>
				<div class="flex justify-between">
					<h1 class="text-2xl mb-2">{user.username}</h1>

					<CreatedAtText date={user.createdAt} />
				</div>

				{#if user.description}
					<span class="text-sm text-surface-700-200-token">About me:</span>
					<p class="text-sm">{user.description}</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-4 flex flex-wrap items-center justify-between">
		<div class="flex items-center">
			<Icon icon="mdi:email" class="mr-2 opacity-80" />
			{user.email}
		</div>

		{#if !user.emailVerified}
			<EmailNotConfirmedWarning emailAddress={user.email} />
		{/if}
	</div>
</div>
