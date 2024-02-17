<script lang="ts">
	import { apiGetVehicleById } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Breadcrumbs from '$lib/components/breadcrumbs/BreadCrumbs.svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import VehicleLocationCard from './components/VehicleLocationCard.svelte';
	import VehiclePhoto from './components/VehiclePhoto.svelte';
	import VehicleTrackerCard from './components/tracker-card/VehicleTrackerCard.svelte';
	import VehicleDisplayCard from './components/vehicle-card/VehicleDisplayCard.svelte';

	export let data: PageData;

	const query = createQuery({
		queryKey: ['vehicle', data.vehicleId],
		placeholderData: keepPreviousData,
		queryFn: () => apiGetVehicleById(data.vehicleId)
	});

	const onVehiclePhotoUpdated = (e: CustomEvent<string | null>) => {
		if (vehicle) vehicle.photo = e.detail;
	};

	const onVehicleUpdated = (e: CustomEvent<Vehicle>) => {
		vehicle = e.detail;
	};

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

{#if vehicle}
	<VehiclePhoto
		vehicleId={vehicle.id}
		photo={vehicle.photo}
		on:photo-changed={onVehiclePhotoUpdated}
	/>

	<VehicleDisplayCard
		{vehicle}
		formSchema={data.updateVehicleForm}
		on:vehicle-updated={onVehicleUpdated}
	/>

	<VehicleTrackerCard
		vehicleId={vehicle.id}
		updateSimCardForm={data.updateSimCardForm}
		createTrackerForm={data.createTrackerForm}
		updateTrackerForm={data.updateTrackerForm}
		createSimCardForm={data.createSimCardForm}
	/>

	<VehicleLocationCard />
{/if}
