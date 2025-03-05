<script lang="ts">
	import { apiRequestEmailAddressConfirmationMutation } from '$lib/api/auth.queries';
	import Icon from '@iconify/svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
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

	const mutation = apiRequestEmailAddressConfirmationMutation();

	let dismissed = $state(false);

	const statusColors: Record<(typeof mutation)['status'], string> = {
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
		onclick={() => {
			if (type === 'dismiss') {
				dismissed = true;
				return;
			}

			mutation.mutate({ confirmingForOrg: sendConfirmationEmailTo === 'organization' });
		}}
	>
		{type === 'dismiss' ? 'Fechar' : 'Confirmar Email'}
	</button>
{/snippet}

{#if !dismissed}
	<PermissionGuard
		requiredPermissions={sendConfirmationEmailTo === 'organization' ? ['UPDATE_ORGANIZATION'] : []}
	>
		<div
			class={`card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] w-full ${statusColors[mutation.status]} ${extraClasses}`}
		>
			<Icon icon="mdi:info" class="hidden lg:block" />

			{#if mutation.status === 'pending'}
				<div>
					enviando email de confirmação
					<Progress value={null} classes="mt-1" />
				</div>
				{@render btn('dismiss')}
			{:else if mutation.status === 'success'}
				email de confirmação enviado
				{@render btn('dismiss')}
			{:else if mutation.status === 'error'}
				erro ao enviar email de confirmação
				{@render btn('dismiss')}
			{:else}
				<div>
					<p class="font-bold">Seu endereço de email não foi verificado</p>
					<p class="text-sm opacity-60">Por favor confirme seu endereço de email.</p>
				</div>

				{@render btn('download')}
			{/if}
		</div>
	</PermissionGuard>
{/if}
