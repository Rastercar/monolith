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
		title="cadastrar veículo"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'rastreamento' },
			{ href: route('/client/tracking/vehicles'), icon: 'mdi:car', text: 'veículos' },
			{ href: route('/client/tracking/vehicles/new'), text: 'cadastro' }
		]}
	/>

	<hr class="hr my-4" />

	<CreateVehicleForm
		formSchema={data.createVehicleForm}
		onCreate={() => {
			showSuccessToast('veículo cadastrado');
		}}
	/>
</PageContainer>
