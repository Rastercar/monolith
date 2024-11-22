<script lang="ts">
	import { apiDeleteUserById } from '$lib/api/user';
	import type { SimpleUser } from '$lib/api/user.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import { authStore } from '$lib/store/auth';
	import { getToaster } from '$lib/store/toaster';
	import { toDateTime } from '$lib/utils/date';
	import { cloudFrontUrl } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		user: SimpleUser;
	}

	let { user }: Props = $props();

	const dispatch = createEventDispatcher<{ 'user-deleted': void }>();

	const toaster = getToaster();

	const mutation = createMutation({
		mutationFn: () => apiDeleteUserById(user.id),
		onError: () => toaster.error()
	});

	const deleteUser = async () => {
		if (!confirm('are you sure you want to delete this user? this action cannot be undone')) return;

		await $mutation.mutateAsync();
		dispatch('user-deleted');
	};
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
					{:else}
						<PermissionGuard requiredPermissions={['DELETE_USER']}>
							<LoadableButton
								class="btn btn-icon variant-filled-error"
								isLoading={$mutation.isPending}
								on:click={deleteUser}
							>
								<Icon icon="mdi:trash" />
							</LoadableButton>
						</PermissionGuard>
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
				></div>
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
