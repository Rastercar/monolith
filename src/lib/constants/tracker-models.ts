export const TRACKER_MODEL_H02 = 'H02';

export const trackerModels = [TRACKER_MODEL_H02] as const;

/**
 * all tracker models supported by the rastercar platform
 */
export type trackerModel = (typeof trackerModels)[number];

export interface trackerDetails {
	/**
	 * The amount of sim cards that can be installed on a tracker model,
	 * as some trackers support multiple SIM cards to maintain conectivity
	 * if one of them looses connection.
	 */
	supportedSimCards: number;
}

export const trackerModelsDetails: Record<trackerModel, trackerDetails> = {
	H02: {
		supportedSimCards: 1
	}
};
