<script lang="ts">
	import type { UserSession } from '$lib/api/user.schema';
	import Icon from '@iconify/svelte';
	import SessionCard from './SessionCard.svelte';

	interface Props {
		classes?: string;
		sessions: UserSession[];
		onSessionDeleted: (_id: number) => void;

		/**
		 * If the sessions being show with this component
		 * belong to the currently logged in user, and as
		 * such can be revoked
		 */
		isSessionsFromCurrentlyLoggedUser?: boolean;
	}

	let {
		classes = '',
		sessions,
		isSessionsFromCurrentlyLoggedUser = false,
		onSessionDeleted
	}: Props = $props();
</script>

<div class={classes}>
	{#each sessions as session, i}
		<SessionCard
			belongsToLoggedInUser={isSessionsFromCurrentlyLoggedUser}
			{session}
			onDeleted={() => onSessionDeleted(session.publicId)}
		/>

		{#if i < sessions.length - 1}
			<hr class="hr my-4 sm:my-0" />
		{/if}
	{:else}
		<span class="flex items-center p-4">
			<Icon icon="mdi:info" class="mr-2" />
			no sessions found
		</span>
	{/each}
</div>
