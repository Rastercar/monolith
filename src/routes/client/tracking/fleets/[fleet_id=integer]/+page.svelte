<script lang="ts">
	import { apiDeleteFleet } from '$lib/api/fleet.js';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import UpdateFleetForm from '$lib/components/non-generic/form/UpdateFleetForm.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	const { data } = $props();

	let fleetDeleted = $state(false);
	let editMode = $state(false);

	const deleteFleetMutation = createMutation(() => ({
		mutationFn: () => apiDeleteFleet(data.fleet.id),
		onError: showErrorToast
	}));

	const deleteFleet = async () => {
		if (!confirm('Permanently delete this fleet ?')) return;

		await deleteFleetMutation.mutateAsync();
		fleetDeleted = true;
	};
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="fleet info"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/fleets'), icon: 'mdi:vehicle-multiple', text: 'fleets' },
			{ text: data.fleet.name }
		]}
	/>

	<hr class="hr my-4" />

	{#if fleetDeleted}
		<DeletionSuccessMessage title="Fleet deleted" href={route('/client/tracking/fleets')} />
	{:else if !editMode}
		<div class="sm:card sm:preset-filled-surface-100-900 sm:p-4">
			<div>
				<div class="opacity-70">Name</div>
				{data.fleet.name}
			</div>

			<div class="mt-4">
				<div class="opacity-70">Description</div>
				{data.fleet.description}
			</div>

			<div class="flex space-x-4 justify-end mt-6">
				<PermissionGuard requiredPermissions="DELETE_FLEET">
					<button class="btn preset-filled-error-200-800" onclick={deleteFleet}>
						<Icon icon="mdi:trash" />
						delete
					</button>
				</PermissionGuard>

				<PermissionGuard requiredPermissions="UPDATE_FLEET">
					<button
						class="btn preset-filled-primary-500"
						onclick={() => {
							editMode = true;
						}}
					>
						<Icon icon="mdi:pencil" />
						edit
					</button>
				</PermissionGuard>
			</div>
		</div>
	{:else}
		<div class="sm:card sm:preset-filled-surface-100-900 sm:p-4">
			<div class="flex mb-2 justify-end">
				<button class="btn preset-filled-warning-200-800" onclick={() => (editMode = false)}>
					<Icon icon="mdi:pencil-off" />
					cancel edit
				</button>
			</div>

			<UpdateFleetForm
				fleetId={data.fleet.id}
				formSchema={data.updateFleetForm}
				onUpdate={() => {
					showSuccessToast('fleet updated');
					editMode = false;
				}}
			/>
		</div>
	{/if}
</div>
