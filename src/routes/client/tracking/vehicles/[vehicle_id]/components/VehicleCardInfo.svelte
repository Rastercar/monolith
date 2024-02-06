<script lang="ts">
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import VehicleCardField from './VehicleCardField.svelte';

	export let vehicle: Vehicle;

	const dispatch = createEventDispatcher<{ 'edit-click': void }>();

	let year = `${vehicle.fabricationYear ?? '0000'} / ${vehicle.modelYear ?? '0000'}`;
</script>

<div class="p-4 flex items-center">
	<span class="text-lg">
		{vehicle.brand || 'no brand'} / {vehicle.model || 'no model'} / Plate: {vehicle.plate.toLocaleUpperCase()}
	</span>

	<button
		class="btn-icon btn-icon-sm ml-auto variant-filled-primary"
		on:click={() => dispatch('edit-click')}
	>
		<Icon icon="mdi:pencil" />
	</button>
</div>

<hr />

<div class="p-4 grid grid-cols-2 md:grid-cols-3">
	<VehicleCardField label="Year">{year}</VehicleCardField>
	<VehicleCardField label="Chassis">{vehicle.chassisNumber ?? 'n/a'}</VehicleCardField>
	<VehicleCardField label="Color">{vehicle.color ?? 'n/a'}</VehicleCardField>
	<VehicleCardField label="Additional Information" class="col-span-2 md:col-span-3 mt-6">
		{vehicle.additionalInfo ?? 'n/a'}
	</VehicleCardField>
</div>
