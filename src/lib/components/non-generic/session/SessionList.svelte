<script lang="ts">
	import type { UserSession } from '$lib/api/user.schema';
	import Icon from '@iconify/svelte';
	import SessionCard from './SessionCard.svelte';

	interface Props {
		classes?: string;
		sessions: UserSession[];
		onSessionDeleted: (_id: number) => void;

		/**
		 * the ID of the user that owns the list of sessions,
		 * if undefined its assumed the sesion belongs to the
		 * logged in user
		 */
		sessionsOwnerId?: number;
	}

	let { classes = '', sessions, sessionsOwnerId, onSessionDeleted }: Props = $props();
</script>

<div class={classes}>
	{#each sessions as session, i}
		<SessionCard
			{session}
			sessionOwnerId={sessionsOwnerId}
			onDeleted={() => onSessionDeleted(session.publicId)}
		/>

		{#if i < sessions.length - 1}
			<hr class="hr my-4 sm:my-0" />
		{/if}
	{:else}
		<span class="flex items-center py-4">
			<Icon icon="mdi:info" class="mr-2" />
			nenhuma sessão encontrada
		</span>
	{/each}
</div>
