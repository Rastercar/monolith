<script lang="ts">
	interface Props {
		question: string;
		href: string;
		linkLabel: string;
	}

	const { linkLabel, href, question }: Props = $props();
</script>

<div class="mt-4 flex justify-between text-sm">
	{question}

	<a {href} class="text-primary-700-200-token underline-offset-4 hover:underline">
		{linkLabel}
	</a>
</div>
