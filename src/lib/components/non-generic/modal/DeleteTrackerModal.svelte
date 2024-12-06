<script lang="ts">
	import type { PropsWithChildren } from '$lib/utils/svelte';
	import Icon from '@iconify/svelte';
	import { Dialog } from 'bits-ui';

	interface Props extends PropsWithChildren {
		onDeleteConfirmed: (withSimCards: boolean) => void;
	}

	const { children, onDeleteConfirmed }: Props = $props();

	let deleteSimCards = $state(false);

	let open = $state(false);

	// reset deleteSimCards to false when the dialog is re-opened
	$effect(() => {
		if (open) deleteSimCards = false;
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{@render children()}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/60" />

		<Dialog.Content
			interactOutsideBehavior="ignore"
			class="card preset-filled-surface-200-800 fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] outline-none sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title class="h5 flex items-center p-4">
				<Icon icon="mdi:info" class="mr-2" />
				Delete tracker ?
			</Dialog.Title>

			<Dialog.Description class="type-scale-2 px-4">
				By deleting the tracker, new positions will not be recieved by the platform.
			</Dialog.Description>

			<label class="flex items-center px-4 my-4 space-x-2">
				<input class="checkbox" type="checkbox" bind:checked={deleteSimCards} />
				<p>also delete tracker SIM cards</p>
			</label>

			<div class="p-4 flex">
				<Dialog.Close>
					<button class="btn preset-filled-primary-200-800">cancel</button>
				</Dialog.Close>

				<button
					class="btn preset-filled-warning-200-800 ml-auto"
					onclick={() => {
						onDeleteConfirmed(deleteSimCards);
						open = false;
					}}
				>
					<Icon icon="mdi:trash" />
					delete
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
