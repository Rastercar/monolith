<script lang="ts">
	import Icon from '@iconify/svelte';

	export let vehicleId: number;
</script>

<div class="flex align-middle justify-center">
	<a href={`/client/tracking/vehicles/${vehicleId}`}>
		<button class="btn-icon">
			<Icon icon="mdi:info" width={24} />
		</button>
	</a>
</div>
