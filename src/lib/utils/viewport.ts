export const isOnMobileViewPort = () => ({
	isMobileViewport: window.matchMedia('(max-width: 768px)').matches
});
