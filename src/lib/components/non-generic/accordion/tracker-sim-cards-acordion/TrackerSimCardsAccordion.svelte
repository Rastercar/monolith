<script lang="ts">
	import { apiDeleteSimCard, apiUpdateSimCard } from '$lib/api/sim-card';
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import type { Tracker } from '$lib/api/tracker.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import UpdateSimCardForm from '$lib/components/non-generic/form/UpdateSimCardForm.svelte';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import { showErrorToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		tracker: Tracker;

		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;
	}

	let { tracker = $bindable(), createSimCardForm, updateSimCardForm }: Props = $props();

	let editMode = $state(false);

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	const removeSimCardMutation = createMutation(() => ({
		mutationFn: (simCardId: number) => apiUpdateSimCard(simCardId, { vehicleTrackerId: null }),
		onError: showErrorToast
	}));

	const deleteSimCardMutation = createMutation(() => ({
		mutationFn: (simCardId: number) => apiDeleteSimCard(simCardId),
		onError: showErrorToast
	}));

	// TODO:
	// const removeSimCardFromDisplay = (id: number) => {
	// 	simCards = (simCards ?? []).filter((sim) => sim.id !== id);
	// };

	const removeSimCard = async (id: number) => {
		if (!confirm('Remove the SIM card from the tracker ?')) return;

		await removeSimCardMutation.mutateAsync(id);
		// removeSimCardFromDisplay(id);
	};

	const deleteSimCard = async (id: number) => {
		if (!confirm('Permanently delete this SIM card ?')) return;

		await deleteSimCardMutation.mutateAsync(id);
		// removeSimCardFromDisplay(id);
	};

	// const appendSimCard = (e: CustomEvent<SimCard>) => {
	// 	simCards = [...(simCards ?? []), e.detail];
	// };

	const max = (a: number, b: number) => (a < b ? b : a);

	let simCardAmount = $derived(tracker.simCards?.length || 0);

	// if somehow the tracker has more SIM cards than allowed, show it anyway so it can be removed
	let slotsToShow = $derived(max(simCardAmount, supportedSimCards));
</script>

{#snippet field(label: string, value: string | null)}
	<div class="block"><span class="opacity-80">{label}:</span> {value}</div>
{/snippet}

<div class="flex mb-4 justify-between items-center px-4">
	<span>SIM cards:</span>
	<span class="type-scale-1 opacity-70">
		{tracker.simCards?.length || 0} / {supportedSimCards} Slots
	</span>
</div>

<Accordion collapsible multiple>
	{#each { length: slotsToShow } as _, i}
		{@const simForSlot = tracker.simCards?.[i] ?? null}

		<Accordion.Item
			value={`sim-${simForSlot?.id ?? 0}-slot-${i + 1}`}
			controlClasses="bg-surface-200-800"
			panelPadding="p-0"
		>
			{#snippet control()}
				<div class="flex items-center">
					<div class="flex items-center">
						<Icon icon={simForSlot ? 'mdi:sim' : 'mdi:sim-off'} class="mr-4" />

						{#if simForSlot}
							<div class="text-sm">
								<span class="block">{simForSlot.phoneNumber}</span>
								<span class="block">{simForSlot.apnAddress}</span>
							</div>
						{:else}
							Empty slot
						{/if}
					</div>

					<span class="type-scale-2 ml-auto opacity-75">SLOT {i + 1}</span>
				</div>
			{/snippet}

			{#snippet panel()}
				<div>
					{#if simForSlot}
						{#if !editMode}
							<div class="px-4 py-4">
								<div class="grid grid-cols-2 md:grid-cols-4 mb-4 gap-2 text-sm">
									{@render field('SSN', simForSlot.ssn)}
									{@render field('APN User', simForSlot.apnUser)}
									{@render field('APN Address', simForSlot.apnAddress)}
									{@render field('APN Password', simForSlot.apnPassword)}
									{@render field('PIN 1', simForSlot.pin)}
									{@render field('PIN 2', simForSlot.pin2)}
									{@render field('PUK 1', simForSlot.puk)}
									{@render field('PUK 2', simForSlot.puk2)}
									{@render field('Created At', new Date(simForSlot.createdAt).toLocaleDateString())}
								</div>

								<div class="flex">
									<PermissionGuard requiredPermissions={'UPDATE_TRACKER'}>
										<button
											class="btn preset-filled-warning-200-800 mr-3"
											onclick={() => removeSimCard(simForSlot.id)}
										>
											<Icon icon="mdi:close" />
											remove
										</button>
									</PermissionGuard>

									<PermissionGuard requiredPermissions={'DELETE_SIM_CARD'}>
										<button
											class="btn preset-filled-warning-200-800"
											onclick={() => {
												deleteSimCard(simForSlot.id);
											}}
										>
											<Icon icon="mdi:trash" />
											delete
										</button>
									</PermissionGuard>

									<PermissionGuard requiredPermissions={'UPDATE_SIM_CARD'}>
										<button
											class="btn preset-filled-primary-200-800 ml-auto"
											onclick={() => {
												editMode = true;
											}}
										>
											<Icon icon="mdi:pencil" />
											edit
										</button>
									</PermissionGuard>
								</div>
							</div>
						{:else}
							<div class="flex px-4 pt-4 justify-end">
								<button
									class="btn preset-filled-primary-200-800"
									onclick={() => {
										editMode = false;
									}}
								>
									<Icon icon="mdi:pencil-off" />
									cancel edit
								</button>
							</div>

							<UpdateSimCardForm
								extraClasses="p-4"
								simCard={simForSlot}
								formSchema={updateSimCardForm}
								onUpdate={() => {
									editMode = false;
									// TODO:
									// if (simCards) simCards[i] = updatedCard;
								}}
							/>
						{/if}
					{:else}
						<div class="p-4">
							<PermissionGuard requiredPermissions={['CREATE_SIM_CARD', 'UPDATE_SIM_CARD']}>
								<!-- <SimCardChooser
									{tracker}
									slotNumber={i + 1}
									formSchema={createSimCardForm}
									on:sim-card-created={appendSimCard}
									on:sim-card-selected={appendSimCard}
								/> -->

								TODO?
								{#snippet denied()}
									<span class="text-error-400-500-token">
										you lack the permissions to set or create a tracker sim card
									</span>
								{/snippet}
							</PermissionGuard>
						</div>
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>
