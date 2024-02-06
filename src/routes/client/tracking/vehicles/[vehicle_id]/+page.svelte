<script lang="ts">
	import { apiGetVehicleById } from '$lib/api/vehicle';
	import Breadcrumbs from '$lib/components/breadcrumbs/BreadCrumbs.svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import VehicleDisplayCard from './components/VehicleDisplayCard.svelte';

	export let data: PageData;

	const query = createQuery({
		queryKey: ['vehicle', data.vehicleId],
		placeholderData: keepPreviousData,
		queryFn: () => apiGetVehicleById(data.vehicleId)
	});

	$: vehicle = $query.data;
</script>

<div class="flex mb-4 items-center">
	<h1 class="h2 mr-auto">vehicle: {vehicle?.plate.toLocaleUpperCase() ?? ''}</h1>

	<div class="ml-auto">
		<Breadcrumbs
			breadCrumbs={[
				{ href: '/client', icon: 'mdi:home', text: 'home' },
				{ text: 'tracking' },
				{ href: '/client/tracking/vehicles', icon: 'mdi:car', text: 'vehicles' },
				{ href: `/client/tracking/vehicles/${data.vehicleId}`, text: data.vehicleId.toString() }
			]}
		/>
	</div>
</div>

<hr class="my-4" />

{#if vehicle}
	<!-- TODO: make me editable  -->
	<VehicleDisplayCard {vehicle} formSchema={data.updateVehicleForm} />
{/if}

<!-- TODO: tracker display card, with editable sim card slots -->
