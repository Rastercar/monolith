<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import NavList, { type Route } from './NavList.svelte';

	const routes: Route[] = [
		{
			href: '/client',
			label: 'home',
			icon: 'mdi:home'
		},
		{
			href: '/client/my-profile',
			label: 'my profile',
			icon: 'mdi:account'
		}
	];

	const settingsRoutes: Route[] = [
		{
			href: '/client/settings/profile',
			label: 'profile',
			icon: 'mdi:account-edit'
		},
		{
			// TODO:
			// what i want here is to have a single place to define the required permissions for a given href (eg: /foo/bar, /foo/bar/4/*)
			// to avoid mistakes between route navigation protection and UI link protection.
			href: '/client/settings/organization',
			label: 'organization',
			icon: 'mdi:building',
			requiredPermissions: ['UPDATE_ORGANIZATION']
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

		<NavList routes={settingsRoutes.map((r) => ({ ...r, closeSidebarOnClick: true }))} />
	{:else}
		<NavList routes={routes.map((r) => ({ ...r, closeSidebarOnClick: true }))} />

		<hr class="my-4" />

		<NavList
			routes={[{ href: '/client/settings/profile', icon: 'mdi:settings', label: 'settings' }]}
		/>
	{/if}
</div>
