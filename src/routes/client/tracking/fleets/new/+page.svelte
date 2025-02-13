<script lang="ts">
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';
	import CreateFleetForm from './components/CreateFleetForm.svelte';

	let { data } = $props();
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
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
</div>
