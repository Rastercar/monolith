<script lang="ts">
	import {
		apiDeleteSimCardByIdMutation,
		apiUpdateSimCardMutation
	} from '$lib/api/sim-card.queries';
	import type { createSimCardSchema, updateSimCardSchema } from '$lib/api/sim-card.schema';
	import type { Tracker } from '$lib/api/tracker.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import UpdateSimCardForm from '$lib/components/non-generic/form/UpdateSimCardForm.svelte';
	import { trackerModelsDetails } from '$lib/constants/tracker-models';
	import { showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SimCardChooser from './SimCardChooser.svelte';

	interface Props {
		tracker: Tracker;

		createSimCardForm: SuperValidated<Infer<typeof createSimCardSchema>>;
		updateSimCardForm: SuperValidated<Infer<typeof updateSimCardSchema>>;
	}

	let { tracker = $bindable(), createSimCardForm, updateSimCardForm }: Props = $props();

	let editMode = $state(false);

	const supportedSimCards = trackerModelsDetails[tracker.model].supportedSimCards;

	const updateSimCardMutation = apiUpdateSimCardMutation();

	const deleteSimCardMutation = apiDeleteSimCardByIdMutation();

	const removeSimFromTracker = (id: number) => {
		tracker.simCards = (tracker.simCards ?? []).filter((s) => s.id !== id);
	};

	const removeSimCard = (id: number) => {
		if (!confirm('Remove the SIM card from the tracker ?')) return;
		updateSimCardMutation
			.mutateAsync({ id, body: { vehicleTrackerId: null } })
			.then(() => removeSimFromTracker(id));
	};

	const deleteSimCard = (id: number) => {
		if (!confirm('Permanently delete this SIM card ?')) return;
		deleteSimCardMutation.mutateAsync(id).then(() => removeSimFromTracker(id));
	};

	let simCardAmount = $derived(tracker.simCards?.length || 0);

	// if somehow the tracker has more SIM cards than allowed, show it anyway so it can be removed
	let slotsToShow = $derived(Math.max(simCardAmount, supportedSimCards));
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

								<div class="flex flex-col-reverse md:flex-row gap-4">
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

									<PermissionGuard requiredPermissions={'UPDATE_TRACKER'}>
										<button
											class="btn preset-filled-warning-200-800"
											onclick={() => removeSimCard(simForSlot.id)}
										>
											<Icon icon="mdi:close" />
											remove
										</button>
									</PermissionGuard>

									<PermissionGuard requiredPermissions={'UPDATE_SIM_CARD'}>
										<button
											class="btn preset-filled-primary-200-800 md:ml-auto"
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
								simCardId={simForSlot.id}
								initialValues={simForSlot}
								formSchema={updateSimCardForm}
								onUpdate={(updatedSimCard) => {
									editMode = false;
									if (tracker.simCards) {
										// hack to avoid firing invalid ownership warning
										const sims = [...tracker.simCards];
										sims[i] = updatedSimCard;
										tracker.simCards = sims;
									}
								}}
							/>
						{/if}
					{:else}
						<div class="p-4">
							<PermissionGuard requiredPermissions={['CREATE_SIM_CARD', 'UPDATE_TRACKER']}>
								<SimCardChooser
									{tracker}
									simSlot={i + 1}
									createSimCardFormSchema={createSimCardForm}
									updateSimCardFormSchema={updateSimCardForm}
									onSimCardCreated={(s) => {
										showSuccessToast('new SIM card added to tracker');
										tracker.simCards?.push(s);
									}}
									onSimCardSelected={(s) => {
										showSuccessToast('SIM card added to tracker');
										tracker.simCards?.push(s);
									}}
								/>

								{#snippet denied()}
									<span class="text-error-300-700">
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
