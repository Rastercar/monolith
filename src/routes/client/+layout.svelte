<script lang="ts">
	import { page } from '$app/state';
	import { routesMeta, type LoggedInPageMeta } from '$lib/routes-meta';
	import { getAuthContext, getLayoutContext } from '$lib/store/context';
	import AppHeader from './layout/AppHeader.svelte';
	import ApplicationDrawer from './layout/ApplicationDrawer.svelte';
	import AppSidebar from './layout/AppSidebar.svelte';

	let { children, data } = $props();

	const layoutContext = getLayoutContext();

	layoutContext.availableThemes = data.availableThemes;

	const defaultLoggedInRouteMeta: LoggedInPageMeta = { requiredAuth: 'logged-in' };

	// on previous versions we loaded the route meta on +layout.server.ts
	// and accessed it on $props().data, but on a client side page navigation
	// the layout load function would not run and the route meta would be the route of
	// the previous page, this whacky is not ideal as we load every route meta
	// just to get the one of the current page, but at least it works
	const { headerVisibility = true, sidebarVisibility = true } = $derived.by(() => {
		const currentPageMeta = routesMeta[page.url.pathname as keyof typeof routesMeta] as
			| LoggedInPageMeta
			| undefined;

		return currentPageMeta ?? defaultLoggedInRouteMeta;
	});

	const auth = getAuthContext();

	auth.setUser(data.user);
</script>

<svelte:head>{@html data.orgThemeStyleTag}</svelte:head>

<div
	class:grid-rows-[1fr]={!headerVisibility}
	class:grid-rows-[auto_1fr]={headerVisibility}
	class="grid h-screen"
>
	<!-- Header -->
	{#if headerVisibility}
		<AppHeader />
	{/if}

	<!-- Page Content Layout -->
	<div
		class:lg:grid-cols-[1fr]={!sidebarVisibility}
		class:lg:grid-cols-[auto_1fr]={sidebarVisibility}
		class="grid grid-cols-1"
	>
		<!-- Sidebar -->
		{#if sidebarVisibility}
			<AppSidebar />
		{/if}

		<!-- Page Content -->
		<main>
			<ApplicationDrawer />
			{@render children()}
		</main>
	</div>
</div>
