import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const rastercarTheme: CustomThemeConfig = {
	name: 'rastercar',
	properties_dark: {},
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base':
			"Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		'--theme-font-family-heading':
			"Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '4px',
		'--theme-rounded-container': '4px',
		'--theme-border-base': '2px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '255 255 255',
		'--on-success': '255 255 255',
		'--on-warning': '255 255 255',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #3741c8
		'--color-primary-50': '225 227 247', // #e1e3f7
		'--color-primary-100': '215 217 244', // #d7d9f4
		'--color-primary-200': '205 208 241', // #cdd0f1
		'--color-primary-300': '175 179 233', // #afb3e9
		'--color-primary-400': '115 122 217', // #737ad9
		'--color-primary-500': '55 65 200', // #3741c8
		'--color-primary-600': '50 59 180', // #323bb4
		'--color-primary-700': '41 49 150', // #293196
		'--color-primary-800': '33 39 120', // #212778
		'--color-primary-900': '27 32 98', // #1b2062
		// secondary | #890cac
		'--color-secondary-50': '237 219 243', // #eddbf3
		'--color-secondary-100': '231 206 238', // #e7ceee
		'--color-secondary-200': '226 194 234', // #e2c2ea
		'--color-secondary-300': '208 158 222', // #d09ede
		'--color-secondary-400': '172 85 197', // #ac55c5
		'--color-secondary-500': '137 12 172', // #890cac
		'--color-secondary-600': '123 11 155', // #7b0b9b
		'--color-secondary-700': '103 9 129', // #670981
		'--color-secondary-800': '82 7 103', // #520767
		'--color-secondary-900': '67 6 84', // #430654
		// tertiary | #474e9a
		'--color-tertiary-50': '227 228 240', // #e3e4f0
		'--color-tertiary-100': '218 220 235', // #dadceb
		'--color-tertiary-200': '209 211 230', // #d1d3e6
		'--color-tertiary-300': '181 184 215', // #b5b8d7
		'--color-tertiary-400': '126 131 184', // #7e83b8
		'--color-tertiary-500': '71 78 154', // #474e9a
		'--color-tertiary-600': '64 70 139', // #40468b
		'--color-tertiary-700': '53 59 116', // #353b74
		'--color-tertiary-800': '43 47 92', // #2b2f5c
		'--color-tertiary-900': '35 38 75', // #23264b
		// success | #1a6510
		'--color-success-50': '221 232 219', // #dde8db
		'--color-success-100': '209 224 207', // #d1e0cf
		'--color-success-200': '198 217 195', // #c6d9c3
		'--color-success-300': '163 193 159', // #a3c19f
		'--color-success-400': '95 147 88', // #5f9358
		'--color-success-500': '26 101 16', // #1a6510
		'--color-success-600': '23 91 14', // #175b0e
		'--color-success-700': '20 76 12', // #144c0c
		'--color-success-800': '16 61 10', // #103d0a
		'--color-success-900': '13 49 8', // #0d3108
		// warning | #7c4e0e
		'--color-warning-50': '235 228 219', // #ebe4db
		'--color-warning-100': '229 220 207', // #e5dccf
		'--color-warning-200': '222 211 195', // #ded3c3
		'--color-warning-300': '203 184 159', // #cbb89f
		'--color-warning-400': '163 131 86', // #a38356
		'--color-warning-500': '124 78 14', // #7c4e0e
		'--color-warning-600': '112 70 13', // #70460d
		'--color-warning-700': '93 59 11', // #5d3b0b
		'--color-warning-800': '74 47 8', // #4a2f08
		'--color-warning-900': '61 38 7', // #3d2607
		// error | #8b2d2d
		'--color-error-50': '238 224 224', // #eee0e0
		'--color-error-100': '232 213 213', // #e8d5d5
		'--color-error-200': '226 203 203', // #e2cbcb
		'--color-error-300': '209 171 171', // #d1abab
		'--color-error-400': '174 108 108', // #ae6c6c
		'--color-error-500': '139 45 45', // #8b2d2d
		'--color-error-600': '125 41 41', // #7d2929
		'--color-error-700': '104 34 34', // #682222
		'--color-error-800': '83 27 27', // #531b1b
		'--color-error-900': '68 22 22', // #441616
		// surface | #3d5161
		'--color-surface-50': '226 229 231', // #e2e5e7
		'--color-surface-100': '216 220 223', // #d8dcdf
		'--color-surface-200': '207 212 216', // #cfd4d8
		'--color-surface-300': '177 185 192', // #b1b9c0
		'--color-surface-400': '119 133 144', // #778590
		'--color-surface-500': '61 81 97', // #3d5161
		'--color-surface-600': '55 73 87', // #374957
		'--color-surface-700': '46 61 73', // #2e3d49
		'--color-surface-800': '37 49 58', // #25313a
		'--color-surface-900': '30 40 48' // #1e2830
	}
};
