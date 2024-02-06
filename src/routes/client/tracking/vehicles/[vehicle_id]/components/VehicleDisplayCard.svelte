<script lang="ts">
	import type { Vehicle, updateVehicleSchema } from '$lib/api/vehicle.schema';
	import { cloudFrontUrl } from '$lib/utils/url';
	import type { SuperValidated } from 'sveltekit-superforms';
	import UpdateVehicleForm from './UpdateVehicleForm.svelte';
	import VehicleCardInfo from './VehicleCardInfo.svelte';

	export let vehicle: Vehicle;

	export let formSchema: SuperValidated<typeof updateVehicleSchema>;

	let editMode = false;
</script>

<!-- TODO: flex wrap -->
<img
	class="h-60 w-full rounded-lg object-cover mb-4"
	src={vehicle?.photo ? cloudFrontUrl(vehicle?.photo) : '/img/no-pic-placeholder.png'}
	alt="vehicle"
/>

<div class="card flex-grow">
	{#if !editMode}
		<VehicleCardInfo {vehicle} on:edit-click={() => (editMode = true)} />
	{:else}
		<UpdateVehicleForm {vehicle} {formSchema} on:edit-canceled={() => (editMode = false)} />
	{/if}
</div>
