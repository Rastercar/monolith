<script lang="ts">
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiDeleteTrackerMutation, apiSetTrackerVehicleMutation } from '$lib/api/tracker.queries';
	import type { Tracker } from '$lib/api/tracker.schema';
	import TrackerSimCardsAccordion from '$lib/components/non-generic/accordion/tracker-sim-cards-acordion/TrackerSimCardsAccordion.svelte';
	import TrackerStatusIndicator from '$lib/components/non-generic/indicator/TrackerStatusIndicator.svelte';
	import { getAuthContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';
	import { DropdownMenu } from 'bits-ui';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		tracker: Tracker;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;

		onTrackerRemoved: VoidFunction;
		onTrackerDeleted: VoidFunction;
		onEditModeClicked: VoidFunction;
	}

	let {
		tracker,
		createSimCardForm,
		updateSimCardForm,
		onTrackerDeleted,
		onTrackerRemoved,
		onEditModeClicked
	}: Props = $props();

	const setTrackerVehicleMutation = apiSetTrackerVehicleMutation();

	const deleteTrackerMutation = apiDeleteTrackerMutation();

	const removeTracker = async () => {
		const ok = confirm(
			'Remover o rastreador do veículo?\n\nQualquer posição recebida pelo rastreador não sera associada a ele'
		);

		if (!ok) return;

		await setTrackerVehicleMutation.mutateAsync({ vehicleId: null, vehicleTrackerId: tracker.id });
		onTrackerRemoved();
	};

	const deleteTracker = async (deleteAssociatedSimCards: boolean) => {
		const ok = confirm('Deletar o rastreador?\n\nSeu histórico de posições também será deletado');
		if (!ok) return;

		await deleteTrackerMutation.mutateAsync({ id: tracker.id, deleteAssociatedSimCards });
		onTrackerDeleted();
	};

	const onOptionClick = async (opt: string) => {
		if (opt === 'edit') return onEditModeClicked();
		if (opt === 'remove') return removeTracker();
		if (opt === 'delete') return deleteTracker(false);
	};

	const auth = getAuthContext();

	const menuOptions = [
		{
			id: 'edit',
			icon: 'mdi:pencil',
			text: 'Editar',
			requiredPermission: 'UPDATE_TRACKER' as const
		},
		{
			id: 'delete',
			icon: 'mdi:trash',
			text: 'Deletar permanentemente',
			requiredPermission: 'DELETE_TRACKER' as const
		},
		{
			id: 'remove',
			icon: 'mdi:close',
			text: 'Remover do veículo',
			requiredPermission: 'UPDATE_TRACKER' as const
		}
	].filter((opt) => auth.hasPermission(opt.requiredPermission));
</script>

<div class="flex mb-4 px-4 mt-4">
	<div class="flex-grow space-y-2">
		<div class="flex items-center">
			<span class="type-scale-1 opacity-80">status:</span>
			<TrackerStatusIndicator vehicleTrackerId={tracker.id}>
				{#snippet children({ isOnline })}
					<div class="mx-1">
						{isOnline ? 'online' : 'offline'}
					</div>
				{/snippet}
			</TrackerStatusIndicator>
		</div>

		<div><span class="type-scale-1 opacity-80">modelo:</span> {tracker.model}</div>
		<div><span class="type-scale-1 opacity-80">imei:</span> {tracker.imei}</div>
	</div>

	{#if menuOptions.length > 0}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="btn p-0">
				<Icon icon="mdi:menu" height={24} />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content class="card preset-filled-surface-200-800">
					{#each menuOptions as { icon, text, id }}
						<DropdownMenu.Item
							class="flex select-none rounded py-3 hover:bg-surface-100-900"
							onclick={() => onOptionClick(id)}
						>
							<button class="flex items-center gap-2 px-4">
								<Icon {icon} height={18} />{text}
							</button>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	{/if}
</div>

<hr class="hr my-4" />

<TrackerSimCardsAccordion {tracker} {createSimCardForm} {updateSimCardForm} />
