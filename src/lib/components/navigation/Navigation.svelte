<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	let clazz: string = '';
	export { clazz as class };

	const drawerStore = getDrawerStore();
	const closeDrawer = () => drawerStore.close();
</script>

<nav class={`list-nav ${clazz || ''}`} data-sveltekit-preload-data="off">
	<ul>
		<li><a href="/" on:click={closeDrawer}>Home</a></li>
		<li><a href="/client" on:click={closeDrawer}>Client</a></li>
		<li><a href="/auth/sign-in" on:click={closeDrawer}>Sign In</a></li>
	</ul>
</nav>
