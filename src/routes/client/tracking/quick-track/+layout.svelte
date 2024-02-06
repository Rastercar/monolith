<script lang="ts">
	import PermissionGuard from '$lib/components/guard/permission-guard.svelte';
</script>

<PermissionGuard
	requiredPermissions={[
		// Needed for the first step
		'CREATE_VEHICLE',

		// Needed for setting the vehicle tracker to a new one
		'CREATE_TRACKER',

		// Needed for adding SIM cards to the vehicle tracker
		'CREATE_SIM_CARD',

		// Needed for setting a SIM card tracker to be the selected/created one
		'UPDATE_SIM_CARD',

		// Needed for deleting SIM cards to free the tracker slots
		'DELETE_SIM_CARD',

		// Needed for setting the vehicle tracker to a existing one
		'UPDATE_TRACKER'
	]}
	showDeniedSlot
>
	<div class="p-6 max-w-3xl mx-auto">
		<slot />
	</div>
</PermissionGuard>
