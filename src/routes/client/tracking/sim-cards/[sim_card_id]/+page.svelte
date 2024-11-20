<script lang="ts">
	import { run } from 'svelte/legacy';

	import { apiDeleteSimCard, apiGetSimCard } from '$lib/api/sim-card';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import UpdateSimCardForm from '$lib/components/non-generic/form/UpdateSimCardForm.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { createMutation, createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const toaster = getToaster();

	let simDeleted = $state(false);

	const query = createQuery({
		queryKey: ['sim-card', data.simCardId],
		placeholderData: keepPreviousData,
		queryFn: () => apiGetSimCard(data.simCardId)
	});

	const deleteSimCardMutation = createMutation({
		mutationFn: () => apiDeleteSimCard(data.simCardId),
		onError: () => toaster.error()
	});

	const deleteSimCard = async () => {
		if (!confirm('Permanently delete this SIM card ?')) return;
		await $deleteSimCardMutation.mutateAsync();
		simDeleted = true;
	};

	let editMode = $state(false);

	let simCard;
	run(() => {
		simCard = $query.data;
	});
</script>

<div class="p-6 max-w-4xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="sim card info"
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: '/client/tracking/sim-cards', icon: 'mdi:sim', text: 'sim cards' },
			{
				href: `/client/tracking/sim-cards/${data.simCardId}`,
				text: data.simCardId.toString()
			}
		]}
	/>

	<hr class="my-4" />

	{#if simDeleted}
		<DeletionSuccessMessage
			title="SIM card deleted successfully"
			href="/client/tracking/sim-cards"
		/>
	{:else if simCard}
		{#if !editMode}
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

				<hr class="my-4" />

				<div class="flex px-4">
					<PermissionGuard requiredPermissions={['DELETE_SIM_CARD']}>
						<button class="btn btn-sm variant-filled-error ml-auto mr-4" onclick={deleteSimCard}>
							<Icon icon="mdi:trash" class="mr-2" />
							delete
						</button>
					</PermissionGuard>

					<PermissionGuard requiredPermissions={['UPDATE_SIM_CARD']}>
						<button
							class="btn btn-sm variant-filled-primary"
							onclick={() => {
								editMode = true;
							}}
						>
							<Icon icon="mdi:pencil" class="mr-2" />
							edit
						</button>
					</PermissionGuard>
				</div>
			</div>
		{:else}
			<div class="card px-4 py-4">
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
			</div>
		{/if}
	{/if}
</div>
