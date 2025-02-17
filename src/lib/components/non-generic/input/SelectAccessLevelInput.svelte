<script lang="ts">
	import { apiGetAccessLevelsAsSelectOptionsQuery } from '$lib/api/access-level.queries';
	import type { AccessLevel } from '$lib/api/access-level.schema';
	import ServerSideSelectInput from '$lib/components/input/ServerSideSelectInput.svelte';

	interface Props {
		value: string;
		searchValue: string;
		onItemSelected: (_: AccessLevel | null) => void;
	}

	let { value = $bindable(), searchValue = $bindable(), onItemSelected }: Props = $props();

	const query = apiGetAccessLevelsAsSelectOptionsQuery({
		get name() {
			return searchValue;
		}
	});
</script>

<ServerSideSelectInput
	bind:value
	bind:searchValue
	{query}
	onItemSelected={(i) => onItemSelected(i?.original ?? null)}
/>
