<script lang="ts">
	import ArrowUpTooltip from '$lib/components/tooltip/ArrowUpTooltip.svelte';
	import type { apiPermission } from '$lib/constants/permissions';
	import { hasPermission } from '$lib/store/auth';
	import { popup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import AccessDenied from './errors/AccessDenied.svelte';

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
	export let debug = false;

	onMount(() => {
		// [PROD-TODO]
		// implement a linting rule to disable console logging, make some utils function
		// for dev debug that will only log if the env is 'dev' and only use that function
		// for debug logging
		if (debug && requiredPermissions.length === 0) {
			console.warn('[DEV] PermissionGuard instantiated with no required permissions');
		}
	});

	$: hasPermissions = $hasPermission(requiredPermissions);

	$: debugWrapperClasses = `border-2 border-dashed ${
		hasPermissions ? 'border-green-500' : 'border-red-500'
	} m-[-2px]`;
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
{#if debug}
	<div
		class={debugWrapperClasses}
		use:popup={{ event: 'click', target: 'debugPopup', placement: 'top' }}
	>
		<slot />
	</div>

	<ArrowUpTooltip dataPopup="debugPopup">
		<span class="block mb-1">required permissions:</span>

		<ul class="text-sm">
			{#each requiredPermissions as perm}
				<li>
					{perm}
				</li>
			{/each}
		</ul>
	</ArrowUpTooltip>
{:else if hasPermissions}
	<slot />
{:else if showDeniedSlot}
	<slot name="denied">
		<AccessDenied />
	</slot>
{/if}
