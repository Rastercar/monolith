<script lang="ts">
	import type { SimCard } from '$lib/api/sim-card.schema';
	import Icon from '@iconify/svelte';

	export let simCard: SimCard;
</script>

<div class="card p-4">
	<div class="flex items-center">
		<span class="flex items-center">
			<Icon icon="mdi:sim" class="mr-4" width={24} /> Phone Number:
			{simCard.phoneNumber}
		</span>

		<p class="ml-auto">
			created at:
			{new Date(simCard.createdAt).toLocaleDateString()}
		</p>
	</div>

	<hr class="my-4" />

	<div class="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
		<p><b>SSN:</b> {simCard.ssn}</p>
		<p><b>APN Address:</b> {simCard.apnAddress}</p>
		<p><b>APN User:</b> {simCard.apnUser}</p>
		<p><b>APN Password:</b> {simCard.apnPassword}</p>
		<p><b>PIN:</b> {simCard.pin}</p>
		<p><b>PIN 2:</b> {simCard.pin2}</p>
		<p><b>PUK:</b> {simCard.puk}</p>
		<p><b>PUK 2:</b> {simCard.puk2}</p>
	</div>
</div>
