<script lang="ts">
	import { apiDeleteAccessLevel } from '$lib/api/access-level';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import { route } from '$lib/ROUTES';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	let { data } = $props();

	let editMode = $state(data.startInEditMode);

	let accessLevel = $state(data.accessLevel);
	let accessLevelDeleted = $state(false);

	const deleteAccessLevelMutation = createMutation(() => ({
		mutationFn: () => apiDeleteAccessLevel(accessLevel.id),
		onError: showErrorToast
	}));

	const deleteAccessLevel = async () => {
		if (!confirm('Permanently delete this access level ?')) return;

		await deleteAccessLevelMutation.mutateAsync().then(() => (accessLevelDeleted = true));
	};

	const auth = getAuthContext();
	const { user } = $derived(auth);

	let accessLevelIsFixed = $derived(accessLevel.isFixed);

	let isCurrentUserAccessLevel = $derived(accessLevel.id === user?.accessLevel.id);

	let canEditOrDeleteAccessLevel = $derived(!accessLevelIsFixed && !isCurrentUserAccessLevel);
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="Access Level"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/access-levels'), icon: 'mdi:shield', text: 'access levels' },
			{
				href: route(`/client/access-levels/[access_level_id=integer]`, {
					access_level_id: accessLevel.id.toString()
				}),
				text: data.accessLevel.id.toString()
			}
		]}
	/>

	{#if accessLevelDeleted}
		<DeletionSuccessMessage
			title="Access level deleted successfully"
			href={route('/client/access-levels')}
		/>
	{:else}
		<div class="flex items-center">
			<div class="flex items-center mr-auto text-xl">
				{editMode ? 'Editing access level' : `Name: ${accessLevel?.name ?? ''}`}
			</div>

			<!-- TODO: -->
			<!-- <span
				class:hidden={!accessLevelIsFixed || !isCurrentUserAccessLevel}
				class="badge variant-filled-primary mx-4"
				use:popup={{ event: 'hover', target: 'accessLevelBadgePopup', placement: 'top' }}
			>
				{isCurrentUserAccessLevel ? 'your access level' : 'fixed access level'}
			</span> -->

			<ArrowUpTooltip dataPopup="accessLevelBadgePopup">
				<div class="text-sm text-center">
					{isCurrentUserAccessLevel
						? 'this is your own access level and thus cannot be edited nor deleted'
						: 'this is main access level of your organization and cannot be edited nor deleted'}
				</div>
			</ArrowUpTooltip>

			<!-- TODO: -->
			<!-- <LoadableButton
				isLoading={$deleteAccessLevelMutation.isPending}
				disabled={!canEditOrDeleteAccessLevel}
				class="btn-icon mx-2 btn-icon-sm variant-filled-error"
				on:click={deleteAccessLevel}
			>
				<Icon icon="mdi:trash" />
			</LoadableButton> -->

			<button
				disabled={!canEditOrDeleteAccessLevel}
				class="btn-icon btn-icon-sm variant-filled-primary"
				onclick={() => (editMode = !editMode)}
			>
				<Icon icon={editMode ? 'mdi:pencil-off' : 'mdi:pencil'} />
			</button>
		</div>

		<!-- TODO: -->
		<!-- {#if error}
			<div class="text-error-500">Error loading access level</div>
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
		{/if} -->
	{/if}
</div>
