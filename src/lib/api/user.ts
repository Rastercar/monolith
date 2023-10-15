import { userSchema, type User } from './auth';
import { rastercarApi, redirectOnSessionError } from './common';

/**
 * gets the current user within the session id on the session ID cookie
 */
export const apiGetCurrentUser = async (): Promise<User> =>
	rastercarApi.get('/user/me').json<User>().catch(redirectOnSessionError).then(userSchema.parse);
