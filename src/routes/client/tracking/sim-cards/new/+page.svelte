<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import CreateSimCardForm from '$lib/components/non-generic/form/CreateSimCardForm.svelte';
	import { getToaster } from '$lib/store/toaster';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const toast = getToaster();
</script>

<PermissionGuard requiredPermissions={['CREATE_SIM_CARD']}>
	<div class="p-6 max-w-4xl mx-auto">
		<TitleAndBreadCrumbsPageHeader
			title="create sim card"
			breadCrumbs={[
				{ href: '/client', icon: 'mdi:home', text: 'home' },
				{ text: 'tracking' },
				{ href: '/client/tracking/sim-cards', icon: 'mdi:sim', text: 'sim cards' },
				{ href: '/client/tracking/sim-cards/new', text: 'new' }
			]}
		/>

		<hr class="my-4" />

		<CreateSimCardForm
			formSchema={data.createSimCardForm}
			on:sim-card-created={() => toast.success('SIM card created')}
		/>
	</div>
</PermissionGuard>
