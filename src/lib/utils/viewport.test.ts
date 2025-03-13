import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { isOnMobileViewPort } from './viewport';

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
});
