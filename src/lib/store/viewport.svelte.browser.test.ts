import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { isOnMobileViewPort } from './viewport.svelte';

describe('isOnMobileViewPort', () => {
	let matchMediaMock: (query: string) => MediaQueryList;

	let addEventListenerSpy: MockInstance;
	let removeEventListenerSpy: MockInstance;

	beforeEach(() => {
		matchMediaMock = vi.fn().mockImplementation((query) => ({
			matches: query === '(max-width: 768px)',
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}));

		global.window.matchMedia = matchMediaMock;

		addEventListenerSpy = vi.spyOn(window, 'addEventListener');
		removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
	});

	it('returns correct initial value based on matchMedia', () => {
		global.window.matchMedia = vi.fn().mockReturnValue({ matches: true });
		const { isMobileViewport } = isOnMobileViewPort();
		expect(isMobileViewport).toBe(true);

		global.window.matchMedia = vi.fn().mockReturnValue({ matches: false });
		const { isMobileViewport: isNotMobile } = isOnMobileViewPort();
		expect(isNotMobile).toBe(false);
	});

	it('should add resize event listener when updateOnResize is true', () => {
		isOnMobileViewPort({ updateOnResize: true });
		expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
	});

	it('should remove resize event listener when unsubscribe is called', () => {
		isOnMobileViewPort({ updateOnResize: false }).unsubscribe();
		expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
	});
});
