<script lang="ts">
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES';
	import FleetInfoSection from './components/FleetInfoSection.svelte';
	import FleetVehiclesSection from './components/FleetVehiclesSection.svelte';

	const { data } = $props();

	let fleetDeleted = $state(false);
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="fleet info"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/fleets'), icon: 'mdi:vehicle-multiple', text: 'fleets' },
			{ text: data.fleet.name }
		]}
	/>

	<hr class="hr my-4" />

	{#if fleetDeleted}
		<DeletionSuccessMessage title="Fleet deleted" href={route('/client/tracking/fleets')} />
	{:else}
		<FleetInfoSection
			fleet={data.fleet}
			updateFleetForm={data.updateFleetForm}
			onFleetDeleted={() => (fleetDeleted = true)}
		/>

		<FleetVehiclesSection vehicles={data.fleet.vehicles} />
	{/if}
</div>
