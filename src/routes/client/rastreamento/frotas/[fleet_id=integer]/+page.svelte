<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES';
	import FleetInfoSection from './components/FleetInfoSection.svelte';
	import FleetVehiclesSection from './components/FleetVehiclesSection.svelte';

	const { data } = $props();

	let fleetDeleted = $state(false);
</script>

<PageContainer>
	<PageHeader
		title="frota"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'rastreamento' },
			{ href: route('/client/rastreamento/frotas'), icon: 'mdi:vehicle-multiple', text: 'frotas' },
			{ text: data.fleet.name }
		]}
	/>

	<hr class="hr my-4" />

	{#if fleetDeleted}
		<DeletionSuccessMessage title="Frota deletada" href={route('/client/rastreamento/frotas')} />
	{:else}
		<FleetInfoSection
			fleet={data.fleet}
			updateFleetForm={data.updateFleetForm}
			onFleetDeleted={() => (fleetDeleted = true)}
		/>

		<FleetVehiclesSection vehicles={data.fleet.vehicles} />
	{/if}
</PageContainer>
