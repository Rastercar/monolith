<script lang="ts">
	export let question: string;
	export let href: string;
	export let linkLabel: string;
</script>

<div class="mt-4 flex justify-between">
	<span class="text-sm">{question}</span>

	<a {href} class="text-primary-700-200-token text-sm underline-offset-4 hover:underline">
		{linkLabel}
	</a>
</div>
