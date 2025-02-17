<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';
	import CreateVehicleForm from './components/CreateVehicleForm.svelte';

	let { data } = $props();
</script>

<PageContainer>
	<PageHeader
		title="create vehicle"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/vehicles'), icon: 'mdi:car', text: 'vehicles' },
			{ href: route('/client/tracking/vehicles/new'), text: 'new' }
		]}
	/>

	<hr class="hr my-4" />

	<CreateVehicleForm
		formSchema={data.createVehicleForm}
		onCreate={() => {
			showSuccessToast('vehicle created');
		}}
	/>
</PageContainer>
