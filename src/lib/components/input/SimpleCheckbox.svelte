<script lang="ts">
	interface Props {
		checked: boolean;
		disabled: boolean;
		indeterminate: boolean;
		onChange: (_: boolean) => void;
	}

	let { checked, disabled, indeterminate = $bindable(), onChange }: Props = $props();
</script>

<input
	bind:indeterminate
	{disabled}
	{checked}
	class="checkbox disabled:bg-surface-300-600-token disabled:cursor-not-allowed"
	type="checkbox"
	onchange={(e) => onChange(e.currentTarget.checked)}
/>
