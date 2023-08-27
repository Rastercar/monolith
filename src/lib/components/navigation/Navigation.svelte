<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();
	const closeDrawer = () => drawerStore.close();
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={closeDrawer}>Homepage</a></li>
		<li><a href="/about" on:click={closeDrawer}>About</a></li>
		<li><a href="/blog" on:click={closeDrawer}>Blog</a></li>
		<li><a href="/contact" on:click={closeDrawer}>Contact</a></li>
	</ul>
</nav>
