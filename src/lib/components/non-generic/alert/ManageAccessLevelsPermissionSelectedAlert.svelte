<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		onUndoClicked: VoidFunction;
	}

	const { onUndoClicked }: Props = $props();
</script>

<aside class="card preset-outlined-warning-200-800 my-6 p-4">
	<div class="flex items-center gap-4">
		<Icon icon="mdi:warning" height={24} />

		<p class="text-sm">
			Importante! Conceder a um nível de acesso a permissão de gerar permissões torna seus usuário
			que utiliza esse nível de acesso um administrador.
		</p>

		<button
			class="btn btn-sm ml-auto preset-filled-secondary-200-800"
			onclick={() => onUndoClicked()}
		>
			desfazer
		</button>
	</div>
</aside>
