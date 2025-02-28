<script lang="ts">
	import { route } from '$lib/ROUTES';
	import type { Vehicle } from '$lib/api/vehicle.schema';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import VehicleLocationCard from './components/VehicleLocationCard.svelte';
	import VehiclePhoto from './components/VehiclePhoto.svelte';
	import VehicleTrackerCard from './components/tracker-card/VehicleTrackerCard.svelte';
	import VehicleDisplayCard from './components/vehicle-card/VehicleDisplayCard.svelte';

	let { data } = $props();

	let vehicle = $state(data.vehicle);
	let vehicleDeleted = $state(false);

	const onVehiclePhotoUpdated = (photo: string | null) => {
		vehicle.photo = photo;
	};

	const onVehicleUpdated = (v: Vehicle) => {
		vehicle = { ...vehicle, ...v };
	};
</script>

<PageContainer>
	<PageHeader
		title="veículo"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'rastreamento' },
			{ href: route('/client/tracking/vehicles'), icon: 'mdi:car', text: 'veículos' },
			{
				href: route('/client/tracking/vehicles/[vehicle_id=integer]', {
					vehicle_id: vehicle.id.toString()
				}),
				text: `${vehicle.plate.toLocaleUpperCase() ?? vehicle.id}`
			}
		]}
	/>

	<hr class="hr my-4" />

	{#if vehicleDeleted}
		<DeletionSuccessMessage title="Vehicle deleted" href={route('/client/tracking/vehicles')} />
	{:else if vehicle}
		<VehiclePhoto
			photo={vehicle.photo}
			vehicleId={vehicle.id}
			onPhotoChange={onVehiclePhotoUpdated}
		/>

		<VehicleDisplayCard
			bind:vehicle
			formSchema={data.updateVehicleForm}
			onVehicleUpdate={onVehicleUpdated}
			onVehicleDelete={() => (vehicleDeleted = true)}
		/>

		<VehicleTrackerCard
			bind:vehicle
			updateSimCardForm={data.updateSimCardForm}
			createTrackerForm={data.createTrackerForm}
			updateTrackerForm={data.updateTrackerForm}
			createSimCardForm={data.createSimCardForm}
		/>

		<VehicleLocationCard {vehicle} />
	{/if}
</PageContainer>
