<script lang="ts">
	import { apiRequestOrganizationBillingEmailAddressConfirmationEmail } from '$lib/api/organization';
	import { apiRequestUserEmailAddressConfirmationEmail } from '$lib/api/user';
	import { awaitPromiseWithMinimumTimeOf } from '$lib/utils/promises';
	import Icon from '@iconify/svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import PermissionGuard from '../guard/PermissionGuard.svelte';

	interface Props {
		/**
		 * if the email that is not confirmed is the user email or the user's organization email.
		 *
		 * - for users, the email will be sent to the user email address
		 * - for organization, the component will only be visible if the user
		 * has the needed permissions to confirm the org email. The email is sent
		 * to the user organization billing email address
		 */
		sendConfirmationEmailTo: 'user' | 'organization';
	}

	let { sendConfirmationEmailTo }: Props = $props();

	const mutation = createMutation({
		mutationFn: () => {
			const promise =
				sendConfirmationEmailTo === 'user'
					? apiRequestUserEmailAddressConfirmationEmail()
					: apiRequestOrganizationBillingEmailAddressConfirmationEmail();

			return awaitPromiseWithMinimumTimeOf(promise, 1_500);
		}
	});

	let dismissed = $state(false);
</script>

<PermissionGuard
	requiredPermissions={sendConfirmationEmailTo === 'organization' ? ['UPDATE_ORGANIZATION'] : []}
>
	<div class="max-w-xs flex items-center space-x-2 text-sm" class:hidden={dismissed}>
		{#if $mutation.isPending}
			<div class="text-secondary-500-400-token">
				sending confirmation email
				<Progress classes="mt-1" />
			</div>
		{:else if $mutation.isSuccess}
			<span class="text-success-500-400-token flex items-center">
				confirmation email sent to your inbox

				<button type="button" class="btn-icon btn-icon-sm" onclick={() => (dismissed = true)}>
					<Icon icon="mdi:close" />
				</button>
			</span>
		{:else if $mutation.isError}
			<span class="text-error-500-400-token flex items-center">
				<Icon icon="mdi:error" class="mr-2" />
				error verifying your email address

				<button type="button" class="btn-icon btn-icon-sm" onclick={() => (dismissed = true)}>
					<Icon icon="mdi:close" />
				</button>
			</span>
		{:else}
			<button
				type="button"
				class="btn btn-sm variant-filled-warning py-1"
				onclick={() => $mutation.mutate()}
			>
				verify email
			</button>
		{/if}
	</div>
</PermissionGuard>
