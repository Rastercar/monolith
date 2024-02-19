<script lang="ts">
	import type { UserSession } from '$lib/api/user.schema';
	import SessionCard from './SessionCard.svelte';

	export let sessions: UserSession[];

	const removeSession = (sessionPublicId: number) => {
		const idx = sessions.findIndex((s) => s.publicId === sessionPublicId);

		if (idx >= 0) {
			sessions.splice(idx, 1);
			sessions = sessions;
		}
	};
</script>

<div class="sm:card sm:rounded-md">
	{#each sessions as session, i}
		<SessionCard {session} on:deleted={() => removeSession(session.publicId)} />

		{#if i < sessions.length - 1}
			<hr class="my-4 sm:my-0" />
		{/if}
	{/each}
</div>
