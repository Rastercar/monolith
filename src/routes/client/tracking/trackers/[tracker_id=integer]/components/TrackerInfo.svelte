<script lang="ts">
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import { apiDeleteTracker } from '$lib/api/tracker';
	import type { Tracker } from '$lib/api/tracker.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TrackerSimCardsAccordion from '$lib/components/non-generic/accordion/tracker-sim-cards-acordion/TrackerSimCardsAccordion.svelte';
	import DeleteTrackerModal from '$lib/components/non-generic/modal/DeleteTrackerModal.svelte';
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		tracker: Tracker;
		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;

		onEditModeClick: () => void;
		onTrackerDeleted: () => void;
	}

	let {
		tracker = $bindable(),
		createSimCardForm,
		updateSimCardForm,
		onTrackerDeleted,
		onEditModeClick
	}: Props = $props();

	const deleteTrackerMutation = createMutation(() => ({
		mutationFn: (r: boolean) => apiDeleteTracker(tracker.id, { deleteAssociatedSimCards: r }),
		onError: showErrorToast
	}));

	const deleteTracker = async (deleteSimCards: boolean) => {
		await deleteTrackerMutation.mutateAsync(deleteSimCards);
		onTrackerDeleted();
	};
</script>

<h2 class="p-4 text-lg flex items-center">
	<span class="mr-auto">General Info</span>

	<!-- TODO: -->
	<!--<TrackerStatusIndicator vehicleTrackerId={tracker.id}>
	 <div class="ml-2">
			{#snippet children({ isOnline })}
				{isOnline ? 'online' : 'offline'}
			{/snippet}
		</div> 
	</TrackerStatusIndicator>-->
</h2>

<div class="px-4">
	<div class="md:flex md:items-center">
		<div class="flex items-center md:mr-auto">
			<span class="mr-4">model: {tracker.model}</span>
			<span class="mr-auto">imei: {tracker.imei}</span>
		</div>

		<div class="flex items-center mt-4 md:mt-0">
			<PermissionGuard requiredPermissions={'DELETE_TRACKER'}>
				<DeleteTrackerModal onDeleteConfirmed={(withSimCards) => deleteTracker(withSimCards)}>
					<button class="btn preset-filled-warning-200-800">
						<Icon icon="mdi:trash" />delete
					</button>
				</DeleteTrackerModal>
			</PermissionGuard>

			<PermissionGuard requiredPermissions={'UPDATE_TRACKER'}>
				<button class="btn preset-filled-primary-200-800 ml-3" onclick={onEditModeClick}>
					<Icon icon="mdi:pencil" />
					edit
				</button>
			</PermissionGuard>
		</div>
	</div>
</div>

<hr class="hr my-4" />

<TrackerSimCardsAccordion bind:tracker {createSimCardForm} {updateSimCardForm} />
