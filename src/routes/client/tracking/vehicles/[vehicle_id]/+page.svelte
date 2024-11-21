<script lang="ts">
	import { run } from 'svelte/legacy';

	import { apiGetVehicleById } from '$lib/api/vehicle';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import VehicleLocationCard from './components/VehicleLocationCard.svelte';
	import VehiclePhoto from './components/VehiclePhoto.svelte';
	import VehicleTrackerCard from './components/tracker-card/VehicleTrackerCard.svelte';
	import VehicleDisplayCard from './components/vehicle-card/VehicleDisplayCard.svelte';

	let { data } = $props();

	const query = createQuery({
		queryKey: ['vehicle', data.vehicleId],
		queryFn: () => apiGetVehicleById(data.vehicleId)
	});

	const onVehiclePhotoUpdated = (e: CustomEvent<string | null>) => {
		if (vehicle) vehicle.photo = e.detail;
	};

	const onVehicleUpdated = (e: CustomEvent<Vehicle>) => {
		vehicle = e.detail;
	};

	let vehicleDeleted = $state(false);

	let vehicle;
	run(() => {
		vehicle = $query.data;
	});
</script>

<div class="p-6 max-w-4xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title={`vehicle: ${vehicle?.plate.toLocaleUpperCase() ?? ''}`}
		breadCrumbs={[
			{ href: '/client', icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: '/client/tracking/vehicles', icon: 'mdi:car', text: 'vehicles' },
			{ href: `/client/tracking/vehicles/${data.vehicleId}`, text: data.vehicleId.toString() }
		]}
	/>

	{#if vehicleDeleted}
		<DeletionSuccessMessage title="Vehicle deleted successfully" href="/client/tracking/vehicles" />
	{:else if vehicle}
		<VehiclePhoto
			vehicleId={vehicle.id}
			photo={vehicle.photo}
			on:photo-changed={onVehiclePhotoUpdated}
		/>

		<VehicleDisplayCard
			{vehicle}
			formSchema={data.updateVehicleForm}
			on:vehicle-updated={onVehicleUpdated}
			on:vehicle-deleted={() => (vehicleDeleted = true)}
		/>

		<VehicleTrackerCard
			vehicleId={vehicle.id}
			updateSimCardForm={data.updateSimCardForm}
			createTrackerForm={data.createTrackerForm}
			updateTrackerForm={data.updateTrackerForm}
			createSimCardForm={data.createSimCardForm}
		/>

		{#if false}
			<!-- TODO:  -->
			<VehicleLocationCard />
		{/if}
	{/if}
</div>
