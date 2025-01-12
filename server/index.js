import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handler } from '../build/handler.js';

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server);

// TODO: we can set a gloalVariable with the socketIO instance and then
// use this global variable elsewhere in our code, like:
// https://github.com/suhaildawood/SvelteKit-integrated-WebSocket/blob/main/src/hooks.server.ts
// this is great !
globalThis.io = io;

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/main/packages/adapter-node#custom-server
app.use(handler);

server.listen(port);
