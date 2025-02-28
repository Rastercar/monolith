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
			title="Veículos"
			topBorderColor="border-t-green-800 hover:border-green-800"
		>
			<CardDescription>Cadastro e gerência seus veículos</CardDescription>
			<CardLink href="/client/rastreamento/veiculos">ir a página de veículos</CardLink>
		</Card>

		<Card
			icon="mdi:car-multiple"
			title="Frotas"
			topBorderColor="border-t-green-800 hover:border-green-800"
		>
			<CardDescription>Cadastro e gerência de frotas</CardDescription>
			<CardLink href="/client/rastreamento/frotas">ir a página de frotas</CardLink>
		</Card>

		<Card
			icon="mdi:cellphone"
			title="Rastreadores"
			topBorderColor="border-t-blue-800 hover:border-blue-800"
		>
			<CardDescription>Cadastro e gerência de rastreadores</CardDescription>

			<CardLink href="/client/rastreamento/rastreadores">ir a página de rastreadores</CardLink>
		</Card>

		<Card
			icon="mdi:sim"
			title="Cartões SIM"
			topBorderColor="border-t-blue-800 hover:border-blue-800"
		>
			<CardDescription>
				Cadastro e gerência de cartões SIM utilizados pelos rastreadores
			</CardDescription>

			<CardLink href="/client/rastreamento/cartoes-sim">ir a página de cartões SIM</CardLink>
		</Card>

		<Card
			icon="mdi:user"
			title="Usuários"
			topBorderColor="border-t-orange-800 hover:border-orange-800"
		>
			<CardDescription>Gerência de usuários de sua organização</CardDescription>

			<CardLink href="/client/usuarios">ir a página de usuários</CardLink>
		</Card>

		<Card
			icon="mdi:shield"
			title="Níveis de acesso"
			topBorderColor="border-t-orange-800 hover:border-orange-800"
		>
			<CardDescription>
				Gerência dos níveis de acesso da sua organização, para conceder ou limitar acesso de
				usuários a funcionalidades da plataforma
			</CardDescription>

			<CardLink href="/client/niveis-acesso">ir a página de níveis de acesso</CardLink>
		</Card>
	</div>
</PageContainer>
