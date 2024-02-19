<script lang="ts">
	import type { Organization } from '$lib/api/organization.schema';
	import Icon from '@iconify/svelte';
	import CreatedAtText from './CreatedAtText.svelte';

	export let organization: Organization;
</script>

<div class="sm:card sm:p-4 sm:rounded-lg">
	<h3 class="mb-2 text-lg flex items-center justify-between">
		<span class="flex items-center">
			<Icon icon="mdi:company" width="32" height="32" class="mr-2" />
			My Organization
		</span>

		<CreatedAtText date={organization.createdAt} />
	</h3>

	<h1 class="text-2xl mb-1">{organization.name}</h1>

	<div class="mt-4 flex items-center">
		<span class="opacity-80 mr-2">billing email:</span>
		{organization.billingEmail}
	</div>
</div>
