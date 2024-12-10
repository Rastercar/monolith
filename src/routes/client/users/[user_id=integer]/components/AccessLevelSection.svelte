<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import { apiChangeUserAccessLevel } from '$lib/api/user';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import AccessLevelPermissionsInfo from '$lib/components/non-generic/info/AccessLevelPermissionsInfo.svelte';
	import SelectAccessLevelInput from '$lib/components/non-generic/input/SelectAccessLevelInput.svelte';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { createMutation } from '@tanstack/svelte-query';

	// TODO: get user and access level from page data to avoid querying
	interface Props {
		userId: number;
	}

	let { userId }: Props = $props();

	let isSelectingNewAccessLevel = $state(false);

	let selectedAccessLevel: AccessLevel | null = $state(null);

	const changeAccessLevelMutation = createMutation(() => ({
		mutationFn: (accessLevelId: number) => apiChangeUserAccessLevel({ userId, accessLevelId }),
		onError: showErrorToast
	}));

	const changeAccessLevel = async () => {
		if (!selectedAccessLevel) return;

		const selectedAccessLevelCopy = selectedAccessLevel;

		await changeAccessLevelMutation.mutateAsync(selectedAccessLevel.id);

		showSuccessToast('user access level updated');

		// TODO:
		// accessLevel = selectedAccessLevelCopy;
		selectedAccessLevel = null;
		isSelectingNewAccessLevel = false;
	};

	const auth = getAuthContext();
	const { user: currentUser } = $derived(auth);

	let canChangeUserAccessLevel = $derived(currentUser?.id !== userId);
</script>

<div class="sm:card sm:rounded-lg">
	<Accordion padding="py-2">
		<Accordion.Item regionControl="bg-surface-200-700-token px-4">
			{#snippet summary()}
				<div class="flex items-center py-2">
					<Icon icon="mdi:shield" width="32" height="32" class="mr-2" />
					Role and Permissions
				</div>
			{/snippet}

			{#snippet content()}
				<div class="sm:px-4 py-2">
					<div class="flex mb-4">
						<h4 class="text-lg mr-auto mt-2 flex items-center">
							{#if !isSelectingNewAccessLevel}
								Access Level:
								<a
									href={`/client/access-levels/${accessLevel.id}`}
									class="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-2 flex items-center"
								>
									{accessLevel.name}

									<Icon icon="mdi:link" class="ml-2" />
								</a>
							{:else}
								Select the new access level
							{/if}
						</h4>

						<PermissionGuard requiredPermissions={['MANAGE_USER_ACCESS_LEVELS']}>
							{#if canChangeUserAccessLevel}
								{#if !isSelectingNewAccessLevel}
									<button
										class="btn btn-sm variant-filled-primary"
										onclick={() => (isSelectingNewAccessLevel = true)}
									>
										<Icon icon="mdi:cog" class="mr-2" />
										change access level
									</button>
								{:else}
									<button
										class="btn btn-sm variant-filled-error"
										onclick={() => {
											selectedAccessLevel = null;
											isSelectingNewAccessLevel = false;
										}}
									>
										<Icon icon="mdi:cog-off" class="mr-2" />
										cancel
									</button>
								{/if}
							{/if}
						</PermissionGuard>
					</div>

					{#if isSelectingNewAccessLevel}
						<div class="mt-4">
							<SelectAccessLevelInput
								on:item-selected={(e) => {
									selectedAccessLevel = e.detail;
								}}
							/>

							{#if selectedAccessLevel}
								<span class="block mt-4 text-lg">
									New Access Level: {selectedAccessLevel.name}
								</span>

								<p class="opacity-90 text-sm line-clamp-4 my-2">
									{selectedAccessLevel.description}
								</p>

								<hr class="my-4" />

								<AccessLevelPermissionsInfo accessLevel={selectedAccessLevel} />

								<div class="flex justify-end mt-4">
									<LoadableButton
										isLoading={$changeAccessLevelMutation.isPending}
										class="btn btn-sm variant-filled-primary"
										on:click={changeAccessLevel}
									>
										change access level
									</LoadableButton>
								</div>
							{/if}
						</div>
					{:else}
						<p class="opacity-90 text-sm line-clamp-4 mb-2">
							{accessLevel.description}
						</p>

						<hr class="my-4" />

						<AccessLevelPermissionsInfo {accessLevel} />
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
