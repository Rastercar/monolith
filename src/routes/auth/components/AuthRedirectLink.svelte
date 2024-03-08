<script lang="ts">
	export let question: string;
	export let href: string;
	export let linkLabel: string;
</script>

<div class="mt-4 flex justify-between text-sm">
	{question}

	<a
		{href}
		data-sveltekit-preload-data="off"
		class="text-primary-700-200-token underline-offset-4 hover:underline"
	>
		{linkLabel}
	</a>
</div>
