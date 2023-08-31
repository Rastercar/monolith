<script lang="ts">
	export let errors: string[] | undefined;

	/**
	 * if the div element should always be present, even if there are no errors,
	 * useful to avoid page flickers when changing from a errorless to a error state
	 */
	export let alwaysVisible: boolean = false;

	const classes = 'text-error-500-400-token text-sm';
</script>

{#if alwaysVisible}
	<span class={classes}>
		{#if errors}{errors}{:else}{''}{/if}
	</span>
{:else if errors}
	<span class={classes}>{errors}</span>
{/if}
