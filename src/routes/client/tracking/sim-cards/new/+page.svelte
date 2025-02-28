<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import CreateSimCardForm from '$lib/components/non-generic/form/CreateSimCardForm.svelte';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';

	let { data } = $props();
</script>

<PageContainer>
	<PageHeader
		title="cadastrar cartão SIM"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'rastreamento' },
			{ href: route('/client/tracking/sim-cards'), icon: 'mdi:sim', text: 'cartões SIM' },
			{ href: route('/client/tracking/sim-cards/new'), text: 'cadastro' }
		]}
	/>

	<hr class="hr mt-4 mb-8" />

	<CreateSimCardForm
		formSchema={data.createSimCardForm}
		onCreate={() => showSuccessToast('cartão SIM cadastrado')}
	/>
</PageContainer>
