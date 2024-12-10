<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<aside class="card preset-outlined-warning-200-800 flex p-4 items-center space-x-4 my-6">
	<Icon icon="mdi:info" height={24} />

	<p class="type-scale-1">
		Users <b>cannot</b> create other users with a access level containing a permission they do not have.
	</p>
</aside>
