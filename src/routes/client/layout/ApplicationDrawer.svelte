<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import SidebarNavigation from './SidebarNavigation.svelte';
	import UserDisplay from './UserDisplay.svelte';

	interface Props {
		open: boolean;
	}

	let { open }: Props = $props();
</script>

<Modal
	bind:open
	triggerBase="btn preset-tonal"
	contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
	positionerJustify="justify-start"
	positionerAlign=""
	positionerPadding=""
	transitionsPositionerIn={{ x: -480, duration: 200 }}
	transitionsPositionerOut={{ x: -480, duration: 200 }}
>
	{#snippet content()}
		<div class="p-4 flex justify-between space-x-2 items-center">
			<UserDisplay />

			<button class="btn btn-icon btn-icon-sm" onclick={() => (open = false)}>
				<Icon icon="mdi:close" height="24" />
			</button>
		</div>

		<hr />

		<SidebarNavigation />
	{/snippet}
</Modal>
