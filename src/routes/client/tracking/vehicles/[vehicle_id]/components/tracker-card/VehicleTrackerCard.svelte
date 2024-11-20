<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import type { Tracker, createTrackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
	import { apiGetTrackerByVehicleId } from '$lib/api/vehicle';
	import UpdateTrackerForm from '$lib/components/non-generic/form/UpdateTrackerForm.svelte';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import TrackerInfo from './TrackerInfo.svelte';
	import TrackerSelector from './TrackerSelector.svelte';





	interface Props {
		vehicleId: number;
		createTrackerForm: SuperValidated<Infer<typeof createTrackerSchema>>;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;
		updateTrackerForm: SuperValidated<Infer<typeof updateTrackerSchema>>;
	}

	let {
		vehicleId,
		createTrackerForm,
		createSimCardForm,
		updateSimCardForm,
		updateTrackerForm
	}: Props = $props();

	const query = createQuery({
		queryKey: ['vehicle', vehicleId, 'tracker'],
		queryFn: () => apiGetTrackerByVehicleId(vehicleId)
	});

	let editMode = $state(false);

	const clearTracker = () => {
		tracker = null;
	};

	const setTracker = (e: CustomEvent<Tracker>) => (tracker = e.detail);

	let tracker;
	run(() => {
		({ data: tracker } = $query);
	});
</script>

<div class="card mt-4 flex-grow">
	<div class="align-center items-center justify-center">
		<Accordion padding="px-0 py-4" regionPanel="" regionControl="px-4">
			<AccordionItem open>
				{#snippet summary()}
							
						<div class="flex items-center">
							<Icon icon="gis:satellite" height={20} class="mr-4" />Tracker
						</div>
					
							{/snippet}

				{#snippet content()}
							
						{#if tracker}
							{#if !editMode}
								<TrackerInfo
									{tracker}
									{createSimCardForm}
									{updateSimCardForm}
									on:edit-mode-on={() => (editMode = true)}
									on:tracker-deleted={clearTracker}
									on:tracker-removed-from-vehicle={clearTracker}
								/>
							{:else}
								<div class="px-4">
									<div class="flex justify-between items-center">
										<span>Updating vehicle tracker</span>

										<button
											class="btn-icon btn-icon-sm variant-filled-primary"
											onclick={() => (editMode = false)}
										>
											<Icon icon="mdi:pencil-off" />
										</button>
									</div>

									<hr class="my-4" />

									<UpdateTrackerForm
										{tracker}
										formSchema={updateTrackerForm}
										on:tracker-updated={(e) => {
											editMode = false;
											setTracker(e);
										}}
									/>
								</div>
							{/if}
						{:else}
							<div class="px-4">
								<div class="flex items-center card p-4 bg-warning-400-500-token mb-4">
									<Icon icon="mdi:info" class="mr-2" /> no tracker installed on the vehicle
								</div>

								<TrackerSelector
									{vehicleId}
									formSchema={createTrackerForm}
									on:tracker-created={setTracker}
									on:tracker-selected={setTracker}
								/>
							</div>
						{/if}
					
							{/snippet}
			</AccordionItem>
		</Accordion>
	</div>
</div>
