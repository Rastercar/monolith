<!-- @migration-task Error while migrating Svelte code: 'default' is a reserved word in JavaScript and cannot be used here -->
<script lang="ts">
	import { apiSetTrackerVehicle } from '$lib/api/tracker';
	import type { Tracker, createTrackerSchema } from '$lib/api/tracker.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import CreateTrackerForm from '$lib/components/non-generic/form/CreateTrackerForm.svelte';
	import SelectTrackerDataTable from '$lib/components/non-generic/table/SelectTrackerDataTable.svelte';
	import OptionToggler from '$lib/components/toggler/OptionToggler.svelte';
	import { getToaster } from '$lib/store/toaster';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	let selectedTrackerForm: 'new-tracker' | 'existing-tracker' = $state('new-tracker');

	interface Props {
		/**
		 * ID of the vehicle to be associated with the tracker to be created or selected
		 */
		vehicleId: number;
		formSchema: SuperValidated<Infer<typeof createTrackerSchema>>;
	}

	let { vehicleId, formSchema }: Props = $props();

	const toaster = getToaster();

	const selectTrackerMutation = createMutation({
		mutationFn: (vehicleTrackerId: number) => apiSetTrackerVehicle({ vehicleId, vehicleTrackerId }),
		onError: () => toaster.error()
	});

	const associateTrackerToVehicle = (tracker: Tracker | null) => {
		if (!tracker) return;

		$selectTrackerMutation.mutateAsync(tracker.id).then(() => {
			dispatch('tracker-selected', tracker);
		});
	};

	const dispatch = createEventDispatcher<{ 'tracker-selected': Tracker }>();
</script>

<OptionToggler
	bind:selectedOption={selectedTrackerForm}
	additionalClasses="mb-4"
	options={[
		{
			value: 'new-tracker',
			label: 'create tracker',
			classes: 'btn btn-sm w-full variant-filled-primary'
		},
		{
			value: 'existing-tracker',
			label: 'use existing tracker',
			classes: 'btn btn-sm w-full variant-filled-secondary'
		}
	]}
/>

{#if selectedTrackerForm === 'existing-tracker'}
	<SelectTrackerDataTable>
		<!-- @migration-task: migrate this slot by hand, `bottom-right` is an invalid identifier -->
		<div slot="bottom-right" let:isLoading let:selectedTracker>
			<LoadableButton
				isLoading={$selectTrackerMutation.isPending}
				class="btn variant-filled-primary mt-4"
				disabled={!selectedTracker || isLoading}
				on:click={() => associateTrackerToVehicle(selectedTracker)}
			>
				use selected tracker
			</LoadableButton>
		</div>
	</SelectTrackerDataTable>
{:else}
	<CreateTrackerForm {formSchema} vehicleIdToAssociate={vehicleId} on:tracker-created>
		{#snippet xddefault({ isLoading, canSubmit, createTracker })}
			<div class="flex justify-end">
				<LoadableButton
					{isLoading}
					disabled={!canSubmit}
					class="btn variant-filled-primary"
					on:click={createTracker}
				>
					create tracker
				</LoadableButton>
			</div>
		{/snippet}
	</CreateTrackerForm>
{/if}
