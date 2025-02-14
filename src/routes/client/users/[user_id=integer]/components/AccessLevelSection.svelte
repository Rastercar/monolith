<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import { apiChangeUserAccessLevelMutation } from '$lib/api/user.queries';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import AccessLevelPermissionsInfo from '$lib/components/non-generic/info/AccessLevelPermissionsInfo.svelte';
	import SelectAccessLevelInput from '$lib/components/non-generic/input/SelectAccessLevelInput.svelte';
	import { route } from '$lib/ROUTES';
	import { getAuthContext } from '$lib/store/context';
	import { showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		userId: number;
		accessLevel: AccessLevel;
		onAccessLevelChanged: (_: AccessLevel) => void;
	}

	let { userId, accessLevel, onAccessLevelChanged }: Props = $props();

	let isSelectingNewAccessLevel = $state(false);

	let selectedAccessLevel: AccessLevel | null = $state(null);

	const changeAccessLevelMutation = apiChangeUserAccessLevelMutation();

	const changeAccessLevel = async () => {
		if (!selectedAccessLevel) return;

		const selectedAccessLevelCopy = selectedAccessLevel;

		await changeAccessLevelMutation.mutateAsync({ userId, accessLevelId: selectedAccessLevel.id });

		showSuccessToast('user access level updated');

		onAccessLevelChanged(selectedAccessLevelCopy);

		selectedAccessLevel = null;
		isSelectingNewAccessLevel = false;
	};

	const auth = getAuthContext();
	const { user: currentUser } = $derived(auth);

	let canChangeUserAccessLevel = $derived(currentUser?.id !== userId);
	let accessLevelInputValue = $derived.by(() => selectedAccessLevel?.id.toString() ?? '');
</script>

<div class="card preset-filled-surface-100-900 sm:rounded-lg">
	<Accordion multiple>
		<Accordion.Item value="access-level" panelRounded="p-0">
			{#snippet control()}
				<div class="flex items-center py-2">
					<Icon icon="mdi:shield" width="32" height="32" class="mr-2" />
					Role and Permissions
				</div>
			{/snippet}

			{#snippet panel()}
				<div class="py-2">
					<div class="flex flex-col md:flex-row mb-4 gap-4">
						{#if !isSelectingNewAccessLevel}
							<div>Access Level:</div>

							<a
								href={route(`/client/access-levels/[access_level_id=integer]`, {
									access_level_id: accessLevel.id.toString()
								})}
								class="font-medium text-blue-600 dark:text-blue-500 hover:underline flex items-center"
							>
								{accessLevel.name}

								<Icon icon="mdi:link" class="ml-2" />
							</a>
						{:else}
							Select the new access level
						{/if}

						<PermissionGuard requiredPermissions={'MANAGE_USER_ACCESS_LEVELS'}>
							{#if canChangeUserAccessLevel}
								{#if !isSelectingNewAccessLevel}
									<button
										class="btn btn-sm preset-filled-secondary-200-800 ml-auto"
										onclick={() => (isSelectingNewAccessLevel = true)}
									>
										<Icon icon="mdi:cog" />
										change access level
									</button>
								{:else}
									<button
										class="btn btn-sm preset-filled-warning-200-800 ml-auto"
										onclick={() => {
											selectedAccessLevel = null;
											isSelectingNewAccessLevel = false;
										}}
									>
										<Icon icon="mdi:cog-off" />
										cancel
									</button>
								{/if}
							{/if}
						</PermissionGuard>
					</div>

					{#if isSelectingNewAccessLevel}
						<div class="mt-4">
							<SelectAccessLevelInput
								value={accessLevelInputValue}
								onItemSelected={(v) => {
									selectedAccessLevel = v;
								}}
							/>

							{#if selectedAccessLevel}
								<span class="block mt-4 text-lg">
									New Access Level: {selectedAccessLevel.name}
								</span>

								<p class="opacity-90 text-sm line-clamp-4 my-2">
									{selectedAccessLevel.description}
								</p>

								<hr class="hr my-4" />

								<AccessLevelPermissionsInfo accessLevel={selectedAccessLevel} />

								<div class="flex justify-end mt-4">
									<LoadableButton
										isLoading={changeAccessLevelMutation.isPending}
										classes="btn  preset-filled-primary-200-800"
										onclick={changeAccessLevel}
									>
										change access level
									</LoadableButton>
								</div>
							{/if}
						</div>
					{:else}
						<p class="opacity-90 mb-2">
							{accessLevel.description}
						</p>

						<hr class="hr my-4" />

						<AccessLevelPermissionsInfo {accessLevel} />
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
