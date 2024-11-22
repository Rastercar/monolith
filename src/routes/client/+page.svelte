<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { authStore } from '$lib/store/auth';
	import Icon from '@iconify/svelte';
</script>

<div class="p-10 space-y-4">
	<!--
		TODO: 
		this should be a dashboard but it would need a lot of features to exist
		leave it as is for now

		TODO: card de quantidade de posições
		TODO: card de mapa mini com link para o map
		TODO: link para quick tracking
		TODO: link p/ meu perfil ?
	-->
	<h1>Wellcome: {authStore.getValue().user?.username}</h1>

	<hr />

	<div class="flex gap-4">
		<a href={route('/client/tracking/quick-track')}>
			<button class="btn btn-sm variant-filled-primary">
				<Icon icon="mdi:car" class="mr-2" />
				Track something new !
			</button>
		</a>
	</div>
</div>
