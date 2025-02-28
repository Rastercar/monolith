<script lang="ts">
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import AccessLevelPermissionsInfo from '$lib/components/non-generic/info/AccessLevelPermissionsInfo.svelte';
	import Icon from '@iconify/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		accessLevel: AccessLevel;
	}

	let { accessLevel }: Props = $props();
</script>

<div class="card preset-filled-surface-100-900">
	<Accordion multiple>
		<Accordion.Item value="access-level" panelRounded="p-0">
			{#snippet control()}
				<div class="flex items-center py-2">
					<Icon icon="mdi:shield" width="32" height="32" class="mr-2" />
					Nível de Acesso e Permissões
				</div>
			{/snippet}

			{#snippet panel()}
				<div class="sm:px-0 py-1">
					<h4 class="text-lg">
						<span class="opacity-80 mt-2">Nível de Acesso:</span>
						{accessLevel.name}
					</h4>

					<h4 class="opacity-90 text-sm line-clamp-4 mb-2">
						{accessLevel.description}
					</h4>

					<hr class="hr my-4" />

					<AccessLevelPermissionsInfo {accessLevel} />
				</div>
			{/snippet}
		</Accordion.Item>
	</Accordion>
</div>
