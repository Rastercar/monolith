<script lang="ts">
	import { getAuthContext } from '$lib/store/auth.svelte';
	import AccessLevelSection from './components/AccessLevelSection.svelte';
	import OrgSection from './components/OrgSection.svelte';
	import UserSection from './components/UserSection.svelte';

	const auth = getAuthContext();
</script>

{#if auth.user}
	<div class="p-6 max-w-4xl mx-auto space-y-6">
		<UserSection user={auth.user} />

		<div class="sm:hidden">
			<hr />
		</div>

		<OrgSection organization={auth.user.organization} />

		<div class="sm:hidden">
			<hr />
		</div>

		<AccessLevelSection accessLevel={auth.user.accessLevel} />
	</div>
{/if}
