<script lang="ts">
	import CreateUserPermissionSelectedAlert from '$lib/components/non-generic/alert/CreateUserPermissionSelectedAlert.svelte';
	import ManageAccessLevelsPermissionSelectedAlert from '$lib/components/non-generic/alert/ManageAccessLevelsPermissionSelectedAlert.svelte';
	import {
		allPermissionsGroupedByCategory,
		permissionCategoryIcons,
		type PermissionDetailsAndKey,
		type apiPermission,
		type apiPermissionCategory
	} from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	/**
	 * key: permission key (eg: CREATE_USER)
	 * val: boolean indicating the permission is selected
	 */
	export let permissionToToggleStatus: Record<apiPermission, boolean>;

	export let showManageUserAccessLevelsWarningIfToggled = true;

	$: permissionsByCategory = Object.entries(allPermissionsGroupedByCategory) as [
		[apiPermissionCategory, PermissionDetailsAndKey[]]
	];
</script>

{#each permissionsByCategory as [category, permissions], i}
	<div class="mt-6 mb-2 flex items-center text-lg">
		<Icon icon={permissionCategoryIcons[category]} class="mr-2" height={20} />
		{category}
	</div>

	<div class="flex flex-col gap-4">
		{#each permissions as permissionDetails}
			<div>
				<div class="flex items-center gap-4 mb-2">
					<SlideToggle
						name="slide"
						bind:checked={permissionToToggleStatus[permissionDetails.key]}
						size="sm"
					/>

					{permissionDetails.summary}
				</div>

				<span class="text-sm">
					{permissionDetails.description}
				</span>
			</div>
		{/each}

		{#if i !== permissionsByCategory.length - 1}
			<hr />
		{/if}
	</div>
{/each}

{#if permissionToToggleStatus['CREATE_USER']}
	<CreateUserPermissionSelectedAlert />
{/if}

{#if showManageUserAccessLevelsWarningIfToggled && permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS']}
	<ManageAccessLevelsPermissionSelectedAlert
		on:undo-clicked={() => (permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS'] = false)}
	/>
{/if}
