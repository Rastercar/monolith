<script lang="ts">
	import { PUBLIC_IS_DEV } from '$env/static/public';
	import type { apiPermission } from '$lib/constants/permissions';
	import { hasPermission } from '$lib/store/auth.svelte';
	import { onMount } from 'svelte';
	import AccessDenied from './errors/AccessDenied.svelte';

	

	

	
	interface Props {
		/**
	 * The permissions needed to show the main slot
	 */
		requiredPermissions: apiPermission[];
		/**
	 * Debug mode will always show the main slot regardless if the user
	 * contains the permissions or not, but with additional info
	 *
	 * @default false
	 *
	 * @important
	 * USE ONLY IN WHEN DEVELOPING
	 *
	 * [PROD-TODO]
	 * disable this prop when on production (make it be debugMode = debug && ENV === 'dev')
	 */
		debug?: any;
		/**
	 * if when the permissions are lacking, the `AccessDenied` component should
	 * be shown on the `denied` slot
	 */
		accessDeniedComponentAsDefaultDeniedSlot?: boolean;
		children?: import('svelte').Snippet;
		denied?: import('svelte').Snippet;
	}

	let {
		requiredPermissions,
		debug = PUBLIC_IS_DEV,
		accessDeniedComponentAsDefaultDeniedSlot = false,
		children,
		denied
	}: Props = $props();

	onMount(() => {
		// [PROD-TODO]
		// implement a linting rule to disable console logging, make some utils function
		// for dev debug that will only log if the env is 'dev' and only use that function
		// for debug logging
		if (!debug) return;

		if (requiredPermissions.length === 0) {
			console.warn('[DEV] PermissionGuard instantiated with no required permissions');
		} else {
			console.info('[DEV] Permission guard: ', requiredPermissions);
		}
	});

	let hasPermissions = $derived($hasPermission(requiredPermissions));
</script>

<!--
@component
A Guard that blocks the main slot from rendering if the user is not logged in or does
not contain a list of permissions

this can be used on a +layout.svelte to prevent whole pages from rendering

### Important

Any code of the current component importing the `PermissionGuard` will still run, if you have
code that needs to run only if the user is authenticated either move that code to components
that are in the guard or check the authorization yourself
-->
{#if hasPermissions}
	{@render children?.()}
{:else if accessDeniedComponentAsDefaultDeniedSlot}
	{#if denied}{@render denied()}{:else}
		<AccessDenied />
	{/if}
{:else}
	{@render denied?.()}
{/if}
