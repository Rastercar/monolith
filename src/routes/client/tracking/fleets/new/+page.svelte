<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';
	import CreateFleetForm from './components/CreateFleetForm.svelte';

	let { data } = $props();
</script>

<PageContainer>
	<PageHeader
		title="create fleet"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/fleets'), icon: 'mdi:car-multiple', text: 'fleets' },
			{ href: route('/client/tracking/fleets/new'), text: 'new' }
		]}
	/>

	<hr class="hr my-4" />

	<CreateFleetForm
		formSchema={data.createFleetForm}
		onCreate={() => {
			showSuccessToast('fleet created');
		}}
	/>
</PageContainer>
