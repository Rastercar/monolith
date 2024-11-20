<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import AccessLevelPermissionsInfo from '$lib/components/non-generic/info/AccessLevelPermissionsInfo.svelte';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	interface Props {
		accessLevel: AccessLevel;
	}

	let { accessLevel }: Props = $props();
</script>

<div class="sm:card sm:rounded-lg">
	<Accordion padding="py-2" spacing="space-y-4">
		<AccordionItem open regionControl="bg-surface-200-700-token px-4" spacing="space-y-3">
			{#snippet summary()}
					
					<div class="flex items-center py-2">
						<Icon icon="mdi:shield" width="32" height="32" class="mr-2" />
						Role and Permissions
					</div>
				
					{/snippet}

			{#snippet content()}
					
					<div class="sm:px-4 py-2">
						<h4 class="text-lg">
							<span class="opacity-80 mt-2">Access Level:</span>
							{accessLevel.name}
						</h4>

						<h4 class="opacity-90 text-sm line-clamp-4 mb-2">
							{accessLevel.description}
						</h4>

						<hr class="my-4" />

						<AccessLevelPermissionsInfo {accessLevel} />
					</div>
				
					{/snippet}
		</AccordionItem>
	</Accordion>
</div>
