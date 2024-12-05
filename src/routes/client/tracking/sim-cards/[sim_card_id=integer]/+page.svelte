<script lang="ts">
	import { apiDeleteSimCard } from '$lib/api/sim-card';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import UpdateSimCardForm from '$lib/components/non-generic/form/UpdateSimCardForm.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES.js';
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	const { data } = $props();

	let simDeleted = $state(false);
	let editMode = $state(false);

	const deleteSimCardMutation = createMutation(() => ({
		mutationFn: () => apiDeleteSimCard(data.simCard.id),
		onError: showErrorToast
	}));

	const deleteSimCard = async () => {
		if (!confirm('Permanently delete this SIM card ?')) return;

		await deleteSimCardMutation.mutateAsync();
		simDeleted = true;
	};
</script>

{#snippet field(title: string, value: string | null)}
	<div>
		<div class="opacity-70">{title}</div>
		{value}
	</div>
{/snippet}

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="sim card info"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/sim-cards'), icon: 'mdi:sim', text: 'sim cards' },
			{ text: data.simCard.ssn }
		]}
	/>

	<hr class="hr my-4" />

	{#if simDeleted}
		<DeletionSuccessMessage title="SIM card deleted" href={route('/client/tracking/sim-cards')} />
	{:else if !editMode}
		<div class="sm:card sm:preset-filled-surface-100-900 sm:p-4">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				{@render field('SSN', data.simCard.ssn)}
				{@render field('APN user', data.simCard.apnUser)}
				{@render field('APN password', data.simCard.apnPassword)}
				{@render field('PIN 1', data.simCard.pin)}
				{@render field('PIN 2', data.simCard.pin2)}
				{@render field('PUK 1', data.simCard.puk)}
				{@render field('PUK 2', data.simCard.puk2)}
				{@render field('Created At', new Date(data.simCard.createdAt).toLocaleDateString())}
			</div>

			<div class="flex space-x-4 justify-end mt-6">
				<PermissionGuard requiredPermissions={'DELETE_SIM_CARD'}>
					<button class="btn preset-filled-error-200-800" onclick={deleteSimCard}>
						<Icon icon="mdi:trash" />
						delete
					</button>
				</PermissionGuard>

				<PermissionGuard requiredPermissions={'UPDATE_SIM_CARD'}>
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

			<UpdateSimCardForm
				simCard={data.simCard}
				formSchema={data.updateSimCardForm}
				onUpdate={() => (editMode = false)}
			/>
		</div>
	{/if}
</div>
