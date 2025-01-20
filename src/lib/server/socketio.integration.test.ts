import { SOCKET_IO_TRACKING_NAMESPACE } from '$lib/constants/socket-io';
import { delay } from '$lib/utils/promises';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { io as ioc } from 'socket.io-client';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { waitFor } from '../../test/integration-utils';
import * as userRepo from './db/repo/user';
import {
	configureSocketIoServer,
	ensureSocketIoServerIsConfigured,
	hasConfiguredSocketIoServer
} from './socketio';
import * as serverToClientEvents from './tracking/client-to-server-events';

vi.mock('./db/repo/user');
vi.mock('./tracking/client-to-server-events');

const userRepoMock = vi.mocked(userRepo);

describe('ensureSocketIoServerIsConfigured', () => {
	afterEach(() => {
		delete globalThis.io;
	});

	test('doesnt call configureSocketIoServer if socket io instance is not available', () => {
		expect(ensureSocketIoServerIsConfigured).not.toThrow();
	});

	test('configures the socket io instance if available', () => {
		const httpServer = createServer();
		globalThis.io = new Server(httpServer);

		expect(hasConfiguredSocketIoServer).toBe(false);

		ensureSocketIoServerIsConfigured();

		expect(hasConfiguredSocketIoServer).toBe(true);
	});
});

describe('configureSocketIoServer', async () => {
	const PORT = 3010;

	let httpServer = createServer();
	let ioServer = new Server(httpServer);

	const fakeSessionId = '3219e8ce-bec2-41a0-9831-b02a08871f12';

	const socketClientUrl = `http://localhost:${PORT}/${SOCKET_IO_TRACKING_NAMESPACE}`;

	const withFakeSessionId = {
		extraHeaders: { Cookie: `sid=${fakeSessionId}` }
	};

	const fakeUser = {
		id: 1,
		organizationId: 2
	} as unknown as Awaited<ReturnType<typeof userRepoMock.findUserBySessionToken>>;

	beforeAll(() => {
		httpServer.listen(PORT);
		configureSocketIoServer(ioServer);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	afterAll(() => {
		httpServer.closeAllConnections();
		httpServer.close();
		ioServer.close();
	});

	test('disconnects after connection if no session id cookie is found on the handshake', async () => {
		const clientSocket = ioc(socketClientUrl);

		await waitFor(clientSocket, 'connect');

		expect(clientSocket.disconnected).toBe(true);
	});

	test('disconnects after connection if a invalid session id cookie is found on the handshake', async () => {
		const clientSocket = ioc(socketClientUrl, withFakeSessionId);

		await waitFor(clientSocket, 'connect');

		userRepoMock.findUserBySessionToken.mockImplementation(async (_) => null);
		expect(userRepo.findUserBySessionToken).toHaveBeenLastCalledWith(fakeSessionId);

		expect(clientSocket.disconnected).toBe(true);
	});

	test('connects successfully if a valid session id cookie is found on the handshake', async () => {
		const clientSocket = ioc(socketClientUrl, withFakeSessionId);

		userRepoMock.findUserBySessionToken.mockImplementation(async (_) => fakeUser);

		await waitFor(clientSocket, 'connect');

		expect(userRepo.findUserBySessionToken).toHaveBeenLastCalledWith(fakeSessionId);
		expect(clientSocket.disconnected).toBe(false);
	});

	test('registers the changeTrackersToListen callback', async () => {
		const clientSocket = ioc(socketClientUrl, withFakeSessionId);

		userRepoMock.findUserBySessionToken.mockImplementation(async (_) => fakeUser);

		await waitFor(clientSocket, 'connect');

		const trackerIds = [1, 2];

		clientSocket.emit('changeTrackersToListen', trackerIds);

		// wait some time for the event to reach the server
		await delay(20);

		const sessionFromUser = { userId: fakeUser?.id, organizationId: fakeUser?.organizationId };

		expect(serverToClientEvents.handleChangeTrackersToListenEvent).toHaveBeenLastCalledWith(
			trackerIds,
			expect.anything(),
			sessionFromUser
		);
		expect(clientSocket.disconnected).toBe(false);
	});
});
