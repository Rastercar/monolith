import * as themes from '@skeletonlabs/skeleton/themes';
import { rastercarTheme } from './rastercar';

// [PROD-TODO] decide on how were not gonna bloat up
//
// client themes and by making them load every theme css at startup
export const availableThemes = [rastercarTheme, ...Object.values(themes)];

export const availableThemesNames = availableThemes.map((t) => t.name);
