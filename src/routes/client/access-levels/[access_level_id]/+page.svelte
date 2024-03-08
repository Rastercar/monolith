<script lang="ts">
	import { apiDeleteAccessLevel, apiGetAccessLevelById } from '$lib/api/access-level';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import { authStore } from '$lib/store/auth';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import AccessLevelInfo from './components/AccessLevelInfo.svelte';
	import UpdateAccessLevelForm from './components/UpdateAccessLevelForm.svelte';

	export let data: PageData;

	let editMode = data.startInEditMode;

	let accessLevelDeleted = false;

	const toaster = getToaster();

	const query = createQuery({
		queryKey: ['access-level', data.accessLevelId],
		queryFn: () => apiGetAccessLevelById(data.accessLevelId)
	});

	const deleteAccessLevelMutation = createMutation({
		mutationFn: () => apiDeleteAccessLevel(data.accessLevelId),
		onError: () => toaster.error()
	});

	const deleteAccessLevel = async () => {
		if (!confirm('Permanently delete this access level ?')) return;

		await $deleteAccessLevelMutation.mutateAsync().then(() => (accessLevelDeleted = true));
	};

	$: ({ data: accessLevel, error, isLoading } = $query);

	$: ({ user } = $authStore);

	$: accessLevelIsFixed = !!accessLevel?.isFixed;

	$: isCurrentUserAccessLevel = !!accessLevel && accessLevel.id === user?.accessLevel.id;

	$: canEditOrDeleteAccessLevel = !accessLevelIsFixed && !isCurrentUserAccessLevel;
</script>

<div class="p-6 max-w-4xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="Access Level"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ href: '/client/access-levels', icon: 'mdi:shield', text: 'access levels' },
			{ href: `/client/access-levels/${data.accessLevelId}`, text: data.accessLevelId.toString() }
		]}
	/>

	{#if accessLevelDeleted}
		<DeletionSuccessMessage
			title="Access level deleted successfully"
			href="/client/access-levels"
		/>
	{:else}
		<div class="flex items-center">
			<div class="flex items-center mr-auto text-xl">
				{editMode ? 'Editing access level' : `Name: ${accessLevel?.name ?? ''}`}
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
						? 'this is your own access level and thus cannot be edited nor deleted'
						: 'this is main access level of your organization and cannot be edited nor deleted'}
				</div>
			</ArrowUpTooltip>

			<PermissionGuard requiredPermissions={['MANAGE_USER_ACCESS_LEVELS']}>
				<LoadableButton
					isLoading={$deleteAccessLevelMutation.isPending}
					disabled={!canEditOrDeleteAccessLevel}
					class="btn-icon mx-2 btn-icon-sm variant-filled-error"
					on:click={deleteAccessLevel}
				>
					<Icon icon="mdi:trash" />
				</LoadableButton>

				<button
					disabled={!canEditOrDeleteAccessLevel}
					class="btn-icon btn-icon-sm variant-filled-primary"
					on:click={() => (editMode = !editMode)}
				>
					<Icon icon={editMode ? 'mdi:pencil-off' : 'mdi:pencil'} />
				</button>
			</PermissionGuard>
		</div>

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
	{/if}
</div>
