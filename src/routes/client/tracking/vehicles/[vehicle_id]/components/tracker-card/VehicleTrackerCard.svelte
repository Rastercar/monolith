<script lang="ts">
	import type { createTrackerSchema } from '$lib/api/tracker.schema';
	import { apiGetTrackerByVehicleId } from '$lib/api/vehicle';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { createQuery } from '@tanstack/svelte-query';
	import type { SuperValidated } from 'sveltekit-superforms';
	import TrackerInfo from './TrackerInfo.svelte';
	import TrackerSelector from './TrackerSelector.svelte';

	export let vehicleId: number;

	export let createTrackerForm: SuperValidated<typeof createTrackerSchema>;

	const query = createQuery({
		queryKey: ['vehicle', vehicleId, 'tracker'],
		queryFn: () => apiGetTrackerByVehicleId(vehicleId)
	});

	let editMode = false;

	const clearTracker = () => {
		tracker = null;
	};

	$: ({ data: tracker } = $query);
</script>

<div class="card mt-4 flex-grow">
	<div class="align-center items-center justify-center">
		<Accordion padding="px-4 py-4">
			<AccordionItem open>
				<svelte:fragment slot="summary">
					<div class="flex items-center">
						<Icon icon="gis:satellite" height={20} class="mr-4" />Tracker
					</div>
				</svelte:fragment>

				<svelte:fragment slot="content">
					{#if tracker}
						<!-- this div is not useless -->
						<div>
							{#if !editMode}
								<TrackerInfo
									{tracker}
									on:edit-mode-on={() => (editMode = true)}
									on:tracker-deleted={clearTracker}
									on:tracker-removed-from-vehicle={clearTracker}
								/>
							{:else}
								<button on:click={() => (editMode = false)}>
									<!-- TODO:  -->
									edit form here !
								</button>
							{/if}
						</div>
					{:else}
						<div class="flex items-center card p-4 bg-warning-400-500-token mb-4">
							<Icon icon="mdi:info" class="mr-2" /> no tracker installed on the vehicle
						</div>

						<TrackerSelector
							{vehicleId}
							formSchema={createTrackerForm}
							on:tracker-created={({ detail: createdTracker }) => {
								tracker = createdTracker;
							}}
							on:tracker-selected={({ detail: selectedTracker }) => {
								tracker = selectedTracker;
							}}
						/>{/if}
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
</div>
