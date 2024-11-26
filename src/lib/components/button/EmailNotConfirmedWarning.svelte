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
		 * has the needed permissions to confirm the org email. The email is
		 * sent to the user organization billing email address
		 */
		sendConfirmationEmailTo: 'user' | 'organization';

		extraClasses?: string;
	}

	let { sendConfirmationEmailTo, extraClasses = '' }: Props = $props();

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

{#if !dismissed}
	<PermissionGuard
		requiredPermissions={sendConfirmationEmailTo === 'organization' ? ['UPDATE_ORGANIZATION'] : []}
	>
		<div class={`flex items-center space-x-2 ${extraClasses}`}>
			{#if $mutation.isPending}
				<div class="text-tertiary-600-400">
					sending confirmation email
					<Progress value={null} classes="mt-1" />
				</div>
			{:else if $mutation.isSuccess}
				<div class="text-success-600-400 flex items-center">
					confirmation email sent to your inbox

					<button type="button" class="btn-icon" onclick={() => (dismissed = true)}>
						<Icon icon="mdi:close" />
					</button>
				</div>
			{:else if $mutation.isError}
				<div class="text-error-600-400 flex items-center">
					<Icon icon="mdi:error" class="mr-2" />
					error verifying your email address

					<button type="button" class="btn-icon" onclick={() => (dismissed = true)}>
						<Icon icon="mdi:close" />
					</button>
				</div>
			{:else}
				<button
					type="button"
					class="btn preset-filled-warning-400-600 py-1"
					onclick={() => $mutation.mutate()}
				>
					<Icon icon="mdi:warning" />
					verify email
				</button>
			{/if}
		</div>
	</PermissionGuard>
{/if}
