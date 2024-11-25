<script lang="ts">
	import type { apiPermission } from '$lib/constants/permissions';
	import { getAuthContext } from '$lib/store/auth.svelte';
	import Icon from '@iconify/svelte';
	import { type Snippet } from 'svelte';

	interface Props {
		/**
		 * The permissions needed to show the main slot
		 */
		requiredPermissions?: apiPermission | apiPermission[];

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
		debug?: boolean;

		denied?: Snippet;
		children: Snippet;
	}

	let { denied, children, requiredPermissions }: Props = $props();

	const auth = getAuthContext();

	let hasPermissions = requiredPermissions ? auth.hasPermission(requiredPermissions) : true;
</script>

<!--
@component
A Guard that blocks the main slot from rendering if the user is not logged in or does
not contain a list of permissions

### Important
Any code of the current component importing the `PermissionGuard` will still run, if you have
code that needs to run only if the user is authenticated either move that code to components
that are in the guard or check the authorization yourself
-->
{#if hasPermissions}
	{@render children()}
{:else if denied}{@render denied()}{:else}
	<div
		class="flex items-center space-x-2 p-2 border-dashed border-error-600-400 text-error-600-400"
	>
		<Icon icon="mdi:error" height={20} />
		<p>access denied</p>
	</div>
{/if}
