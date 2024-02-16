<script lang="ts">
	export let padding = 'p-2';
	export let bgColor = 'bg-surface-300-600-token';
	export let additionalClasses = '';

	export let dataPopup: string;
</script>

<div class={`card ${padding} ${bgColor} ${additionalClasses}`} data-popup={dataPopup}>
	<slot />
	<div class={`arrow ${bgColor}`} />
</div>
