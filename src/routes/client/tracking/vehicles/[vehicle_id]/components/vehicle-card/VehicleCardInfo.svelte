<script lang="ts">
	import { apiDeleteVehicle } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import VehicleCardField from './VehicleCardField.svelte';

	export let vehicle: Vehicle;

	const dispatch = createEventDispatcher<{
		'edit-click': void;
		'vehicle-deleted': void;
	}>();

	const mutation = createMutation({ mutationFn: () => apiDeleteVehicle(vehicle.id) });

	let year = `${vehicle.fabricationYear ?? '0000'} / ${vehicle.modelYear ?? '0000'}`;

	const deleteVehicle = async () => {
		if (!confirm('Permanently delete this vehicle ?')) return;

		await $mutation.mutateAsync();
		dispatch('vehicle-deleted');
	};
</script>

<div class="p-4 flex items-center">
	<span class="text-lg">
		{vehicle.model || 'no model'} / Plate: {vehicle.plate.toLocaleUpperCase()}
	</span>

	<button class="btn-icon btn-icon-sm ml-auto variant-filled-error" on:click={deleteVehicle}>
		<Icon icon="mdi:trash" />
	</button>

	<button
		class="btn-icon btn-icon-sm ml-3 variant-filled-primary"
		on:click={() => dispatch('edit-click')}
	>
		<Icon icon="mdi:pencil" />
	</button>
</div>

<hr />

<div class="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
	<VehicleCardField label="Brand">{vehicle.brand || 'n/a'}</VehicleCardField>
	<VehicleCardField label="Year">{year}</VehicleCardField>
	<VehicleCardField label="Chassis">{vehicle.chassisNumber ?? 'n/a'}</VehicleCardField>
	<VehicleCardField label="Color">{vehicle.color ?? 'n/a'}</VehicleCardField>

	<VehicleCardField label="Additional Information" class="col-span-2 md:col-span-4">
		{vehicle.additionalInfo ?? 'n/a'}
	</VehicleCardField>
</div>
