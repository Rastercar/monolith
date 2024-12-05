<script lang="ts">
	import { apiDeleteTracker } from '$lib/api/tracker';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES';
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import TrackerInfo from './components/TrackerInfo.svelte';

	const { data } = $props();

	let trackerDeleted = $state(false);
	let editMode = $state(false);

	const deleteSimCardMutation = createMutation(() => ({
		mutationFn: () => apiDeleteTracker(data.tracker.id),
		onError: showErrorToast
	}));

	const deleteTracker = async () => {
		if (!confirm('Permanently delete this tracker ?')) return;

		await deleteSimCardMutation.mutateAsync();
		trackerDeleted = true;
	};
</script>

<div class="p-6 max-w-5xl mx-auto">
	<TitleAndBreadCrumbsPageHeader
		title="tracker info"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ text: 'tracking' },
			{ href: route('/client/tracking/trackers'), icon: 'mdi:cellphone', text: 'trackers' },
			{
				href: route('/client/tracking/trackers/[tracker_id=integer]', {
					tracker_id: data.tracker.id.toString()
				}),
				text: data.tracker.imei
			}
		]}
	/>

	<hr class="hr my-4" />

	{#if trackerDeleted}
		<DeletionSuccessMessage
			title="Tracker deleted successfully"
			href={route('/client/tracking/trackers')}
		/>
	{:else if !editMode}
		<div class="card preset-surface-100-900">
			<TrackerInfo
				tracker={data.tracker}
				createSimCardForm={data.createSimCardForm}
				updateSimCardForm={data.updateSimCardForm}
				onEditModeClick={() => (editMode = true)}
				onTrackerDeleted={() => (trackerDeleted = true)}
			/>
		</div>

		<!-- <div class="card mt-4">
			<TrackerPositionList trackerId={data.tracker.id} />
		</div> -->
	{:else}
		<div class="card p-4">
			<div class="flex justify-between items-center">
				<span>Updating vehicle tracker</span>

				<button
					class="btn-icon btn-icon-sm variant-filled-primary"
					onclick={() => (editMode = false)}
				>
					<Icon icon="mdi:pencil-off" />
				</button>
			</div>

			<hr class="my-4" />

			<!-- <UpdateTrackerForm
				tracker={data.tracker}
				formSchema={data.updateTrackerForm}
				on:tracker-updated={(e) => {
					editMode = false;
					tracker = e.detail;
				}}
			/> -->
		</div>
	{/if}
</div>
