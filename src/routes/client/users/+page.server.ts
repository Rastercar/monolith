import { runAuthMidleware } from '$lib/utils/server-load';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = runAuthMidleware;
