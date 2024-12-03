<script lang="ts">
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiDeleteTracker } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TrackerSimCardsAccordion from '$lib/components/non-generic/accordion/tracker-sim-cards-acordion/TrackerSimCardsAccordion.svelte';
	import TrackerStatusIndicator from '$lib/components/non-generic/indicator/TrackerStatusIndicator.svelte';
	import DeleteTrackerModal from '$lib/components/non-generic/modal/DeleteTrackerModal.svelte';
	import Icon from '@iconify/svelte';
	import { type ModalComponent } from '@skeletonlabs/skeleton';
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		tracker: Tracker;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;
	}

	let { tracker, createSimCardForm, updateSimCardForm }: Props = $props();

	const deleteTrackerMutation = createMutation({
		mutationFn: (r: boolean) => apiDeleteTracker(tracker.id, { deleteAssociatedSimCards: r }),
		onError: () => toaster.error()
	});

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

	const dispatch = createEventDispatcher<{
		'edit-mode-on': void;
		'tracker-deleted': void;
	}>();
</script>

<h2 class="p-4 text-lg flex items-center">
	<span class="mr-auto">General Info</span>

	<TrackerStatusIndicator vehicleTrackerId={tracker.id}>
		<div class="ml-2">
			{#snippet children({ isOnline })}
				{isOnline ? 'online' : 'offline'}
			{/snippet}
		</div>
	</TrackerStatusIndicator>
</h2>

<div class="px-4">
	<div class="flex items-center">
		<span class="mr-4">model: {tracker.model}</span>
		<span class="mr-auto">imei: {tracker.imei}</span>

		<PermissionGuard requiredPermissions={['DELETE_TRACKER']}>
			<button class="btn btn-sm variant-filled-error" onclick={openDeleteTrackerConfirmModal}>
				<Icon icon="mdi:trash" class="mr-2" />delete
			</button>
		</PermissionGuard>

		<PermissionGuard requiredPermissions={['UPDATE_TRACKER']}>
			<button
				class="btn btn-sm variant-filled-primary ml-3"
				onclick={() => dispatch('edit-mode-on')}
			>
				<Icon icon="mdi:pencil" class="mr-2" />edit
			</button>
		</PermissionGuard>
	</div>
</div>

<hr class="my-4" />

<TrackerSimCardsAccordion {tracker} {createSimCardForm} {updateSimCardForm} />
