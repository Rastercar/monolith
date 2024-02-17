<script lang="ts">
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
	import type { SuperValidated } from 'sveltekit-superforms';
	import SimCardChooser from './SimCardChooser.svelte';

	export let tracker: Tracker;

	export let createSimCardForm: SuperValidated<typeof createSimCardSchema>;

	export let updateSimCardForm: SuperValidated<typeof updateSimCardSchema>;

	let editMode = false;

	const toaster = getToaster();

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	const removeSimCardMutation = createMutation({
		mutationFn: (simCardId: number) => apiSetSimCardTracker({ newTrackerId: null, simCardId }),
		onError: toaster.error
	});

	const deleteSimCardMutation = createMutation({
		mutationFn: (simCardId: number) => apiDeleteSimCard(simCardId),
		onError: toaster.error
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

	$: ({ data: simCards } = $query);

	$: simCardAmount = simCards?.length || 0;

	// if somehow the tracker has more SIM cards than allowed, show it anyway so it can be removed
	$: slotsToShow = max(simCardAmount, supportedSimCards);
</script>

<div class="flex mb-2 justify-between items-center px-4">
	<span>SIM cards:</span>
	<span class="text-sm opacity-70">{simCards?.length || 0} / {supportedSimCards} Slots</span>
</div>

<div class="flex flex-col gap-3">
	<Accordion
		padding="px-0"
		regionControl="px-4 py-4 !rounded-none bg-surface-200-700-token"
		spacing=""
	>
		{#each { length: slotsToShow } as _, i}
			{@const simForSlot = simCards?.[i] ?? null}

			<AccordionItem>
				<svelte:fragment slot="summary">
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
				</svelte:fragment>

				<svelte:fragment slot="content">
					<div>
						{#if simForSlot}
							{#if !editMode}
								<div class="px-4 bg-surface-200-700-token py-4">
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
										<button
											class="btn btn-sm variant-filled-warning mr-3"
											on:click={() => {
												removeSimCard(simForSlot.id);
											}}
										>
											<Icon icon="mdi:close" class="mr-2" />
											remove
										</button>

										<button
											class="btn btn-sm variant-filled-error mr-auto"
											on:click={() => {
												deleteSimCard(simForSlot.id);
											}}
										>
											<Icon icon="mdi:trash" class="mr-2" />
											delete
										</button>

										<button
											class="btn btn-sm variant-filled-primary"
											on:click={() => {
												editMode = true;
											}}
										>
											<Icon icon="mdi:pencil" class="mr-2" />
											edit
										</button>
									</div>
								</div>
							{:else}
								<div class="px-4 bg-surface-200-700-token py-4">
									<div class="flex mb-4 justify-end">
										<button
											class="btn btn-sm variant-filled-primary"
											on:click={() => {
												editMode = false;
											}}
										>
											<Icon icon="mdi:pencil-off" class="mr-2" />
											edit
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
							<div class="p-4 bg-surface-200-700-token">
								<SimCardChooser
									{tracker}
									slot={i + 1}
									formSchema={createSimCardForm}
									on:sim-card-created={appendSimCard}
									on:sim-card-selected={appendSimCard}
								/>
							</div>
						{/if}
					</div>
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
