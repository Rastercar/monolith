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

// set a gloalVariable with the socketIO instance
globalThis.io = io;

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/main/packages/adapter-node#custom-server
app.use(handler);

server.listen(port);

process.on('beforeExit', () => {
	server.closeAllConnections();
	server.close();
});
