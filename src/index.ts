import express from 'express';
import { createServer } from 'http';
import chalkAnimation from 'chalk-animation';
import { Server } from 'socket.io';

const app = express();

const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'))

const sockets = [];
const writers = [];

io.on('connection', (socket) => {
    const id = socket.id;
    socket.on('user connected', (nick) => {
        sockets[id] = nick;
        io.emit('user connected', nick);
    })
    socket.on('disconnect', () => {
        io.emit('user disconnected', sockets[id]);
    });
    socket.on('typing', (input) => {
        if (input && writers.indexOf(sockets[id]) == -1) {
            writers.push(sockets[id])
            socket.broadcast.emit('typing', writers);
        }
        if (!input) {
            const pos = writers.indexOf(sockets[id]);
            writers.splice(pos, 1);
            socket.broadcast.emit('typing', writers);
        }
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg, sockets[id])
    });
});

server.listen(3000, () => {
    chalkAnimation.rainbow('Listening on http://localhost:3000');
});