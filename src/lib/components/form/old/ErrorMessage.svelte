<script lang="ts">

	
	interface Props {
		errors: string[] | undefined;
		/**
	 * if the div element should always be present, even if there are no errors,
	 * useful to avoid page flickers when changing from a errorless to a error state
	 */
		alwaysVisible?: boolean;
	}

	let { errors, alwaysVisible = false }: Props = $props();

	const classes = 'text-error-500-400-token text-sm';
</script>

{#if alwaysVisible}
	<span class={classes}>
		{#if errors}{errors}{:else}{''}{/if}
	</span>
{:else if errors && errors.length > 0}
	<span class={classes}>{errors[0]}</span>
{/if}
