<script lang="ts">
	import { apiGetUserById } from '$lib/api/user';
	import { createQuery } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import SessionsSection from './components/SessionsSection.svelte';
	import UserSection from './components/UserSection.svelte';

	export let data: PageData;

	const userQuery = createQuery({
		queryFn: () => apiGetUserById(data.userId)
	});

	$: user = $userQuery.data;
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
	{#if user}
		<UserSection {user} />

		<SessionsSection userId={user.id} />
	{/if}
</div>
