<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';
	import CreateUserForm from './components/CreateUserForm.svelte';

	let { data } = $props();
</script>

<PageContainer>
	<PageHeader
		title="cadastrar usuário"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/usuarios'), icon: 'mdi:account-multiple', text: 'usuário' },
			{ href: route('/client/usuarios/novo'), text: 'cadastro' }
		]}
	/>

	<hr class="hr my-4" />

	<CreateUserForm
		formSchema={data.createUserForm}
		onCreate={() => {
			showSuccessToast('usuário cadastrado');
		}}
	/>
</PageContainer>
