<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES';
	import AccessLevelSection from './components/AccessLevelSection.svelte';
	import SessionsSection from './components/SessionsSection.svelte';
	import UserSection from './components/UserSection.svelte';

	let { data } = $props();
	let user = $state(data.user);
	let sessions = $state(data.sessions);

	let userDeleted = $state(false);
</script>

<div class="p-6 max-w-5xl mx-auto space-y-6">
	{#if userDeleted}
		<DeletionSuccessMessage title="User deleted" href={route('/client/users')} />
	{:else}
		<UserSection {user} onUserDeleted={() => (userDeleted = true)} />

		{#if user.accessLevel}
			<AccessLevelSection
				userId={user.id}
				accessLevel={user.accessLevel}
				onAccessLevelChanged={(al) => (user.accessLevel = al)}
			/>
		{/if}

		<PermissionGuard requiredPermissions={'LIST_USER_SESSIONS'}>
			<SessionsSection
				userId={data.user.id}
				bind:sessions
				onSessionDeleted={(id) => {
					sessions = sessions.filter((s) => s.publicId !== id);
				}}
			/>
		</PermissionGuard>
	{/if}
</div>
