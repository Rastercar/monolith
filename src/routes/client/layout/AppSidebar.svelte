<script>
	import { page } from '$app/state';
	import SidebarNavigation from './SidebarNavigation.svelte';
	import UserDisplay from './UserDisplay.svelte';

	let isInSettingsRoute = $derived(page.url.pathname.includes('/settings'));
</script>

<aside class="hidden lg:block bg-surface-100-900 w-72">
	<div class:hidden={isInSettingsRoute}>
		<UserDisplay classes="pl-5 pr-8 py-6" />
	</div>

	<SidebarNavigation />
</aside>
