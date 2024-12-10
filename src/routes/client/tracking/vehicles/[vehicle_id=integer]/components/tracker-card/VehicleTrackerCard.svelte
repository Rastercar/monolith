<script lang="ts">
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import type { Tracker, createTrackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		vehicle: Vehicle;
		createTrackerForm: SuperValidated<Infer<typeof createTrackerSchema>>;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;
		updateTrackerForm: SuperValidated<Infer<typeof updateTrackerSchema>>;
	}

	let {
		vehicle = $bindable(),
		createTrackerForm,
		createSimCardForm,
		updateSimCardForm,
		updateTrackerForm
	}: Props = $props();

	let editMode = $state(false);

	const clearTracker = () => {
		vehicle.tracker = undefined;
	};

	const setTracker = (t: Tracker) => (vehicle.tracker = t);
</script>

<div class="card mt-4 flex-grow">
	<div class="align-center items-center justify-center">
		<Accordion collapsible multiple padding="px-0 py-4">
			<Accordion.Item value="tracker" panelPadding="px-0" controlClasses="my-2 bg-surface-200-800">
				{#snippet lead()}
					<div class="flex items-center">
						<Icon icon="gis:satellite" height={20} class="mr-4" />Tracker
					</div>
				{/snippet}

				{#snippet control()}
					{null}
				{/snippet}

				{#snippet panel()}
					{#if vehicle.tracker}
						{#if !editMode}
							<!-- <TrackerInfo
								tracker={vehicle.tracker}
								{createSimCardForm}
								{updateSimCardForm}
								on:edit-mode-on={() => (editMode = true)}
								on:tracker-deleted={clearTracker}
								on:tracker-removed-from-vehicle={clearTracker}
							/> -->
						{:else}
							<div class="px-4">
								<div class="flex justify-between items-center">
									<span>Updating vehicle tracker</span>

									<button
										class="btn-icon btn-icon-sm preset-filled-primary-200-800"
										onclick={() => (editMode = false)}
									>
										<Icon icon="mdi:pencil-off" />
									</button>
								</div>

								<hr class="hr my-4" />

								<!-- TODO: -->
								<!-- <UpdateTrackerForm
									{tracker}
									formSchema={updateTrackerForm}
									on:tracker-updated={(e) => {
										editMode = false;
										setTracker(e);
									}}
								/> -->
							</div>
						{/if}
					{:else}
						<div>
							<div class="flex items-center card p-4 bg-warning-200-800 mb-4">
								<Icon icon="mdi:info" class="mr-2" /> no tracker installed on the vehicle
							</div>

							<!-- <TrackerSelector
								{vehicleId}
								formSchema={createTrackerForm}
								onTrackerCreate={setTracker}
								onTrackerSelect={setTracker}
							/> -->
						</div>
					{/if}
				{/snippet}
			</Accordion.Item>
		</Accordion>
	</div>
</div>
