//
// Application production entrypoint this is the main JS file executed
// by node when running the built application in production mode.
//
// we dont do much here except setting up telemetry and a global SocketIO,
// most of the code is in the build folder (created by vite).
//
// see: https://github.com/sveltejs/kit/tree/main/packages/adapter-node#custom-server
//

// important, init opentelemetry before anything else
import './telemetry.js';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handler } from '../build/handler.js';

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server);

// set a global variable with the socketIO instance
globalThis.io = io;

// SvelteKit should handle everything else using Express middleware
app.use(handler);

server.listen(port);

process.on('beforeExit', () => {
	server.closeAllConnections();
	server.close();
});
