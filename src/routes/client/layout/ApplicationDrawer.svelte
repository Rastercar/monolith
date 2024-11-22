<script lang="ts">
	import { navigationDrawerState } from '$lib/store/layout-store.svelte';
	import Icon from '@iconify/svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import SidebarNavigation from './SidebarNavigation.svelte';
	import UserDisplay from './UserDisplay.svelte';
</script>

<Modal
	bind:open={navigationDrawerState.open}
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

			<button class="btn btn-icon" onclick={() => (navigationDrawerState.open = false)}>
				<Icon icon="mdi:close" class="h-8 w-8" />
			</button>
		</div>

		<SidebarNavigation />
	{/snippet}
</Modal>
