<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<aside class="alert variant-ghost-primary my-6">
	<div>
		<Icon icon="mdi:info" height={24} />
	</div>

	<div class="alert-message">
		<p class="text-sm">
			Users <b>cannot</b> create other users with a access level containing a permission they do not
			have.
		</p>
	</div>
</aside>
