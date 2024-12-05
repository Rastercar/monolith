<script lang="ts">

	interface Props {
		label: string;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { label, class: clazz = '', children }: Props = $props();
	
</script>

<div class={clazz}>
	<div>{label}:</div>
	<b>
		{@render children?.()}
	</b>
</div>
