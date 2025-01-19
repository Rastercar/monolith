<script lang="ts">
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiDeleteTracker, apiSetTrackerVehicle } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import TrackerSimCardsAccordion from '$lib/components/non-generic/accordion/tracker-sim-cards-acordion/TrackerSimCardsAccordion.svelte';
	import TrackerStatusIndicator from '$lib/components/non-generic/indicator/TrackerStatusIndicator.svelte';
	import { getAuthContext } from '$lib/store/context';
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { DropdownMenu } from 'bits-ui';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		tracker: Tracker;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;

		onTrackerRemoved: () => void;
		onTrackerDeleted: () => void;
		onEditModeClicked: () => void;
	}

	let {
		tracker,
		createSimCardForm,
		updateSimCardForm,
		onTrackerDeleted,
		onTrackerRemoved,
		onEditModeClicked
	}: Props = $props();

	const removeTrackerMutation = createMutation(() => ({
		mutationFn: () => apiSetTrackerVehicle({ vehicleTrackerId: tracker.id, vehicleId: null }),
		onError: showErrorToast
	}));

	const deleteTrackerMutation = createMutation(() => ({
		mutationFn: (r: boolean) => apiDeleteTracker(tracker.id, { deleteAssociatedSimCards: r }),
		onError: showErrorToast
	}));

	const removeTracker = async () => {
		const ok = confirm(
			'Remove the tracker from the vehicle ?\n\nAny positions received by the tracker will NOT be associated with the vehicle'
		);

		if (!ok) return;

		await removeTrackerMutation.mutateAsync();
		onTrackerRemoved();
	};

	const deleteTracker = async (deleteSimCards: boolean) => {
		const ok = confirm('Delete the tracker ?\n\nAny positions recieved will be lost');
		if (!ok) return;

		await deleteTrackerMutation.mutateAsync(deleteSimCards);
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
			text: 'Edit',
			requiredPermission: 'UPDATE_TRACKER' as const
		},
		{
			id: 'delete',
			icon: 'mdi:trash',
			text: 'Permanently delete',
			requiredPermission: 'DELETE_TRACKER' as const
		},
		{
			id: 'remove',
			icon: 'mdi:close',
			text: 'Remove from vehicle',
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

		<div><span class="type-scale-1 opacity-80">model:</span> {tracker.model}</div>
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
