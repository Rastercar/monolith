<script lang="ts">
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiDeleteTracker, apiSetTrackerVehicle } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import SingleLineList from '$lib/components/list/SingleLineList.svelte';
	import TrackerSimCardsAccordion from '$lib/components/non-generic/accordion/tracker-sim-cards-acordion/TrackerSimCardsAccordion.svelte';
	import TrackerStatusIndicator from '$lib/components/non-generic/indicator/TrackerStatusIndicator.svelte';
	import DeleteTrackerModal from '$lib/components/non-generic/modal/DeleteTrackerModal.svelte';
	import type { apiPermission } from '$lib/constants/permissions';
	import { hasPermission } from '$lib/store/auth.svelte';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { getModalStore, popup, type ModalComponent } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';



	interface Props {
		tracker: Tracker;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;
	}

	let { tracker, createSimCardForm, updateSimCardForm }: Props = $props();

	const toaster = getToaster();
	const modalStore = getModalStore();

	const removeTrackerMutation = createMutation({
		mutationFn: () => apiSetTrackerVehicle({ vehicleTrackerId: tracker.id, vehicleId: null }),
		onError: () => toaster.error()
	});

	const deleteTrackerMutation = createMutation({
		mutationFn: (r: boolean) => apiDeleteTracker(tracker.id, { deleteAssociatedSimCards: r }),
		onError: () => toaster.error()
	});

	const removeTracker = async () => {
		const ok = confirm(
			'Remove the tracker from the vehicle ?\n\nAny positions received by the tracker will NOT be associated with the vehicle'
		);

		if (!ok) return;

		await $removeTrackerMutation.mutateAsync();
		dispatch('tracker-removed-from-vehicle');
	};

	const deleteTracker = async (deleteSimCards: boolean) => {
		await $deleteTrackerMutation.mutateAsync(deleteSimCards);
		dispatch('tracker-deleted');
	};

	const openDeleteTrackerConfirmModal = () => {
		const component: ModalComponent = { ref: DeleteTrackerModal };

		modalStore.trigger({
			component,
			type: 'component',
			response: (e: undefined | { deleteSimCards: boolean }) => {
				if (!e) return;
				deleteTracker(e.deleteSimCards);
			}
		});
	};

	const onOptionsClick = async (e: CustomEvent<string>) => {
		if (e.detail === 'edit') return dispatch('edit-mode-on');
		if (e.detail === 'remove') return removeTracker();
		if (e.detail === 'delete') return openDeleteTrackerConfirmModal();
	};

	const dispatch = createEventDispatcher<{
		'edit-mode-on': void;
		'tracker-deleted': void;
		'tracker-removed-from-vehicle': void;
	}>();

	interface MenuOption {
		id: string;
		icon: string;
		text: string;
		requiredPermission: apiPermission;
	}

	const menuOptions: MenuOption[] = [
		{ id: 'edit', icon: 'mdi:pencil', text: 'Edit', requiredPermission: 'UPDATE_TRACKER' as const },
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
	].filter((opt) => $hasPermission(opt.requiredPermission));
</script>

<div class="px-4">
	<div class="flex mb-4">
		<div class="flex-grow">
			<div class="flex items-center">
				<span class="text-sm mr-3">status:</span>
				<TrackerStatusIndicator vehicleTrackerId={tracker.id}>
					<div class="ml-2" >
						{#snippet children({ isOnline })}
												{isOnline ? 'online' : 'offline'}
																	{/snippet}
										</div>
				</TrackerStatusIndicator>
			</div>
			<div><span class="text-sm">model:</span> <b>{tracker.model}</b></div>
			<div><span class="text-sm">imei:</span> <b>{tracker.imei}</b></div>
		</div>

		<SingleLineList
			data-popup="tracker-options"
			items={menuOptions}
			on:item-clicked={onOptionsClick}
		/>

		{#if menuOptions.length > 0}
			<button
				class="btn p-0 mb-auto"
				use:popup={{ event: 'click', target: 'tracker-options', placement: 'bottom-end' }}
			>
				<Icon icon="mdi:menu" height={24} />
			</button>
		{/if}
	</div>

	<hr class="my-4" />
</div>

<TrackerSimCardsAccordion {tracker} {createSimCardForm} {updateSimCardForm} />
