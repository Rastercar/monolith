<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { awaitPromiseWithMinimumTimeOf } from '$lib/utils/promises';
	import Icon from '@iconify/svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import PermissionGuard from '../guard/PermissionGuard.svelte';

	interface Props {
		extraClasses?: string;

		/**
		 * if the email that is not confirmed is the user email or the user's organization email.
		 *
		 * - for users, the email will be sent to the user email address
		 * - for organization, the component will only be visible if the user
		 * has the needed permissions to confirm the org email. The email is
		 * sent to the user organization billing email address
		 */
		sendConfirmationEmailTo: 'user' | 'organization';
	}

	let { sendConfirmationEmailTo, extraClasses = '' }: Props = $props();

	const mutation = createMutation({
		mutationFn: () => {
			// TODO: add a body or something to inform its for a user or org
			//
			// confirmingFor
			const promise = fetch(route('POST /auth/request-email-confirmation'), { method: 'POST' });

			return awaitPromiseWithMinimumTimeOf(promise, 1_500);
		}
	});

	let dismissed = $state(false);

	const statusColors: Record<(typeof $mutation)['status'], string> = {
		error: 'preset-outlined-error-500',
		idle: 'preset-outlined-warning-500',
		pending: 'preset-outlined-primary-500',
		success: 'preset-outlined-success-500'
	};
</script>

{#snippet btn(type: 'download' | 'dismiss')}
	<button
		type="button"
		class="btn preset-tonal hover:preset-filled"
		onclick={() => (type === 'dismiss' ? (dismissed = true) : $mutation.mutate())}
	>
		{type === 'dismiss' ? 'Dismiss' : 'Verify Email'}
	</button>
{/snippet}

{#if !dismissed}
	<PermissionGuard
		requiredPermissions={sendConfirmationEmailTo === 'organization' ? ['UPDATE_ORGANIZATION'] : []}
	>
		<div
			class={`card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] w-full ${statusColors[$mutation.status]} ${extraClasses}`}
		>
			<Icon icon="mdi:info" class="hidden lg:block" />

			{#if $mutation.status === 'pending'}
				<div>
					sending confirmation email
					<Progress value={null} classes="mt-1" />
				</div>
				{@render btn('dismiss')}
			{:else if $mutation.status === 'success'}
				confirmation email sent to your inbox
				{@render btn('dismiss')}
			{:else if $mutation.status === 'error'}
				error verifying your email address
				{@render btn('dismiss')}
			{:else}
				<div>
					<p class="font-bold">Your email address is not confirmed</p>
					<p class="type-scale-1 opacity-60">Please take a minute to confirm your email address.</p>
				</div>

				{@render btn('download')}
			{/if}
		</div>
	</PermissionGuard>
{/if}
