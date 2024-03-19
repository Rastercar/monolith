<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import { loadGoogleMaps } from '$lib/utils/google-maps';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import TrackerMarker from './TrackerMarker.svelte';
	import MapControl from './MapControl.svelte';
	import Icon from '@iconify/svelte';
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import SelectVehicleOverlay from './SelectVehicleOverlay.svelte';
	import {
		MAP_CONTEXT_KEY,
		mapStore,
		type MapContext,
		createWsConnectionToTrackingNamespace
	} from '../map';
	import { apiGetJwtForCurrentUser } from '$lib/api/user';

	let mapElement: HTMLDivElement;
	let googleMap: InstanceType<typeof window.google.maps.Map>;

	const drawerStore = getDrawerStore();

	const initMap = async () => {
		const mapEl = document.getElementById('map') as HTMLDivElement;

		if (!mapEl) {
			console.error('failed to find map element');
			return;
		}

		mapElement = mapEl;

		googleMap = new window.google.maps.Map(mapElement, {
			center: { lat: -34.397, lng: 150.644 },
			zoom: 8,
			// [TODO-PROD] do not use a demo map id in prod
			mapId: 'DEMO_MAP_ID'
		});
	};

	setContext<MapContext>(MAP_CONTEXT_KEY, {
		getGoogleMap: () => googleMap,
		getMapElement: () => mapElement
	});

	const loadMapLibraries = async () => {
		const googleMapsAlreadyLoaded = window.google?.maps !== undefined;
		if (!googleMapsAlreadyLoaded) {
			loadGoogleMaps({ key: PUBLIC_GOOGLE_MAPS_API_KEY, v: 'weekly' });
			await window.google.maps.importLibrary('maps');
		}

		const markerAlreadyLoaded = window.google?.maps?.marker;
		if (!markerAlreadyLoaded) {
			await window.google.maps.importLibrary('marker');
		}
	};

	const openDrawer = () => {
		const drawerSettings: DrawerSettings = {
			position: 'bottom',
			height: 'h-[500px] md:h-[600px]',
			meta: { component: SelectVehicleOverlay }
		};
		drawerStore.open(drawerSettings);
	};

	// TODO: ! rm me !
	let lat = -34.397;
	let lng = 150.664;

	// TODO: ! rm me !
	const getLatLng = () => {
		const v = { lat, lng };
		lat = lat + 0.01;
		lng = lng + 0.01;

		return v;
	};

	// 1- Socket io tem namespaces, que server para separar middlewares, salas, event handlers, etc
	// podemos usar namespaces para organizar nossa aplicação, no nosso caso, usaremos o namespace
	// /tracking

	// 2- Possivelmente cada imei de um rastreador é uma sala, e conforme chega posições para este imei,
	// é emitido eventos para sua sala, isso simplifica o ponto 3

	// 3- O requisitante então informa ao servidor quais veiculos esta interessado em receber update,
	// o servidor armazena isso de alguma maneira em memória e então envia as posições que este cliente
	// esta interessado (ver: https://socket.io/docs/v4/emit-cheatsheet/)

	// 4- Se para um imei especifico, não há ngm interessado, a sala não deve existir, logo emits não serão
	// feitos, (teoricamente, rooms são channels, e como não tem ngm escutando no channel nada deve ocorrer
	// e se bobear rooms vazias são excluidas (verificar se sala existe, ver https://socket.io/docs/v4/rooms/)

	// TODO: !
	let socket: ReturnType<typeof createWsConnectionToTrackingNamespace> | null = null;

	let interval: ReturnType<typeof setInterval>;

	mapStore.subscribe((v) => {
		if (socket)
			socket.emit(
				'change_trackers_to_listen',
				Object.keys(v.selectedTrackers).map((v) => parseInt(v))
			);
	});

	onMount(async () => {
		const token = await apiGetJwtForCurrentUser();
		await loadMapLibraries();

		initMap();

		socket = createWsConnectionToTrackingNamespace(token);

		// TODO: realtime map update
		socket.on('position', console.log);

		socket.on('error', (error) => {
			console.warn(error);
		});

		// TODO: what now ? select the first few trackers ????
		console.log('change_trackers_to_listen');
		socket.emit(
			'change_trackers_to_listen',
			[1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 600]
		);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);

		if (socket) {
			socket.disconnect();
			socket = null;
		}
	});
</script>

<div id="map" class="h-full w-full">
	{#if googleMap}
		<MapControl position={window.google.maps.ControlPosition.TOP_RIGHT}>
			<div
				class="m-[10px] h-[40px] flex items-center px-4 shadow-lg text-black bg-white rounded-sm"
			>
				<button class="flex items-center text-lg" on:click={openDrawer}>
					<Icon icon={'mdi:car'} class="mr-2" height={20} /> Trackers
				</button>
			</div>
		</MapControl>

		{#each Object.values($mapStore.selectedTrackers) as _tracker}
			<TrackerMarker position={getLatLng()} />
		{/each}
	{/if}
</div>
