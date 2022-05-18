import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { onConnection } from './socket';
import { ServerToClientEvents, ClientToServerEvents } from './types/socket'

const app = express();

const server = createServer(app);
const io = new Server<ServerToClientEvents, ClientToServerEvents>(server);

app.use(express.static('public'))

onConnection(io);

server.listen(3000, () => {
    console.log('🚀 Listening on http://localhost:3000');
});