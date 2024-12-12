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

<div class="sm:card sm:preset-filled-surface-100-900 sm:rounded-lg">
	<Accordion multiple>
		<Accordion.Item value="sessions" panelRounded="p-0">
			{#snippet control()}
				<div class="flex items-center py-2">
					<Icon icon="mdi:access-point" width="32" height="32" class="mr-2" />
					Sessions
				</div>
			{/snippet}

			{#snippet panel()}
				<p class="mt-2 opacity-80">
					All devices the user is currently logged in. Revoking any sessions will log off the user
					for that specific device.
				</p>

				<SessionList {sessions} sessionsOwnerId={userId} {onSessionDeleted} />
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
