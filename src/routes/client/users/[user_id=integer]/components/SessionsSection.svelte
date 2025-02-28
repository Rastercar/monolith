<script lang="ts">
	import type { UserSession } from '$lib/api/user.schema';
	import SessionList from '$lib/components/non-generic/session/SessionList.svelte';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		userId: number;
		sessions: UserSession[];
		onSessionDeleted: (_id: number) => void;
	}

	let { userId, sessions = $bindable(), onSessionDeleted }: Props = $props();
</script>

<div class="card preset-filled-surface-100-900 sm:rounded-lg">
	<Accordion multiple>
		<Accordion.Item value="sessions" panelRounded="p-0">
			{#snippet control()}
				<div class="flex items-center py-2">
					<Icon icon="mdi:access-point" width="32" height="32" class="mr-2" />
					Sessões
				</div>
			{/snippet}

			{#snippet panel()}
				<p class="mt-2 opacity-80">
					Todos os dispositivos do usuário logados na plataforma. Revogar qualquer sessão desloga o
					usuário para o dispositivo específico.
				</p>

				<SessionList {sessions} sessionsOwnerId={userId} {onSessionDeleted} />
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
