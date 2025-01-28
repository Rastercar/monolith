<script lang="ts">
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import CreateSimCardForm from '$lib/components/non-generic/form/CreateSimCardForm.svelte';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';

	let { data } = $props();
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="create sim card"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/sim-cards'), icon: 'mdi:sim', text: 'sim cards' },
			{ href: route('/client/tracking/sim-cards/new'), text: 'new' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<CreateSimCardForm
		formSchema={data.createSimCardForm}
		onCreate={() => showSuccessToast('sim card created')}
	/>
</div>
