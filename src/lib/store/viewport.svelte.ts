import { noOperation } from '../utils/functions';

/**
 * Returns a reactive variable that represents the screen is a mobile viewport,
 * this var is updated on window resizes
 *
 * @important
 *
 * if opts.updateOnResize is true this registers a event listener on the windown
 * that MUST be removed by calling the unsubscribe function that is returned
 */
export const isOnMobileViewPort = (opts?: { updateOnResize?: boolean }) => {
	const mobileViewportMediaQuery = window.matchMedia('(max-width: 768px)');

	let isMobileViewport = $state(mobileViewportMediaQuery.matches);

	const update = () => {
		isMobileViewport = mobileViewportMediaQuery.matches;
	};

	const unsubscribe = opts?.updateOnResize
		? noOperation
		: () => window.removeEventListener('resize', update);

	if (opts?.updateOnResize) window.addEventListener('resize', update);

	return { isMobileViewport, unsubscribe };
};
