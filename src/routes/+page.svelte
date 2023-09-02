<script>
	// TODO: rm me !
	import { apiSignOut } from '$lib/api/auth';
	import Navigation from '$lib/components/navigation/Navigation.svelte';
</script>

home page

<!-- TODO: rm me! -->
<button class="btn variant-filled" on:click={() => apiSignOut()}> oops </button>

<Navigation />
