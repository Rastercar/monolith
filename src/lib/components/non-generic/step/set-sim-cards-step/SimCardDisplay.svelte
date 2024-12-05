<script lang="ts">
	import { apiDeleteSimCard, apiUpdateSimCard } from '$lib/api/sim-card';
	import type { SimCard } from '$lib/api/sim-card.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { Tooltip } from 'bits-ui';
	import SimDeletionOrRemovalWarning from './SimDeletionOrRemovalWarning.svelte';

	interface Props {
		simCard: SimCard;
		additionalClasses?: string;

		onSimDeleted: () => void;
		onSimRemoved: () => void;
	}

	let { simCard, onSimDeleted, onSimRemoved, additionalClasses = '' }: Props = $props();

	let warningToShow: 'deletion' | 'removal' | null = $state(null);

	const removeSimCardMutation = createMutation(() => ({
		mutationFn: () => apiUpdateSimCard(simCard.id, { vehicleTrackerId: null }),
		onSuccess: () => showSuccessToast('SIM card removed from slot')
	}));

	const deleteSimMutation = createMutation(() => ({
		mutationFn: () => apiDeleteSimCard(simCard.id),
		onSuccess: () => showSuccessToast('SIM card deleted')
	}));

	const deleteSimCard = () => {
		deleteSimMutation
			.mutateAsync()
			.then(onSimDeleted)
			.catch(() => showErrorToast('failed to delete sim card'));
	};

	const removeSimCard = () => {
		removeSimCardMutation
			.mutateAsync()
			.then(onSimRemoved)
			.catch(() => showErrorToast('failed to remove sim card'));
	};
</script>

{#snippet loaderOrCloseBtn(isLoading: boolean, icon: string)}
	{#if isLoading}
		<Icon icon="mdi:loading" class="animate-spin" width={18} />
	{:else}
		<Icon {icon} width={18} />
	{/if}
{/snippet}

{#snippet field(label: string, value: string | null)}
	<p><span class="opacity-70">{label}:</span> {value}</p>
{/snippet}

<div class={`card preset-filled-surface-100-900 p-4 ${additionalClasses}`}>
	<div class="flex items-center mb-2">
		<span class="text-md">phone number: {simCard.phoneNumber}</span>

		<!-- Remove SIM button -->
		<PermissionGuard requiredPermissions={'UPDATE_SIM_CARD'}>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={100}>
					<Tooltip.Trigger class="ml-auto">
						<button
							class="btn-icon btn-icon-sm preset-filled-secondary-200-800 p-0 [&>*]:pointer-events-none"
							disabled={!!warningToShow || removeSimCardMutation.isPending}
							onclick={() => (warningToShow = 'removal')}
						>
							{@render loaderOrCloseBtn(removeSimCardMutation.isPending, 'mdi:close')}
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content sideOffset={8} class="card p-2 bg-surface-400-600">
						{removeSimCardMutation.isPending ? 'removing SIM card' : 'remove SIM card from tracker'}
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</PermissionGuard>

		<!-- Delete SIM button -->
		<PermissionGuard requiredPermissions={'DELETE_SIM_CARD'}>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={100}>
					<Tooltip.Trigger class="ml-4">
						<button
							class="btn-icon btn-icon-sm preset-filled-warning-200-800 p-0 [&>*]:pointer-events-none"
							disabled={!!warningToShow || deleteSimMutation.isPending}
							onclick={() => (warningToShow = 'deletion')}
						>
							{@render loaderOrCloseBtn(removeSimCardMutation.isPending, 'mdi:trash')}
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content sideOffset={8} class="card p-2 bg-surface-400-600">
						{removeSimCardMutation.isPending ? 'deleting SIM card' : 'delete SIM card'}
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</PermissionGuard>
	</div>

	{#if warningToShow !== null}
		<SimDeletionOrRemovalWarning
			type={warningToShow}
			onCancel={() => (warningToShow = null)}
			onConfirm={() => {
				warningToShow === 'deletion' ? deleteSimCard() : removeSimCard();
				warningToShow = null;
			}}
		/>
	{/if}

	<hr class="hr my-4" />

	<div class="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
		{@render field('SSN', simCard.ssn)}
		{@render field('APN Address', simCard.apnAddress)}
		{@render field('APN User', simCard.apnUser)}
		{@render field('APN Password', simCard.apnPassword)}
		{@render field('PIN', simCard.pin)}
		{@render field('PIN 2', simCard.pin2)}
		{@render field('PUK', simCard.puk)}
		{@render field('PUK 2', simCard.puk2)}
	</div>
</div>
