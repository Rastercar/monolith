<script lang="ts">
	import Icon from '@iconify/svelte';

	export let href: string;
</script>

<div class="flex align-middle justify-center">
	<a {href}>
		<button class="btn-icon">
			<Icon icon="mdi:info" width={24} />
		</button>
	</a>
</div>
