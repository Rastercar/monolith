<script lang="ts">
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.setAttribute("data-theme", "rocket")
	})
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Skeleton</strong>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<slot />
</AppShell>
