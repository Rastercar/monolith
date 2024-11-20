<script lang="ts">
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import TitleAndBreadCrumbsPageHeader from '$lib/components/layout/TitleAndBreadCrumbsPageHeader.svelte';
	import type { PageData } from './$types';
	import CreateVehicleForm from './components/CreateVehicleForm.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<PermissionGuard requiredPermissions={['CREATE_VEHICLE']}>
	<div class="p-6 max-w-4xl mx-auto">
		<TitleAndBreadCrumbsPageHeader
			title="create vehicle"
			breadCrumbs={[
				{ href: '/client', icon: 'mdi:home', text: 'home' },
				{ text: 'tracking' },
				{ href: '/client/tracking/vehicles', icon: 'mdi:car', text: 'vehicles' },
				{ href: '/client/tracking/vehicles/new', text: 'new' }
			]}
		/>

		<hr class="my-4" />

		<CreateVehicleForm formSchema={data.createVehicleForm} />
	</div>
</PermissionGuard>
