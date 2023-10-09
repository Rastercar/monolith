<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import NavList from './NavList.svelte';

	const drawerStore = getDrawerStore();

	interface Route {
		href: string;
		icon: string;
		label: string;
	}

	const routes: Route[] = [
		{ href: '/client', label: 'home', icon: 'mdi:home' },
		{ href: '/client/my-profile', label: 'my profile', icon: 'mdi:account' }
	];

	const settingsRoutes: Route[] = [
		{ href: '/client/profile', label: 'profile', icon: 'mdi:account-edit' },
		{ href: '/client/sessions', label: 'sessions', icon: 'mdi:access-point' }
	];

	$: isInSettingsRoute = $page.url.pathname.includes('/settings');
</script>

<div class="mt-4">
	{#if isInSettingsRoute}
		<div class="flex justify-end">
			<a
				href="/client"
				class="btn btn-sm variant-filled mx-4 mb-4"
				data-sveltekit-preload-data="off"
			>
				<Icon icon="mdi:arrow-left" class="mr-2" />
				exit settings
			</a>
		</div>

		<NavList routes={settingsRoutes} />
	{:else}
		<NavList {routes} />

		<hr class="my-4" />

		<NavList routes={[{ href: '/client/settings', icon: 'mdi:settings', label: 'settings' }]} />
	{/if}
</div>
