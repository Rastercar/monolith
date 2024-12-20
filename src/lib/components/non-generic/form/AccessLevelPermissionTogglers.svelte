<script lang="ts">
	import CreateUserPermissionSelectedAlert from '$lib/components/non-generic/alert/CreateUserPermissionSelectedAlert.svelte';
	import ManageAccessLevelsPermissionSelectedAlert from '$lib/components/non-generic/alert/ManageAccessLevelsPermissionSelectedAlert.svelte';
	import {
		allPermissionsGroupedByCategory,
		permissionCategoryIcons,
		type PermissionDetailsAndKey,
		type permission,
		type permissionCategory
	} from '$lib/constants/permissions';
	import Icon from '@iconify/svelte';

	interface Props {
		/**
		 * key: permission key (eg: CREATE_USER)
		 * val: boolean indicating the permission is selected
		 */
		permissionToToggleStatus: Record<permission, boolean>;

		/**
		 * if a warning should be shown explaining when the CREATE_USERS
		 * permission is selected, explaining it is not possible to create
		 * a user with permissions the creator does not have
		 */
		showManageUserAccessLevelsWarningIfToggled?: boolean;
	}

	let {
		permissionToToggleStatus = $bindable(),
		showManageUserAccessLevelsWarningIfToggled = true
	}: Props = $props();

	let permissionsByCategory = $derived(
		Object.entries(allPermissionsGroupedByCategory) as [
			[permissionCategory, PermissionDetailsAndKey[]]
		]
	);
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
					<input
						class="checkbox"
						type="checkbox"
						bind:checked={permissionToToggleStatus[permissionDetails.key]}
					/>
					{permissionDetails.summary}
				</div>

				<span class="text-sm">
					{permissionDetails.description}
				</span>
			</div>
		{/each}

		{#if i !== permissionsByCategory.length - 1}
			<hr class="hr" />
		{/if}
	</div>
{/each}

{#if permissionToToggleStatus['CREATE_USER']}
	<CreateUserPermissionSelectedAlert />
{/if}

{#if showManageUserAccessLevelsWarningIfToggled && permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS']}
	<ManageAccessLevelsPermissionSelectedAlert
		onUndoClicked={() => (permissionToToggleStatus['MANAGE_USER_ACCESS_LEVELS'] = false)}
	/>
{/if}
