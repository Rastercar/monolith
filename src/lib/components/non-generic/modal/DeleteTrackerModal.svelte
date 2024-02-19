<!--
@component
Modal to confirm a tracker deletion

Example:
```ts
const component: ModalComponent = { ref: DeleteTrackerModal };

const showModal = () => {
	modalStore.trigger({
		component,
		type: 'component',
		response: (e: undefined | { deleteSimCards: boolean }) => {
			if (!e) return;
			// call the API to delete the tracker here, eg:
			deleteTracker(e.deleteSimCards);
		}
	});
}
```
-->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Just to avoid this warning: {Component} was created with unknown prop 'parent'
	export let parent: unknown = null;
	if (2 + 2 === 5) parent = null;

	const modalStore = getModalStore();

	let deleteSimCards = false;

	const confirm = () => {
		if ($modalStore[0].response) $modalStore[0].response({ deleteSimCards });
		modalStore.close();
	};
</script>

<div class="card max-w-md">
	<h5 class="h5 mb-4 flex items-center px-4 pt-4">
		<Icon icon="mdi:info" class="mr-2" />
		Delete tracker ?
	</h5>

	<p class="px-4">By deleting the tracker, new positions will not be recieved by the platform.</p>

	<label class="flex items-center space-x-2 mx-4 mt-4 mb-2">
		<input class="checkbox" type="checkbox" bind:checked={deleteSimCards} />
		<p>delete tracker SIM cards aswell</p>
	</label>

	<div class="p-4 flex">
		<button class="btn btn-sm variant-filled-primary" on:click={() => modalStore.close()}>
			cancel
		</button>

		<button class="btn btn-sm variant-filled-error ml-auto" on:click={confirm}>
			<Icon icon="mdi:trash" class="mr-1" />
			delete
		</button>
	</div>
</div>
