<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	import { getMapContext } from '$lib/store/context';
	import { isOnMobileViewPort } from '$lib/store/viewport.svelte';
	import SelectTrackerOverlay from './SelectTrackerOverlay.svelte';
	import SelectedTrackerListOverlay from './SelectedTrackerListOverlay.svelte';
	import SelectedTrackerOverlay from './SelectedTrackerOverlay.svelte';

	const ctx = getMapContext();

	const syncOpenChangeToCloseWithMapCtx = (v: { open: boolean }) => {
		if (!v.open) ctx.mapOverlay = null;
	};

	const { isMobileViewport } = isOnMobileViewPort();
</script>

<!-- 
[IMPROVEMENT]

for some reason on mobile when selecting a tracker by clicking a selectbox on 
SelectTrackerOverlay, a outside click is triggered and the modal closes, despite
the click clearly not being outside, so we use closeOnInteractOutside={!isMobileViewport}
as a workaround
-->

<Modal
	open={ctx.mapOverlay === 'select-tracker'}
	contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl h-screen md:h-[600px] w-screen"
	contentClasses="overflow-auto"
	triggerClasses="hidden"
	positionerJustify="justify-end"
	positionerAlign="items-end"
	positionerPadding=""
	closeOnInteractOutside={!isMobileViewport}
	onOpenChange={syncOpenChangeToCloseWithMapCtx}
>
	{#snippet content()}
		<SelectTrackerOverlay onCloseClick={() => (ctx.mapOverlay = null)} />
	{/snippet}
</Modal>

<Modal
	open={ctx.mapOverlay === 'selected-tracker-list'}
	contentBase="bg-surface-100-900 shadow-xl w-screen md:w-[600px] h-screen"
	contentClasses="overflow-auto"
	triggerClasses="hidden"
	positionerJustify="justify-end"
	positionerAlign=""
	positionerPadding=""
	transitionsPositionerIn={{ x: 600, duration: 200 }}
	transitionsPositionerOut={{ x: 600, duration: 200 }}
	closeOnInteractOutside={!isMobileViewport}
	onOpenChange={syncOpenChangeToCloseWithMapCtx}
>
	{#snippet content()}
		<SelectedTrackerListOverlay onCloseClick={() => (ctx.mapOverlay = null)} />
	{/snippet}
</Modal>

<Modal
	open={ctx.mapOverlay === 'show-tracker'}
	contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[400px] h-screen"
	positionerJustify="justify-end"
	positionerPadding=""
	positionerAlign=""
	triggerClasses="hidden"
	transitionsPositionerIn={{ x: 480, duration: 200 }}
	transitionsPositionerOut={{ x: 480, duration: 200 }}
	closeOnInteractOutside={!isMobileViewport}
	onOpenChange={syncOpenChangeToCloseWithMapCtx}
>
	{#snippet content()}
		{#if ctx.trackerToDisplay && ctx.trackerToDisplayPosition}
			<SelectedTrackerOverlay
				tracker={ctx.trackerToDisplay}
				position={ctx.trackerToDisplayPosition}
				onCloseClick={() => (ctx.mapOverlay = null)}
			/>
		{/if}
	{/snippet}
</Modal>
