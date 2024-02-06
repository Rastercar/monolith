<script lang="ts">
	import Breadcrumbs from '$lib/components/breadcrumbs/BreadCrumbs.svelte';
	import type { PageData } from './$types';
	import CreateVehicleForm from './components/CreateVehicleForm.svelte';

	export let data: PageData;
</script>

<div class="flex mb-4 items-center">
	<h1 class="h2 mr-auto">create vehicle</h1>

	<div class="ml-auto">
		<Breadcrumbs
			breadCrumbs={[
				{ href: '/client', icon: 'mdi:home', text: 'home' },
				{ text: 'tracking' },
				{ href: '/client/tracking/vehicles', icon: 'mdi:car', text: 'vehicles' },
				{ href: '/client/tracking/vehicles/new', text: 'new' }
			]}
		/>
	</div>
</div>

<hr class="my-4" />

<CreateVehicleForm formSchema={data.createVehicleForm} />
