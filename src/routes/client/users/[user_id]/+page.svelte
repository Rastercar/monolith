<script lang="ts">
	import { apiGetUserById } from '$lib/api/user';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import AccessLevelSection from './components/AccessLevelSection.svelte';
	import SessionsSection from './components/SessionsSection.svelte';
	import UserSection from './components/UserSection.svelte';

	let { data } = $props();

	let userDeleted = $state(false);

	const userQuery = createQuery({
		queryKey: ['user', data.userId],
		queryFn: () => apiGetUserById(data.userId)
	});

	let user = $derived($userQuery.data);
</script>

<div class="p-6 max-w-5xl mx-auto space-y-6">
	{#if userDeleted}
		<DeletionSuccessMessage title="User deleted successfully" href="/client/users" />
	{:else if user}
		<UserSection
			{user}
			on:user-deleted={() => {
				userDeleted = true;
			}}
		/>

		<AccessLevelSection userId={data.userId} />

		<PermissionGuard requiredPermissions={['LIST_USER_SESSIONS']}>
			<SessionsSection userId={user.id} />
		</PermissionGuard>
	{/if}
</div>
