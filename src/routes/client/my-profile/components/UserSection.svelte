<script lang="ts">
	import type { User } from '$lib/api/auth';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import { cloudFrontUrl } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let user: User;
</script>

<div class="sm:card sm:p-4 sm:rounded-lg">
	<div class="flex space-x-4">
		<div class="h-32">
			<Avatar
				src={user.profilePicture
					? cloudFrontUrl(user.profilePicture)
					: '/img/no-pic-placeholder.png'}
				width="w-32"
				rounded="rounded-full"
			/>
		</div>

		<div class="flex w-full">
			<div>
				<div class="flex justify-between">
					<h1 class="text-2xl mb-2">{user.username}</h1>

					<a href="/client/settings/profile">
						<button type="button" class="btn btn-sm variant-filled-primary">
							<Icon icon="mdi:pencil" class="mr-2" />
							Edit
						</button>
					</a>
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
