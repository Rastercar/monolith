<script lang="ts">
	import { apiGetUserById } from '$lib/api/user';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import AccessLevelSection from './components/AccessLevelSection.svelte';
	import SessionsSection from './components/SessionsSection.svelte';
	import UserSection from './components/UserSection.svelte';

	export let data: PageData;

	const userQuery = createQuery({
		queryKey: ['user', data.userId],
		queryFn: () => apiGetUserById(data.userId)
	});

	$: user = $userQuery.data;
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	{#if user}
		<UserSection {user} />

		<AccessLevelSection userId={data.userId} />

		<PermissionGuard requiredPermissions={['LIST_USER_SESSIONS']}>
			<SessionsSection userId={user.id} />
		</PermissionGuard>
	{/if}
</div>
