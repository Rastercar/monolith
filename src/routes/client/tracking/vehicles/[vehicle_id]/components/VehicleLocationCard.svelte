<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<!--
    TODO: 
    1- display the vehicle last location
    2- open a WS connection to the api and keep recieving positions and updating them on the map
-->
<div class="card p-4 mt-4">
	<div class="mb-4 flex items-center">
		Last location:

		<!-- 
			TODO: 
			link to the main map, this should open the map with the tracker selected 
		 	figure out how to avoid opening 2 WS connections if the client opens 2 maps on different tabs
		-->
		<button class="btn variant-filled-primary btn-sm ml-auto">
			<Icon icon="mdi:map" class="mr-2" />
			see on map
		</button>
	</div>

	<iframe
		width="100%"
		height="400px"
		title="map"
		frameborder="0"
		scrolling="no"
		marginheight="0"
		marginwidth="0"
		src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
	></iframe>
</div>
