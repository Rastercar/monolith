<script lang="ts">
	import Icon from '@iconify/svelte';

	// TODO: these props could be dates
	interface Session {
		isCurrent: boolean;
		isOnMobileDevice: boolean;
		ip: string;
		location: string;
		createdAt: string;
		expiresAt: string;
	}

	// TODO: revoke session functionality that emits a deleted event

	export let session: Session;
</script>

<div class="flex items-center sm:p-4">
	<Icon icon={session.isOnMobileDevice ? 'mdi:cellphone' : 'mdi:computer'} height="32" />
	<div class="flex flex-col ml-4 text-sm">
		<span>{session.location} {session.ip}</span>
		<span class="text-surface-700-200-token">created at: {session.createdAt}</span>
		<span class="text-surface-700-200-token">expires in {session.expiresAt}</span>
	</div>

	{#if session.isCurrent}
		<span class="chip variant-filled-primary ml-auto">your current session</span>
	{:else}
		<button type="button" class="btn btn-sm variant-filled-warning ml-auto">
			<Icon icon="mdi:trash" />
			<span>revoke session</span>
		</button>
	{/if}
</div>
