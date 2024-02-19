<script lang="ts">
	import type { Vehicle, updateVehicleSchema } from '$lib/api/vehicle.schema';
	import { createEventDispatcher } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import UpdateVehicleForm from './UpdateVehicleForm.svelte';
	import VehicleCardInfo from './VehicleCardInfo.svelte';

	export let vehicle: Vehicle;

	export let formSchema: SuperValidated<typeof updateVehicleSchema>;

	let editMode = false;

	const dispatch = createEventDispatcher<{ 'vehicle-updated': Vehicle }>();

	const onVehicleUpdated = (e: CustomEvent<Vehicle>) => {
		vehicle = e.detail;

		// toggling the edit mode will re-render the VehicleCardInfo component
		// which will use the vehicle updated on the line above
		editMode = false;

		dispatch('vehicle-updated', e.detail);
	};
</script>

<div class="card flex-grow">
	{#if !editMode}
		<VehicleCardInfo {vehicle} on:edit-click={() => (editMode = true)} on:vehicle-deleted />
	{:else}
		<UpdateVehicleForm
			{vehicle}
			{formSchema}
			on:edit-canceled={() => (editMode = false)}
			on:vehicle-updated={onVehicleUpdated}
		/>
	{/if}
</div>
