<script lang="ts">
	import type { apiPermission } from '$lib/constants/permissions';
	import { authStore as au } from '$lib/store/auth';
	import AccessDenied from './errors/access-denied.svelte';

	/**
	 * The permissions needed to show the main slot
	 */
	export let requiredPermissions: apiPermission[];

	/**
	 * If the denied slot should be show if the user does not have the required permissions
	 *
	 * @default false
	 */
	export let showDeniedSlot = false;
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
{#if requiredPermissions.every((p) => $au.user && $au.user.accessLevel.permissions.includes(p))}
	<slot />
{:else if showDeniedSlot}
	<slot name="denied">
		<AccessDenied />
	</slot>
{/if}
