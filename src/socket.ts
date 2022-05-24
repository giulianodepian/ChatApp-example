import { Server, Socket } from "socket.io";

const sockets = {};
const writers = [];

const onConnected = (io: Server, id: string, nick: string) => {
    sockets[id] = nick;
    io.emit('userConnected', nick, sockets);
}

const onDisconnected = (io: Server, id: string) => {
    var nick = sockets[id];
    delete sockets[id];
    io.emit('userDisconnected', nick, sockets);
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

const onMessage = (socket: Socket, id: string, msg: string) => {
    socket.broadcast.emit('chatMessage', msg, sockets[id])
}

export const onConnection = (io: Server) => {
    io.on('connection', (socket) => {
        const id = socket.id;

        socket.on('userConnected', (nick: string) => onConnected(io, id, nick))
        socket.on('disconnect', () => onDisconnected(io, id));
        socket.on('typing', (input) => onTyping(socket, id, input));
        socket.on('chatMessage', (msg) => onMessage(socket, id, msg));
    });

}