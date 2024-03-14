import { getContext } from 'svelte';
import { writable } from 'svelte/store';

export interface MapContext {
  getGoogleMap: () => InstanceType<typeof window.google.maps.Map>;
  getMapElement: () => HTMLDivElement;
}

interface MapState {
  /**
   * the trackers that should be shown on the map
   *
   * key: tracker ID
   * val: if it is selected
   */
  selectedTrackers: Record<number, boolean>;
}

export const mapStore = writable<MapState>({ selectedTrackers: {} });

export const MAP_CONTEXT_KEY = 'MAP_CONTEXT_KEY';

export const getMapContext = () => getContext<MapContext>(MAP_CONTEXT_KEY);
