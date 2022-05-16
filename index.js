const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var sockets = [];

io.on('connection', (socket) => {
    const id = socket.id;
    socket.on('user connected', (nick) => {
        sockets[id] = nick;
        io.emit('user connected', nick);
    })
    socket.on('disconnect', () => {
        io.emit('user disconnected', sockets[id]);
    });
    socket.on('chat message', (msg, nick) => {
        io.emit('chat message', msg, nick)
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});