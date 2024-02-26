<script lang="ts">
	import { apiGetAccessLevelById } from '$lib/api/access-level';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import { authStore } from '$lib/store/auth';
	import Icon from '@iconify/svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import AccessLevelInfo from './components/AccessLevelInfo.svelte';
	import UpdateAccessLevelForm from './components/UpdateAccessLevelForm.svelte';

	export let data: PageData;

	let editMode = false;

	const query = createQuery({
		queryKey: ['access-level', data.accessLevelId],
		queryFn: () => apiGetAccessLevelById(data.accessLevelId)
	});

	$: ({ user } = $authStore);

	$: ({ data: accessLevel, error, isLoading } = $query);

	$: accessLevelIsFixed = !!accessLevel?.isFixed;

	$: isCurrentUserAccessLevel = !!accessLevel && accessLevel.id === user?.accessLevel.id;

	$: canEditAccessLevel = !accessLevelIsFixed && !isCurrentUserAccessLevel;
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	<div class="card">
		<div class="flex items-center p-4">
			<div class="flex items-center mr-auto">
				<Icon icon="mdi:shield" width="32" height="32" class="mr-2" />
				{editMode ? 'Editing access level' : `Access Level: ${accessLevel?.name ?? ''}`}
			</div>

			<span
				class:hidden={!accessLevelIsFixed || !isCurrentUserAccessLevel}
				class="badge variant-filled-primary mx-4"
				use:popup={{ event: 'hover', target: 'accessLevelBadgePopup', placement: 'top' }}
			>
				{isCurrentUserAccessLevel ? 'your access level' : 'fixed access level'}
			</span>

			<ArrowUpTooltip dataPopup="accessLevelBadgePopup">
				<div class="text-sm text-center">
					{isCurrentUserAccessLevel
						? 'this is your own access level and thus cannot be edited'
						: 'this is main access level of your organization and cannot be edited'}
				</div>
			</ArrowUpTooltip>

			<PermissionGuard requiredPermissions={['MANAGE_USER_ACCESS_LEVELS']}>
				<button
					disabled={!canEditAccessLevel}
					class="btn-icon btn-icon-sm variant-filled-primary"
					on:click={() => (editMode = !editMode)}
				>
					<Icon icon={editMode ? 'mdi:pencil-off' : 'mdi:pencil'} />
				</button>
			</PermissionGuard>
		</div>

		<div class="px-4 pb-4">
			{#if error}
				<div class="text-error-500">Error loading access level</div>
			{:else if isLoading}
				<div>loading</div>
			{:else if accessLevel}
				{#if editMode}
					<UpdateAccessLevelForm
						{accessLevel}
						formSchema={data.updateAccessLevelForm}
						on:access-level-updated={({ detail: updatedAccessLevel }) => {
							accessLevel = updatedAccessLevel;
							editMode = false;
						}}
					/>
				{:else}
					<AccessLevelInfo {accessLevel} />
				{/if}
			{/if}
		</div>
	</div>
</div>
