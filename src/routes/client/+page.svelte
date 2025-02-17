<script lang="ts">
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import Card from '../components/Card.svelte';
	import CardDescription from '../components/CardDescription.svelte';
	import CardLink from '../components/CardLink.svelte';
	import MapCard from '../components/MapCard.svelte';
</script>

<PageContainer maxW="max-w-6xl">
	<div
		class="grid gap-4 sm:grid-cols-4 sm:grid-rows-4 md:grid-cols-3 md:grid-rows-3 lg:grid-cols-4 lg:grid-rows-4"
	>
		<MapCard />

		<Card
			icon="mdi:car"
			title="Vehicles"
			topBorderColor="border-t-green-800 hover:border-green-800"
		>
			<CardDescription>Register, update, delete and manage your vehicles</CardDescription>
			<CardLink href="/client/tracking/vehicles">go to vehicles page</CardLink>
		</Card>

		<Card
			icon="mdi:car-multiple"
			title="Fleets"
			topBorderColor="border-t-green-800 hover:border-green-800"
		>
			<CardDescription>Create and manage fleets to group vehicles</CardDescription>
			<CardLink href="/client/tracking/fleets">go to fleets page</CardLink>
		</Card>

		<Card
			icon="mdi:cellphone"
			title="Trackers"
			topBorderColor="border-t-blue-800 hover:border-blue-800"
		>
			<CardDescription>
				Register, update, configure delete and manage your vehicle trackers
			</CardDescription>

			<CardLink href="/client/tracking/trackers">go to trackers page</CardLink>
		</Card>

		<Card icon="mdi:sim" title="Sim Cards" topBorderColor="border-t-blue-800 hover:border-blue-800">
			<CardDescription>
				Register, update delete and manage SIM cards used within trackers trackers
			</CardDescription>

			<CardLink href="/client/tracking/sim-cards">go to sim cards page</CardLink>
		</Card>

		<Card
			icon="mdi:user"
			title="Users"
			topBorderColor="border-t-orange-800 hover:border-orange-800"
		>
			<CardDescription>Manage users within your organization</CardDescription>

			<CardLink href="/client/tracking/sim-cards">go to users page</CardLink>
		</Card>

		<Card
			icon="mdi:shield"
			title="Access Levels"
			topBorderColor="border-t-orange-800 hover:border-orange-800"
		>
			<CardDescription>
				Manage the access levels of users within your organization, granting or limiting access to
				platform features
			</CardDescription>

			<CardLink href="/client/access-levels">go to access levels page</CardLink>
		</Card>
	</div>
</PageContainer>
