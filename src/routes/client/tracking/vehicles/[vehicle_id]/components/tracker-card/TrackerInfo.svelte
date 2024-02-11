<script lang="ts">
	import { apiDeleteTracker, apiSetTrackerVehicle } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import SingleLineList from '$lib/components/list/SingleLineList.svelte';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import { getToaster } from '$lib/store/toaster';
	import Icon from '@iconify/svelte';
	import { getModalStore, popup, type ModalComponent } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import DeleteTrackerModal from './DeleteTrackerModal.svelte';

	export let tracker: Tracker;

	const toaster = getToaster();
	const modalStore = getModalStore();

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	const removeTrackerMutation = createMutation({
		mutationFn: () => apiSetTrackerVehicle({ trackerId: tracker.id, vehicleId: null }),
		onError: toaster.error
	});

	const deleteTrackerMutation = createMutation({
		mutationFn: (r: boolean) => apiDeleteTracker(tracker.id, { deleteAssociatedSimCards: r }),
		onError: toaster.error
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
</script>

<div class="flex mb-4">
	<div class="flex flex-col flex-grow mr-6">
		<div class="flex items-center">
			<span>Installed tracker:</span>

			<!-- TODO: dynamic status -->
			<div class="h-2 w-2 bg-green-700 dark:bg-green-300 rounded-full mr-2 ml-auto" />
			<div>online</div>
		</div>

		<!-- TODO: NOW !!!! query the DB tracker last position, if the position is > 5min old then change the status to not online -->
		<div class="flex text-sm opacity-70">
			<span>last position at</span>
			<span class="ml-auto">10/10/2023 - 09:16:54 AM</span>
		</div>
	</div>

	<SingleLineList
		data-popup="tracker-options"
		items={[
			{ id: 'edit', icon: 'mdi:pencil', text: 'Edit' },
			{ id: 'delete', icon: 'mdi:trash', text: 'Permanently delete' },
			{ id: 'remove', icon: 'mdi:close', text: 'Remove from vehicle' }
		]}
		on:item-clicked={onOptionsClick}
	/>

	<button
		class="btn p-0"
		use:popup={{ event: 'click', target: 'tracker-options', placement: 'bottom-end' }}
	>
		<Icon icon="mdi:menu" height={24} />
	</button>
</div>

<div><span class="text-sm">model:</span> <b>{tracker.model}</b></div>
<div><span class="text-sm">imei:</span> <b>{tracker.imei}</b></div>

<hr class="my-4" />

<!-- COMPONENTIZE ME BY SIM CARD SLOTS -->
<div class="flex mb-2 justify-between">
	<span>SIM cards:</span>
	<!-- TODO: occupied slot count -->
	<span class="text-sm opacity-70"> 0 / {supportedSimCards} Slots</span>
</div>

<div class="flex flex-col gap-3">
	<div class="flex items-center">
		<Icon icon="mdi:sim" height={32} class="mr-4" />
		<div class="text-sm">
			<p>+5567998801995</p>
			<p>user@au.au-net.ne.jp</p>
		</div>
	</div>

	<div class="flex items-center">
		<Icon icon="mdi:sim" height={32} class="mr-4" />
		<div class="text-sm">
			<p>+5567998801995</p>
			<p>user@au.au-net.ne.jp</p>
		</div>
	</div>
</div>
