<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	const chartId = 'position-count-chart';

	const data = [
		{ day: 2010, count: 10 },
		{ day: 2011, count: 20 },
		{ day: 2012, count: 15 },
		{ day: 2013, count: 25 },
		{ day: 2014, count: 22 },
		{ day: 2015, count: 30 },
		{ day: 2016, count: 28 }
	];

	const renderChart = () => {
		new Chart(document.getElementById(chartId) as HTMLCanvasElement, {
			type: 'bar',
			data: {
				labels: data.map((row) => row.day),
				datasets: [
					{
						label: 'positions per day',
						data: data.map((row) => row.count)
					}
				]
			}
		});
	};

	// TODO: finish me:
	// endpoint de consulta de contagem de posições da semana atual
	//
	// provavelmente fazer
	onMount(renderChart);
</script>

<div class="card p-4 max-w-md">
	<div class="mb-4">Registered positions this week:</div>
	<canvas id={chartId} />
</div>
