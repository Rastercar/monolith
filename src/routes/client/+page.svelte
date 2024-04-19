<script lang="ts">
	import { authStore } from '$lib/store/auth';
	import Icon from '@iconify/svelte';
	import PositionGraphCard from './components/position-graph-card.svelte';

	$: ({ user } = $authStore);
</script>

<div class="p-10 space-y-4">
	<!--
		TODO: 
		this should be a dashboard but it would need a lot of features to exist
		leave it as is for now
	-->
	<h1>Wellcome: {user?.username}</h1>

	<hr />

	<PositionGraphCard />

	<div class="flex gap-4">
		<div class="card p-4">
			<a href="/client/tracking/vehicles">
				<button class="btn btn-sm variant-filled-primary">
					<Icon icon="mdi:car" class="mr-2" />
					Vehicles
				</button>
			</a>
		</div>

		<div class="card p-4">
			<a href="/client/my-profile">
				<button class="btn btn-sm variant-filled-primary">
					<Icon icon="mdi:user" class="mr-2" />
					My Profile
				</button>
			</a>
		</div>

		<div class="card p-4">
			<a href="/client/tracking/quick-track">
				<button class="btn btn-sm variant-filled-primary">
					<Icon icon="mdi:car" class="mr-2" />
					Track something new !
				</button>
			</a>
		</div>
	</div>
</div>
