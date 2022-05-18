import { Server, Socket } from "socket.io";

const sockets = [];
const writers = [];

const onConnected = (io: Server, id: string, nick: string) => {
    sockets[id] = nick;
    io.emit('user connected', nick);
}

const onDisconnected = (io: Server, id: string) => {
    io.emit('user disconnected', sockets[id]);
}

const onTyping = (socket: Socket, id: string, input: string) => {
    if (input && writers.indexOf(sockets[id]) == -1) {
        writers.push(sockets[id])
        socket.broadcast.emit('typing', writers);
    }
    if (!input) {
        const pos = writers.indexOf(sockets[id]);
        writers.splice(pos, 1);
        socket.broadcast.emit('typing', writers);
    }
}

const onMessage = (io: Server, id: string, msg: string) => {
    io.emit('chat message', msg, sockets[id])
}

export const onConnection = (io: Server) => {
    io.on('connection', (socket) => {
        const id = socket.id;

        socket.on('user connected', (nick: string) => onConnected(io, id, nick))
        socket.on('disconnect', () => onDisconnected(io, id));
        socket.on('typing', (input) => onTyping(socket, id, input));
        socket.on('chat message', (msg) => onMessage(io, id, msg));
    });

}