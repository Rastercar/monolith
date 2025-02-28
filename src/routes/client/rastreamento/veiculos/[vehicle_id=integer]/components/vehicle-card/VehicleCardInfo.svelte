<script lang="ts">
	import { apiDeleteVehicleByIdMutation } from '$lib/api/vehicle.queries';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import LoadableIcon from '$lib/components/icon/LoadableIcon.svelte';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	interface Props {
		vehicle: Vehicle;
		onEditClick: VoidFunction;
		onVehicleDelete: VoidFunction;
	}

	let { vehicle, onEditClick, onVehicleDelete }: Props = $props();

	const mutation = apiDeleteVehicleByIdMutation();

	let year = `${vehicle.fabricationYear ?? '0000'} / ${vehicle.modelYear ?? '0000'}`;

	const deleteVehicle = async () => {
		if (!confirm('Permanentemente deletar esse veículo ?')) return;

		await mutation.mutateAsync(vehicle.id);
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
		{vehicle.model || 'sem modelo'} / Plate: {vehicle.plate.toLocaleUpperCase()}
	</span>

	<PermissionGuard requiredPermissions={'DELETE_VEHICLE'}>
		<button
			class="btn-icon preset-filled-warning-200-800"
			onclick={deleteVehicle}
			disabled={mutation.isPending}
		>
			<LoadableIcon icon="mdi:trash" isLoading={mutation.isPending} />
		</button>
	</PermissionGuard>

	<PermissionGuard requiredPermissions={'UPDATE_VEHICLE'}>
		<button class="btn-icon ml-3 preset-filled-primary-200-800" onclick={() => onEditClick()}>
			<Icon icon="mdi:pencil" />
		</button>
	</PermissionGuard>
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
	{@render field('Marca', vehicle.brand)}
	{@render field('Ano', year)}
	{@render field('Chassi', vehicle.chassisNumber)}
	{@render field('Cor', vehicle.color)}

	<div>
		<div class="opacity-70">Frota:</div>
		{#if vehicle.fleet}
			<a
				href={route(`/client/rastreamento/frotas/[fleet_id=integer]`, {
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

	{@render field('Informação Adicional', vehicle.additionalInfo, 'col-span-2 md:col-span-4')}
</div>
