<script lang="ts">
	import { apiDeleteSession, apiSignOutSpecificSession } from '$lib/api/auth';
	import type { UserSession } from '$lib/api/user.schema';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import { awaitPromiseWithMinimumTimeOf } from '$lib/utils/promises';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { UAParser } from 'ua-parser-js';

	type deviceType = 'console' | 'mobile' | 'tablet' | 'smarttv' | 'wearable' | 'embedded';

	interface Props {
		session: UserSession;
		/**
		 * If the session belongs to the logged in user
		 * and therefore, can be revoked.
		 */
		belongsToLoggedInUser?: boolean;
		onDeleted: () => void;
	}

	let { session, onDeleted, belongsToLoggedInUser = false }: Props = $props();

	const uap = new UAParser(session.userAgent);
	const { type } = uap.getDevice();

	const typeToIcon: Record<deviceType, string> = {
		mobile: 'mdi:cellphone',
		tablet: 'mdi:tablet',
		smarttv: 'mdi:tv',
		console: 'mdi:console',
		embedded: 'mdi:raspberrypi',
		wearable: 'mdi:smartwatch'
	};

	const icon = typeToIcon[type as deviceType] ?? 'mdi:computer';

	const toDateStr = (d: Date) => {
		return d.toLocaleDateString(undefined, { hour: '2-digit', minute: 'numeric' });
	};

	const mutation = createMutation({
		mutationFn: () => {
			const promise = belongsToLoggedInUser
				? apiSignOutSpecificSession(session.publicId)
				: apiDeleteSession(session.publicId);

			return awaitPromiseWithMinimumTimeOf(promise, 1_000);
		},
		onSuccess: () => onDeleted()
	});

	const auth = getAuthContext();

	let canRemoveSessions = $derived(belongsToLoggedInUser || auth.hasPermission('LOGOFF_USER'));
</script>

<div class="flex flex-wrap items-center p-4 gap-4">
	<div class="flex items-center">
		<Icon {icon} height="32" />

		<div class="flex flex-col ml-4">
			<span>{uap.getOS().name ?? ''} {uap.getBrowser().name ?? ''} {session.ip}</span>
			<span class="text-surface-600-400 type-scale-1">
				created: {toDateStr(session.createdAt)}
			</span>
			<span class="text-surface-600-400 type-scale-1">
				expires: {toDateStr(session.expiresAt)}
			</span>
		</div>
	</div>

	{#if session.sameAsFromRequest}
		<span class="chip preset-filled-primary-500 ml-auto py-1">your current session</span>
	{:else if $mutation.isError}
		<span class="chip preset-filled-error-400-600 ml-auto py-1">failed to delete session</span>
	{:else if canRemoveSessions}
		<button
			disabled={$mutation.isPending}
			type="button"
			class="btn preset-filled-warning-400-600 ml-auto"
			onclick={() => $mutation.mutate()}
		>
			<span>{$mutation.isPending ? 'removing session' : 'revoke session'}</span>
			<Icon icon="mdi:trash" />
		</button>
	{/if}
</div>
