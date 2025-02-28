<script>
	import AppBarUserMenu from './AppBarUserMenu.svelte';
	import DarkModeSwitch from './DarkModeSwitch.svelte';

	import DrawerHamburgerButton from './DrawerHamburgerButton.svelte';
</script>

<header class="bg-surface-200-800 p-4">
	<div class="flex items-center">
		<DrawerHamburgerButton />

		<span class="type-scale-5 hidden lg:block">Rastercar</span>

		<DarkModeSwitch classes="ml-auto mr-4" />

		<!-- [TODO-PROD] wait for skeleton to finish their tailwind v4 rewrite and re-enable this -->
		<!-- <ThemeSelector extraClasses="max-w-48 mx-4" /> -->

		<AppBarUserMenu />
	</div>
</header>
