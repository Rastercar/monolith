<script lang="ts">
	import type { SimpleUser } from '$lib/api/user.schema';
	import { authStore } from '$lib/store/auth';
	import { toDateTime } from '$lib/utils/date';
	import { cloudFrontUrl } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let user: SimpleUser;
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
			<div class="w-full">
				<div class="flex justify-between">
					<h1 class="text-2xl mb-2">{user.username}</h1>

					{#if $authStore.user?.id === user.id}
						<div>
							<span class="badge variant-filled-primary">that's you!</span>
						</div>
					{/if}
				</div>

				{#if user.description}
					<span class="text-sm text-surface-700-200-token">About:</span>
					<p class="text-sm">{user.description}</p>
				{:else}
					<p class="text-sm">no description informed</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-4 flex justify-between gap-4">
		<div>
			<div class="flex items-center mb-1">
				<Icon icon="mdi:email" class="mr-2 opacity-80" />
				{user.email}
			</div>

			<div class="flex items-center">
				<div
					class={`h-2 w-2 mr-2 rounded-full ${
						user.emailVerified ? 'bg-success-500' : 'bg-error-500'
					}`}
				/>
				<span class="text-sm">
					{user.emailVerified ? 'email verified' : 'email not verified'}
				</span>
			</div>
		</div>

		<span class="text-sm hidden sm:block mt-auto">
			Created at: {toDateTime(user.createdAt)}
		</span>
	</div>
</div>
