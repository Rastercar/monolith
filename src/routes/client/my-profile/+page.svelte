<script>
	import { authStore } from '$lib/store/auth';
	import AccessLevelSection from './components/access-level-section.svelte';
	import OrgSection from './components/org-section.svelte';
	import UserSection from './components/user-section.svelte';
</script>

{#if $authStore.user}
	<div class="p-6 max-w-4xl mx-auto space-y-6">
		<UserSection user={$authStore.user} />

		<div class="sm:hidden">
			<hr />
		</div>

		<OrgSection organization={$authStore.user.organization} />

		<div class="sm:hidden">
			<hr />
		</div>

		<AccessLevelSection accessLevel={$authStore.user.accessLevel} />
	</div>
{/if}
