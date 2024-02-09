<script lang="ts">
	import { apiGetVehicleById } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import Breadcrumbs from '$lib/components/breadcrumbs/BreadCrumbs.svelte';
	import Icon from '@iconify/svelte';
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import VehicleDisplayCard from './components/VehicleDisplayCard.svelte';
	import VehiclePhoto from './components/VehiclePhoto.svelte';

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

<hr class="my-4" />

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
{/if}

<div class="flex space-x-4">
	<!-- TODO: tracker display card, with editable sim card slots -->
	<div class="card p-4 mt-4 h-20 flex-grow">
		<div class="flex items-center">
			<span>Installed tracker:</span>

			<div class="h-2 w-2 bg-green-700 dark:bg-green-300 rounded-full mr-2 ml-auto" />
			online
		</div>
	</div>

	<div class="card p-4 mt-4 w-96">
		<div class="mb-4 flex items-center">
			Current location:
			<button class="btn variant-filled-primary btn-sm ml-auto">
				<Icon icon="mdi:map" class="mr-2" />
				see on map
			</button>
		</div>

		<iframe
			width="100%"
			title="map"
			frameborder="0"
			scrolling="no"
			marginheight="0"
			marginwidth="0"
			src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
		/>
	</div>
</div>
