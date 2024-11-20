<script lang="ts">
	import type { UserSession } from '$lib/api/user.schema';
	import Icon from '@iconify/svelte';
	import SessionCard from './SessionCard.svelte';


	

	interface Props {
		sessions: UserSession[];
		/**
	 * If the sessions being show with this component
	 * belong to the currently logged in user, and as
	 * such can be revoked
	 */
		isSessionsFromCurrentlyLoggedUser?: boolean;
		class?: string;
	}

	let { sessions = $bindable(), isSessionsFromCurrentlyLoggedUser = false, class: clazz = '' }: Props = $props();
	

	const removeSession = (sessionPublicId: number) => {
		const idx = sessions.findIndex((s) => s.publicId === sessionPublicId);

		if (idx >= 0) {
			sessions.splice(idx, 1);
			sessions = sessions;
		}
	};
</script>

<div class={clazz}>
	{#each sessions as session, i}
		<SessionCard
			belongsToLoggedInUser={isSessionsFromCurrentlyLoggedUser}
			{session}
			on:deleted={() => removeSession(session.publicId)}
		/>

		{#if i < sessions.length - 1}
			<hr class="my-4 sm:my-0" />
		{/if}
	{:else}
		<span class="mt-4 flex items-center px-4 pb-4">
			<Icon icon="mdi:info" class="mr-2" />
			no sessions found
		</span>
	{/each}
</div>
