<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import { getAuthContext } from '$lib/store/context';
	import AccessLevelSection from './components/AccessLevelSection.svelte';
	import OrgSection from './components/OrgSection.svelte';
	import UserSection from './components/UserSection.svelte';

	const auth = getAuthContext();
</script>

{#if auth.user}
	<PageContainer extraClasses="space-y-6">
		<UserSection user={auth.user} />

		<div class="sm:hidden">
			<hr class="hr" />
		</div>

		<OrgSection organization={auth.user.organization} />

		<div class="sm:hidden">
			<hr class="hr" />
		</div>

		<AccessLevelSection accessLevel={auth.user.accessLevel} />
	</PageContainer>
{/if}
