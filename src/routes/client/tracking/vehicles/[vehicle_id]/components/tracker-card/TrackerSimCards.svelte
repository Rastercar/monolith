<script lang="ts">
	import { apiDeleteSimCard, apiSetSimCardTracker } from '$lib/api/sim-card';
	import type { createSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiGetTrackerSimCards } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import type { SuperValidated } from 'sveltekit-superforms';
	import SimCardChooser from '../../../../quick-track/components/set-sim-card-step/SimCardChooser.svelte';

	export let tracker: Tracker;

	export let createSimCardForm: SuperValidated<typeof createSimCardSchema>;

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

	const removeSimCard = async (id: number) => {
		if (!confirm('Remove the SIM card from the tracker ?')) return;

		await $removeSimCardMutation.mutateAsync(id);
		simCards = (simCards ?? []).filter((sim) => sim.id !== id);
	};

	const deleteSimCard = async (id: number) => {
		if (!confirm('Permanently delete this SIM card ?')) return;

		await $deleteSimCardMutation.mutateAsync(id);
		simCards = (simCards ?? []).filter((sim) => sim.id !== id);
	};

	$: ({ data: simCards } = $query);

	$: emptySlots = supportedSimCards - (simCards?.length || 0);
</script>

<div class="flex mb-2 justify-between items-center px-4">
	<span>SIM cards:</span>
	<span class="text-sm opacity-70">{simCards?.length || 0} / {supportedSimCards} Slots</span>
</div>

<div class="flex flex-col gap-3">
	{#if (simCards ?? []).length > 0}
		<Accordion padding="py-2 px-4">
			{#each simCards ?? [] as simCard}
				<AccordionItem>
					<svelte:fragment slot="summary">
						<div class="flex">
							<div class="flex items-center">
								<Icon icon="mdi:sim" height={32} class="mr-4" />
								<div class="text-sm">
									<span class="block">{simCard.phoneNumber}</span>
									<span class="block">{simCard.apnAddress}</span>
								</div>
							</div>
						</div>
					</svelte:fragment>

					<svelte:fragment slot="content">
						<div>
							{#if !editMode}
								<div class="grid grid-cols-2 md:grid-cols-4 mb-4 mt-2 gap-2 text-sm">
									<span class="block">SSN: {simCard.ssn}</span>
									<span class="block">APN User: {simCard.apnUser}</span>
									<span class="block">APN password: {simCard.apnPassword}</span>
									<span class="block">PIN 1{simCard.pin}</span>
									<span class="block">PIN 2{simCard.pin2}</span>
									<span class="block">PUK 1{simCard.puk}</span>
									<span class="block">PUK 2{simCard.puk2}</span>
									<span class="block">
										Created At:{new Date(simCard.createdAt).toLocaleDateString()}
									</span>
								</div>

								<div class="flex mb-4">
									<button
										class="btn btn-sm variant-filled-warning mr-3"
										on:click={() => {
											removeSimCard(simCard.id);
										}}
									>
										<Icon icon="mdi:close" class="mr-2" />
										remove
									</button>

									<button
										class="btn btn-sm variant-filled-error mr-auto"
										on:click={() => {
											deleteSimCard(simCard.id);
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
							{:else}
								<!-- TODO: formulario de edição de sim card -->
								<button
									class="btn btn-sm variant-filled-primary"
									on:click={() => {
										editMode = false;
									}}
								>
									<Icon icon="mdi:pencil-off" class="mr-2" />
									edit
								</button>
							{/if}
						</div>
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	{/if}

	{#each { length: emptySlots } as _, i}
		<div class="px-4">
			<!-- TODO: move the sim card chooser and its sub components to the global components folder -->
			<SimCardChooser {tracker} slot={i + 1} formSchema={createSimCardForm} />
		</div>
	{/each}
</div>
