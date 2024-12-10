<script lang="ts">
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import AccessLevelSection from './components/AccessLevelSection.svelte';
	import UserSection from './components/UserSection.svelte';

	let { data } = $props();

	let userDeleted = $state(false);
</script>

<div class="p-6 max-w-5xl mx-auto space-y-6">
	{#if userDeleted}
		<DeletionSuccessMessage title="User deleted successfully" href="/client/users" />
	{:else}
		<UserSection
			user={data.user}
			onUserDeleted={() => {
				userDeleted = true;
			}}
		/>

		<AccessLevelSection userId={data.user.id} />
		<!-- 
		<PermissionGuard requiredPermissions={'LIST_USER_SESSIONS'}>
			<SessionsSection userId={data.user.id} />
		</PermissionGuard> -->
	{/if}
</div>
