<script lang="ts">
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import type { Tracker, createTrackerSchema, updateTrackerSchema } from '$lib/api/tracker.schema';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import UpdateTrackerForm from '$lib/components/non-generic/form/UpdateTrackerForm.svelte';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import TrackerInfo from './TrackerInfo.svelte';
	import TrackerSelector from './TrackerSelector.svelte';

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
		vehicle.vehicleTracker = undefined;
	};

	const setTracker = (t: Tracker) => (vehicle.vehicleTracker = t);
</script>

<div class="card preset-filled-surface-100-900 sm:rounded-lg mt-4">
	<Accordion multiple>
		<Accordion.Item value="access-level" panelPadding="p-0" controlPadding="p-4">
			{#snippet control()}
				<div class="flex items-center">
					<Icon icon="gis:satellite" height={20} class="mr-4" />Tracker
				</div>
			{/snippet}

			{#snippet panel()}
				{#if vehicle.vehicleTracker}
					{#if !editMode}
						<TrackerInfo
							tracker={vehicle.vehicleTracker}
							{createSimCardForm}
							{updateSimCardForm}
							onTrackerRemoved={clearTracker}
							onTrackerDeleted={clearTracker}
							onEditModeClicked={() => (editMode = true)}
						/>
					{:else}
						<div class="p-4">
							<div class="flex justify-between items-center">
								<span>Updating vehicle tracker</span>

								<button
									class="btn-icon preset-filled-primary-200-800"
									onclick={() => (editMode = false)}
								>
									<Icon icon="mdi:pencil-off" />
								</button>
							</div>

							<hr class="hr my-4" />

							<UpdateTrackerForm
								trackerId={vehicle.vehicleTracker.id}
								initialValues={vehicle.vehicleTracker}
								formSchema={updateTrackerForm}
								onUpdated={(e) => {
									editMode = false;
									setTracker(e);
								}}
							/>
						</div>
					{/if}
				{:else}
					<div class="p-4">
						<div class="flex items-center card p-4 bg-warning-200-800 mb-4">
							<Icon icon="mdi:info" class="mr-2" /> no tracker installed on the vehicle
						</div>

						<TrackerSelector
							vehicleId={vehicle.id}
							formSchema={createTrackerForm}
							onTrackerCreated={setTracker}
							onTrackerSelected={setTracker}
						/>
					</div>
				{/if}
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
