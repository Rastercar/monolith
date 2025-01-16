<script>
	import AppBarUserMenu from './AppBarUserMenu.svelte';
	import DarkModeSwitch from './DarkModeSwitch.svelte';

	import DrawerHamburgerButton from './DrawerHamburgerButton.svelte';
	import ThemeSelector from './ThemeSelector.svelte';
</script>

<header class="bg-surface-200-800 p-4">
	<div class="flex items-center">
		<DrawerHamburgerButton />
		<span class="type-scale-5 hidden lg:block">Dashboard</span>

		<DarkModeSwitch classes="ml-auto" />
		<ThemeSelector extraClasses="max-w-48 mx-4" />
		<AppBarUserMenu />
	</div>
</header>
