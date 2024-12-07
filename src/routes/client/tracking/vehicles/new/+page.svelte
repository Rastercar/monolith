<script lang="ts">
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';
	import CreateVehicleForm from './components/CreateVehicleForm.svelte';

	let { data } = $props();
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
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
</div>
