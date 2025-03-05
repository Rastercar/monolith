<script lang="ts">
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	interface Props {
		vehicles?: Vehicle[];
	}

	const { vehicles }: Props = $props();

	let plateFilter = $state('');

	let filteredVehicles = $derived(
		(vehicles ?? []).filter((v) => v.plate.toLocaleLowerCase().includes(plateFilter))
	);
</script>

<h3 class="h3 mb-2 mt-8 flex items-center justify-between">
	Veículos

	{#if vehicles?.length}
		({vehicles.length})

		{#if filteredVehicles.length !== vehicles.length}
			<span>
				{vehicles.length - filteredVehicles.length} filtrados
			</span>
		{/if}
	{/if}
</h3>

{#if vehicles?.length}
	<input bind:value={plateFilter} class="input mb-4" type="text" placeholder="Search by plate" />

	<ul class="space-y-4">
		{#each filteredVehicles as v}
			<li class="card p-4 preset-filled-surface-100-900">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<div class="opacity-70">Placa:</div>
						<a
							class="flex items-center text-blue-600 dark:text-blue-500 hover:underline"
							href={route('/client/rastreamento/veiculos/[vehicle_id=integer]', {
								vehicle_id: v.id.toString()
							})}
						>
							{v.plate.toLocaleLowerCase()}
							<Icon icon="mdi:link" class="ml-2" />
						</a>
					</div>

					{@render field('Modelo', v.model || 'no model')}
					{@render field('Marca', v.brand)}
					{@render field('Ano', `${v.fabricationYear ?? '0000'} / ${v.modelYear ?? '0000'}`)}
					{@render field('Chassi', v.chassisNumber)}
					{@render field('Cor', v.color)}
					{@render field('Informação Adicional', v.additionalInfo, 'col-span-2 md:col-span-4')}
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<p>Essa frota não tem veículos</p>
{/if}

{#snippet field(label: string, value: string | null, classes?: string)}
	<div class={classes}>
		<div class="opacity-70">{label}:</div>
		<span>{value ?? 'n/a'}</span>
	</div>
{/snippet}
