import {
	SOCKET_IO_TRACKING_NAMESPACE,
	TRACKER_SUBSCRIPTION_PER_USER_LIMIT
} from '$lib/constants/socket-io';
import { range } from '$lib/utils/arrays';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { io as ioc } from 'socket.io-client';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../global';
import { waitFor } from '../../../test/integration-utils';
import * as vehicleTrackerRepo from '../db/repo/vehicle-tracker';
import { handleChangeTrackersToListenEvent } from './client-to-server-events';

type SocketClient = Socket<ClientToServerEvents, ServerToClientEvents>;

vi.mock('../db/repo/vehicle-tracker');

const vehicleRepoMock = vi.mocked(vehicleTrackerRepo);

describe('configureSocketIoServer', async () => {
	const PORT = 3009;

	let httpServer = createServer();
	let ioServer = new Server(httpServer);

	const socketClientUrl = `http://localhost:${PORT}/${SOCKET_IO_TRACKING_NAMESPACE}`;

	let socketClient!: SocketClient;

	const userSessionMock = { userId: 1, organizationId: 2 };

	const validIds = [1, 2, 3];

	const invalidIds = [4, 5];

	const setupTest = () => {
		const clientSocket = ioc(socketClientUrl);
		const errors: string[] = [];

		clientSocket.on('error', (err) => errors.push(err));

		return { errors, clientSocket };
	};

	beforeAll(() => {
		httpServer.listen(PORT);

		ioServer.of(SOCKET_IO_TRACKING_NAMESPACE).on('connection', async (socket) => {
			socketClient = socket;
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	afterAll(() => {
		httpServer.closeAllConnections();
		httpServer.close();
		ioServer.close();
	});

	test('emits and error if too much tracker ids are informed', async () => {
		const { errors, clientSocket } = setupTest();
		await waitFor(clientSocket, 'connect');

		await handleChangeTrackersToListenEvent(
			range(TRACKER_SUBSCRIPTION_PER_USER_LIMIT + 1),
			socketClient,
			userSessionMock
		);

		await waitFor(clientSocket, 'error');

		expect(errors.length).toBe(1);
		expect(errors[0]).toBe(`cannot listen to over ${TRACKER_SUBSCRIPTION_PER_USER_LIMIT} trackers`);
	});

	test('emits and error if some informed tracker ids do not belonged to the organization on the session', async () => {
		const { errors, clientSocket } = setupTest();
		await waitFor(clientSocket, 'connect');

		vehicleRepoMock.filterVehicleTrackerIdsByAssertingBelongsToOrg.mockImplementation(
			async (_: number[], __: number) => validIds
		);

		await handleChangeTrackersToListenEvent(
			[...validIds, ...invalidIds],
			socketClient,
			userSessionMock
		);

		await waitFor(clientSocket, 'error');

		expect(errors.length).toBe(1);
		expect(errors[0]).toBe('not allowed to listen to ids: 4,5');
	});

	test('leaves every room (previous trackers) and joins rooms of the new trackers', async () => {
		const clientSocketMock = {
			emit: vi.fn(),
			join: vi.fn(),
			leave: vi.fn(),
			rooms: ['room1', 'room2']
		};

		vehicleRepoMock.filterVehicleTrackerIdsByAssertingBelongsToOrg.mockImplementation(
			async (_: number[], __: number) => validIds
		);

		await handleChangeTrackersToListenEvent(
			validIds,
			clientSocketMock as unknown as SocketClient,
			userSessionMock
		);

		expect(clientSocketMock.leave).toHaveBeenCalledTimes(clientSocketMock.rooms.length);

		clientSocketMock.rooms.forEach((room) => {
			expect(clientSocketMock.leave).toHaveBeenCalledWith(room);
		});

		expect(clientSocketMock.join).toHaveBeenCalledWith([...validIds.map((id) => id.toString())]);
	});
});
