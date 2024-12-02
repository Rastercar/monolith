<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES.js';
	import Icon from '@iconify/svelte';

	const { data } = $props();
	const { simCard } = $derived(data);

	let simDeleted = $state(false);
	let editMode = $state(false);

	const deleteSimCard = () => {};

	// const deleteSimCardMutation = createMutation({
	// 	mutationFn: () => apiDeleteSimCard(data.simCardId),
	// 	onError: showErrorToast
	// });

	// const deleteSimCard = async () => {
	// 	if (!confirm('Permanently delete this SIM card ?')) return;
	// 	await $deleteSimCardMutation.mutateAsync();
	// 	simDeleted = true;
	// };
</script>

<div class="p-6 max-w-4xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="sim card info"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/sim-cards'), icon: 'mdi:sim', text: 'sim cards' },
			{
				href: route(`/client/tracking/sim-cards/[sim_card_id=integer]`, {
					sim_card_id: data.simCard.id.toString()
				}),
				text: data.simCard.id.toString()
			}
		]}
	/>

	<hr class="hr my-8" />

	{#if simDeleted}
		<DeletionSuccessMessage
			title="SIM card deleted successfully"
			href={route('/client/tracking/sim-cards')}
		/>
	{:else if !editMode}
		<!-- TODO: this is ugly as fuck -->
		<div class="card py-4">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-2 px-4">
				<span class="block">SSN: {simCard.ssn}</span>
				<span class="block">APN User: {simCard.apnUser}</span>
				<span class="block">APN password: {simCard.apnPassword}</span>
				<span class="block">PIN 1: {simCard.pin}</span>
				<span class="block">PIN 2: {simCard.pin2}</span>
				<span class="block">PUK 1: {simCard.puk}</span>
				<span class="block">PUK 2: {simCard.puk2}</span>
				<span class="block">
					Created At: {new Date(simCard.createdAt).toLocaleDateString()}
				</span>
			</div>

			<hr class="hr my-8" />

			<div class="flex space-x-4 justify-end">
				<PermissionGuard requiredPermissions={'DELETE_SIM_CARD'}>
					<button class="btn preset-filled-error-500" onclick={deleteSimCard}>
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
		<!-- <div class="card px-4 py-4">
			<div class="flex mb-4 justify-end">
				<button
					class="btn btn-sm variant-filled-primary"
					onclick={() => {
						editMode = false;
					}}
				>
					<Icon icon="mdi:pencil-off" class="mr-2" />
					cancel edit
				</button>
			</div>

			<UpdateSimCardForm
				{simCard}
				formSchema={data.updateSimCardForm}
				on:sim-card-updated={({ detail }) => {
					editMode = false;
					simCard = detail;
				}}
			/>
		</div> -->
	{/if}
</div>
