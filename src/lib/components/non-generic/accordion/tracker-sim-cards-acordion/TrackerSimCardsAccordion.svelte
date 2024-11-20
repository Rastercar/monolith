<script lang="ts">
	import { run } from 'svelte/legacy';

	import { apiDeleteSimCard, apiSetSimCardTracker } from '$lib/api/sim-card';
	import type { SimCard, createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiGetTrackerSimCards } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import UpdateSimCardForm from '$lib/components/non-generic/form/UpdateSimCardForm.svelte';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SimCardChooser from './SimCardChooser.svelte';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';



	interface Props {
		tracker: Tracker;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;
	}

	let { tracker, createSimCardForm, updateSimCardForm }: Props = $props();

	let editMode = $state(false);

	const toaster = getToaster();

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	const removeSimCardMutation = createMutation({
		mutationFn: (simCardId: number) => apiSetSimCardTracker({ newTrackerId: null, simCardId }),
		onError: () => toaster.error()
	});

	const deleteSimCardMutation = createMutation({
		mutationFn: (simCardId: number) => apiDeleteSimCard(simCardId),
		onError: () => toaster.error()
	});

	const query = createQuery({
		queryKey: ['tracker', tracker.id, 'sim-cards'],
		queryFn: () => apiGetTrackerSimCards(tracker.id)
	});

	const removeSimCardFromDisplay = (id: number) => {
		simCards = (simCards ?? []).filter((sim) => sim.id !== id);
	};

	const removeSimCard = async (id: number) => {
		if (!confirm('Remove the SIM card from the tracker ?')) return;

		await $removeSimCardMutation.mutateAsync(id);
		removeSimCardFromDisplay(id);
	};

	const deleteSimCard = async (id: number) => {
		if (!confirm('Permanently delete this SIM card ?')) return;

		await $deleteSimCardMutation.mutateAsync(id);
		removeSimCardFromDisplay(id);
	};

	const appendSimCard = (e: CustomEvent<SimCard>) => {
		simCards = [...(simCards ?? []), e.detail];
	};

	const max = (a: number, b: number) => (a < b ? b : a);

	let simCards;
	run(() => {
		({ data: simCards } = $query);
	});

	let simCardAmount = $derived(simCards?.length || 0);

	// if somehow the tracker has more SIM cards than allowed, show it anyway so it can be removed
	let slotsToShow = $derived(max(simCardAmount, supportedSimCards));
</script>

<div class="flex mb-2 justify-between items-center px-4">
	<span>SIM cards:</span>
	<span class="text-sm opacity-70">{simCards?.length || 0} / {supportedSimCards} Slots</span>
</div>

<Accordion padding="px-0" regionControl="px-4 py-4 !rounded-none" spacing="">
	{#each { length: slotsToShow } as _, i}
		{@const simForSlot = simCards?.[i] ?? null}

		<AccordionItem>
			{#snippet summary()}
					
					<div class="flex items-center">
						<div class="flex items-center">
							<Icon icon={simForSlot ? 'mdi:sim' : 'mdi:sim-off'} height={32} class="mr-4" />

							{#if simForSlot}
								<div class="text-sm">
									<span class="block">{simForSlot.phoneNumber}</span>
									<span class="block">{simForSlot.apnAddress}</span>
								</div>
							{:else}
								Empty slot
							{/if}
						</div>

						<span class="text-xs ml-auto opacity-75">SLOT {i + 1}</span>
					</div>
				
					{/snippet}

			{#snippet content()}
					
					<div>
						{#if simForSlot}
							{#if !editMode}
								<div class="px-4 py-4">
									<div class="grid grid-cols-2 md:grid-cols-4 mb-4 gap-2 text-sm">
										<span class="block">SSN: {simForSlot.ssn}</span>
										<span class="block">APN User: {simForSlot.apnUser}</span>
										<span class="block">APN password: {simForSlot.apnPassword}</span>
										<span class="block">PIN 1{simForSlot.pin}</span>
										<span class="block">PIN 2{simForSlot.pin2}</span>
										<span class="block">PUK 1{simForSlot.puk}</span>
										<span class="block">PUK 2{simForSlot.puk2}</span>
										<span class="block">
											Created At:{new Date(simForSlot.createdAt).toLocaleDateString()}
										</span>
									</div>

									<div class="flex">
										<PermissionGuard requiredPermissions={['UPDATE_TRACKER']}>
											<button
												class="btn btn-sm variant-filled-warning mr-3"
												onclick={() => {
												removeSimCard(simForSlot.id);
											}}
											>
												<Icon icon="mdi:close" class="mr-2" />
												remove
											</button>
										</PermissionGuard>

										<PermissionGuard requiredPermissions={['DELETE_SIM_CARD']}>
											<button
												class="btn btn-sm variant-filled-error"
												onclick={() => {
												deleteSimCard(simForSlot.id);
											}}
											>
												<Icon icon="mdi:trash" class="mr-2" />
												delete
											</button>
										</PermissionGuard>

										<PermissionGuard requiredPermissions={['UPDATE_SIM_CARD']}>
											<button
												class="btn btn-sm variant-filled-primary ml-auto"
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
								<div class="px-4 py-4">
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
										simCard={simForSlot}
										formSchema={updateSimCardForm}
										on:sim-card-updated={({ detail }) => {
											editMode = false;
											if (simCards) simCards[i] = detail;
										}}
									/>
								</div>
							{/if}
						{:else}
							<div class="p-4">
								<PermissionGuard requiredPermissions={['CREATE_SIM_CARD', 'UPDATE_SIM_CARD']}>
									<SimCardChooser
										{tracker}
										slotNumber={i + 1}
										formSchema={createSimCardForm}
										on:sim-card-created={appendSimCard}
										on:sim-card-selected={appendSimCard}
									/>

									{#snippet denied()}
																<span  class="text-error-400-500-token">
											you lack the permissions to set or create a tracker sim card
										</span>
															{/snippet}
								</PermissionGuard>
							</div>
						{/if}
					</div>
				
					{/snippet}
		</AccordionItem>
	{/each}
</Accordion>
