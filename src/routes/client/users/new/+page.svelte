<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import CreateUserForm from './components/CreateUserForm.svelte';

	let { data } = $props();
</script>

<PermissionGuard requiredPermissions={['CREATE_USER']}>
	<div class="p-6 max-w-4xl mx-auto">
		<TitleAndBreadCrumbsPageHeader
			title="create user"
			breadCrumbs={[
				{ href: '/client', icon: 'mdi:home', text: 'home' },
				{ href: '/client/users', icon: 'mdi:account-multiple', text: 'users' },
				{ href: '/client/users/new', text: 'new' }
			]}
		/>

		<hr class="my-4" />

		<CreateUserForm formSchema={data.createUserForm} />
	</div>
</PermissionGuard>
