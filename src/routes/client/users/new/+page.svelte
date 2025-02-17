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
		title="create user"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/users'), icon: 'mdi:account-multiple', text: 'users' },
			{ href: route('/client/users/new'), text: 'new' }
		]}
	/>

	<hr class="hr my-4" />

	<CreateUserForm
		formSchema={data.createUserForm}
		onCreate={() => {
			showSuccessToast('user created');
		}}
	/>
</PageContainer>
