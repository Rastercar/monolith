<script lang="ts">
	import { getModalStore, type ModalComponent } from '@skeletonlabs/skeleton';
	import MyCustomComponent from './xd.svelte';

	const modalStore = getModalStore();

	const component: ModalComponent = { ref: MyCustomComponent };
</script>

<button class="btn" on:click={() => modalStore.trigger({ type: 'component', component })}>
	lmaooo
</button>
