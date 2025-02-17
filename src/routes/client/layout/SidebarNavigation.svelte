<script lang="ts">
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import NavList, { type Route } from './NavList.svelte';

	interface Props {
		onRouteClick?: VoidFunction;
	}

	const { onRouteClick }: Props = $props();

	const routes: Route[] = [
		{
			href: '/client',
			label: 'home',
			icon: 'mdi:home'
		},
		{
			href: '/client/tracking/map',
			label: 'map',
			icon: 'mdi:map'
		},
		{
			href: '/client/my-profile',
			label: 'my profile',
			icon: 'mdi:account'
		},
		{
			href: '/client/users',
			label: 'users',
			icon: 'mdi:account-multiple'
		},
		{
			href: '/client/access-levels',
			label: 'access levels',
			icon: 'mdi:shield'
		},
		{
			href: '/client/tracking/vehicles',
			label: 'vehicles',
			icon: 'mdi:car'
		},
		{
			href: '/client/tracking/fleets',
			label: 'Fleets',
			icon: 'mdi:car-multiple'
		},
		{
			href: '/client/tracking/trackers',
			label: 'trackers',
			icon: 'mdi:cellphone'
		},
		{
			href: '/client/tracking/sim-cards',
			label: 'SIM cards',
			icon: 'mdi:sim'
		}
	];

	const settingsRoutes: Route[] = [
		{
			href: '/client/settings/profile',
			label: 'profile',
			icon: 'mdi:account-edit'
		},
		{
			href: '/client/settings/organization',
			label: 'organization',
			icon: 'mdi:building'
		},
		{
			href: '/client/settings/sessions',
			label: 'sessions',
			icon: 'mdi:access-point'
		},
		{
			href: '/client/settings/security',
			label: 'password / security',
			icon: 'mdi:shield-account'
		}
	];

	let isInSettingsRoute = $derived(page.url.pathname.includes('/settings'));
</script>

<aside>
	{#if isInSettingsRoute}
		<span class="block mt-8 px-5 type-scale-4">Account Settings</span>

		<div class="px-5">
			<hr class="hr border-t-2 mt-6 mb-8" />
		</div>

		<NavList
			routes={settingsRoutes.map((r) => ({ ...r, closeSidebarOnClick: true }))}
			{onRouteClick}
		/>

		<div class="flex justify-end">
			<a href="/client/my-profile" class="btn preset-filled-primary-500 mx-4 my-4">
				<Icon icon="mdi:arrow-left" class="mr-2" />
				exit settings
			</a>
		</div>
	{:else}
		<NavList routes={routes.map((r) => ({ ...r, closeSidebarOnClick: true }))} {onRouteClick} />

		<div class="px-5">
			<hr class="hr border-t-2 my-4" />
		</div>

		<NavList
			routes={[{ href: '/client/settings/profile', icon: 'mdi:settings', label: 'settings' }]}
		/>
	{/if}
</aside>
