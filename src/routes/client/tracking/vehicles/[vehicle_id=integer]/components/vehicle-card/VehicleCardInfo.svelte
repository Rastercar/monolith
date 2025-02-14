<script lang="ts">
	import { apiDeleteVehicle } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	interface Props {
		vehicle: Vehicle;
		onEditClick: () => void;
		onVehicleDelete: () => void;
	}

	let { vehicle, onEditClick, onVehicleDelete }: Props = $props();

	const mutation = createMutation(() => ({
		mutationFn: () => apiDeleteVehicle(vehicle.id)
	}));

	let year = `${vehicle.fabricationYear ?? '0000'} / ${vehicle.modelYear ?? '0000'}`;

	const deleteVehicle = async () => {
		if (!confirm('Permanently delete this vehicle ?')) return;

		await mutation.mutateAsync();
		onVehicleDelete();
	};
</script>

{#snippet field(label: string, value: string | null, classes?: string)}
	<div class={classes}>
		<div class="opacity-70">{label}:</div>
		{value ?? 'n/a'}
	</div>
{/snippet}

<div class="flex items-center mb-4">
	<span class="text-lg mr-auto">
		{vehicle.model || 'no model'} / Plate: {vehicle.plate.toLocaleUpperCase()}
	</span>

	<PermissionGuard requiredPermissions={'DELETE_VEHICLE'}>
		<button class="btn-icon preset-filled-warning-200-800" onclick={deleteVehicle}>
			<Icon icon="mdi:trash" />
		</button>
	</PermissionGuard>

	<PermissionGuard requiredPermissions={'UPDATE_VEHICLE'}>
		<button class="btn-icon ml-3 preset-filled-primary-200-800" onclick={() => onEditClick()}>
			<Icon icon="mdi:pencil" />
		</button>
	</PermissionGuard>
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
	{@render field('Brand', vehicle.brand)}
	{@render field('Year', year)}
	{@render field('Chassis', vehicle.chassisNumber)}
	{@render field('Color', vehicle.color)}

	<div>
		<div class="opacity-70">Fleet:</div>
		{#if vehicle.fleet}
			<a
				href={route(`/client/tracking/fleets/[fleet_id=integer]`, {
					fleet_id: vehicle.fleet.id.toString()
				})}
				class="font-medium text-blue-600 dark:text-blue-500 hover:underline flex items-center"
			>
				{vehicle.fleet.name}

				<Icon icon="mdi:link" class="ml-2" />
			</a>
		{:else}
			n/a
		{/if}
	</div>

	{@render field('Additional Information', vehicle.additionalInfo, 'col-span-2 md:col-span-4')}
</div>
