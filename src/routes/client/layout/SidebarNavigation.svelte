<script lang="ts">
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import NavList, { type Route } from './NavList.svelte';

	interface Props {
		onRouteClick?: VoidFunction;
	}

	const { onRouteClick }: Props = $props();

	const routes: Route[] = [
		{
			href: '/client',
			label: 'home',
			icon: 'mdi:home'
		},
		{
			href: '/client/rastreamento/mapa',
			label: 'mapa',
			icon: 'mdi:map'
		},
		{
			href: '/client/meu-perfil',
			label: 'meu perfil',
			icon: 'mdi:account'
		},
		{
			href: '/client/usuarios',
			label: 'usuários',
			icon: 'mdi:account-multiple'
		},
		{
			href: '/client/niveis-acesso',
			label: 'níveis de acesso',
			icon: 'mdi:shield'
		},
		{
			href: '/client/rastreamento/veiculos',
			label: 'veículos',
			icon: 'mdi:car'
		},
		{
			href: '/client/rastreamento/frotas',
			label: 'frotas',
			icon: 'mdi:car-multiple'
		},
		{
			href: '/client/rastreamento/rastreadores',
			label: 'rastreadores',
			icon: 'mdi:cellphone'
		},
		{
			href: '/client/rastreamento/cartoes-sim',
			label: 'cartões SIM',
			icon: 'mdi:sim'
		}
	];

	const settingsRoutes: Route[] = [
		{
			href: '/client/configuracoes/perfil',
			label: 'perfil',
			icon: 'mdi:account-edit'
		},
		{
			href: '/client/configuracoes/organizacao',
			label: 'organização',
			icon: 'mdi:building'
		},
		{
			href: '/client/configuracoes/sessoes',
			label: 'sessões',
			icon: 'mdi:access-point'
		},
		{
			href: '/client/configuracoes/seguranca',
			label: 'credenciais / segurança',
			icon: 'mdi:shield-account'
		}
	];

	let isInSettingsRoute = $derived(page.url.pathname.includes('/configuracoes'));
</script>

<aside>
	{#if isInSettingsRoute}
		<span class="block mt-8 px-5 text-lg">Configurações da Conta</span>

		<div class="px-5">
			<hr class="hr border-t-2 mt-6 mb-8" />
		</div>

		<NavList
			routes={settingsRoutes.map((r) => ({ ...r, closeSidebarOnClick: true }))}
			{onRouteClick}
		/>

		<div class="flex justify-end">
			<a href="/client/meu-perfil" class="btn preset-filled-primary-500 mx-4 my-4">
				<Icon icon="mdi:arrow-left" />
				sair das configurações
			</a>
		</div>
	{:else}
		<NavList routes={routes.map((r) => ({ ...r, closeSidebarOnClick: true }))} {onRouteClick} />

		<div class="px-5">
			<hr class="hr border-t-2 my-4" />
		</div>

		<NavList
			routes={[
				{ href: '/client/configuracoes/perfil', icon: 'mdi:settings', label: 'configurações' }
			]}
		/>
	{/if}
</aside>
