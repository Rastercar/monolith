<script lang="ts">
	import {
		apiDeleteSimCardByIdMutation,
		apiUpdateSimCardMutation
	} from '$lib/api/sim-card.queries';
	import type { SimCard } from '$lib/api/sim-card.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'bits-ui';
	import SimDeletionOrRemovalWarning from './SimDeletionOrRemovalWarning.svelte';

	interface Props {
		simCard: SimCard;
		additionalClasses?: string;

		onSimDeleted: VoidFunction;
		onSimRemoved: VoidFunction;
	}

	let { simCard, onSimDeleted, onSimRemoved, additionalClasses = '' }: Props = $props();

	let warningToShow: 'deletion' | 'removal' | null = $state(null);

	const removeSimCardMutation = apiUpdateSimCardMutation({
		onSuccess: () => showSuccessToast('SIM card removed')
	});

	const deleteSimMutation = apiDeleteSimCardByIdMutation({
		onSuccess: () => showSuccessToast('SIM card deleted')
	});

	const deleteSimCard = () => {
		deleteSimMutation
			.mutateAsync(simCard.id)
			.then(onSimDeleted)
			.catch(() => showErrorToast('erro ao deletar cartão SIM'));
	};

	const removeSimCard = () => {
		removeSimCardMutation
			.mutateAsync({ id: simCard.id, body: { vehicleTrackerId: null } })
			.then(onSimRemoved)
			.catch(() => showErrorToast('erro ao remover cartão SIM'));
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
		<span class="text-md">telefone: {simCard.phoneNumber}</span>

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
						{removeSimCardMutation.isPending ? 'removendo...' : 'remover cartão SIM do rastreador'}
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
						{removeSimCardMutation.isPending ? 'deletando...' : 'deletar cartão SIM'}
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
		{@render field('APN Endereço', simCard.apnAddress)}
		{@render field('APN Usuário', simCard.apnUser)}
		{@render field('APN Senha', simCard.apnPassword)}
		{@render field('PIN', simCard.pin)}
		{@render field('PIN 2', simCard.pin2)}
		{@render field('PUK', simCard.puk)}
		{@render field('PUK 2', simCard.puk2)}
	</div>
</div>
