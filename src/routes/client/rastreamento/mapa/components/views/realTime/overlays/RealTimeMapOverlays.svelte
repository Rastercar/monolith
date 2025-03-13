<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	import { getMapContext } from '$lib/store/context';
	import { isOnMobileViewPort } from '$lib/utils/viewport';
	import SelectTrackerOverlay from './SelectTrackerOverlay.svelte';
	import SelectedTrackerListOverlay from './SelectedTrackerListOverlay.svelte';
	import SelectedTrackerOverlay from './SelectedTrackerOverlay.svelte';
	import Icon from '@iconify/svelte';

	const ctx = getMapContext();

	const syncOpenChangeToCloseWithMapCtx = (v: { open: boolean }) => {
		if (!v.open) ctx.realTimeMapViewState.overlay = null;
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
	open={ctx.realTimeMapViewState.overlay === 'select-tracker'}
	contentBase="bg-surface-100-900 shadow-xl h-screen md:h-[600px] w-screen"
	contentClasses="overflow-auto"
	triggerClasses="hidden"
	positionerJustify="justify-end"
	positionerAlign="items-end"
	positionerPadding=""
	closeOnInteractOutside={!isMobileViewport}
	onOpenChange={syncOpenChangeToCloseWithMapCtx}
>
	{#snippet content()}
		<SelectTrackerOverlay onCloseClick={() => (ctx.realTimeMapViewState.overlay = null)} />
	{/snippet}
</Modal>

<Modal
	open={ctx.realTimeMapViewState.overlay === 'selected-tracker-list'}
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
		<SelectedTrackerListOverlay onCloseClick={() => (ctx.realTimeMapViewState.overlay = null)} />
	{/snippet}
</Modal>

<Modal
	open={ctx.realTimeMapViewState.overlay === 'show-tracker'}
	contentBase="bg-surface-100-900 shadow-xl w-[400px] h-screen p-0"
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
		{#if ctx.realTimeMapViewState.trackerToDisplay}
			<SelectedTrackerOverlay trackerWithPosition={ctx.realTimeMapViewState.trackerToDisplay}>
				{#snippet title()}
					<div class="ml-auto">
						<button
							class="text-sm btn preset-filled-secondary-200-800"
							onclick={() => {
								ctx.realTimeMapViewState.overlay = null;
							}}
						>
							Fechar
							<Icon icon="mdi:arrow-left" />
						</button>
					</div>
				{/snippet}
			</SelectedTrackerOverlay>
		{/if}
	{/snippet}
</Modal>
