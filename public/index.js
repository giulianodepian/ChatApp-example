var socket = io();
var form = document.getElementById('form');
var nickForm = document.getElementById('nicknameform');
var nickinput = document.getElementById('nickinput')
var input = document.getElementById('input');
var typing = document.getElementById('typing');

input.addEventListener('change', function (e) {
    e.preventDefault();
    socket.emit('typing', input.value);
})

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chatMessage', input.value);
        socket.emit('typing', '');
        input.value = '';
    }
});
nickForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (nickinput.value) {
        socket.emit('userConnected', nickinput.value);
        window.nick = nickinput.value;
        document.getElementById('popup').style.visibility = 'hidden';
        document.getElementById('form').style.visibility = 'visible';
        document.getElementById('messages').style.visibility = 'visible';
    }
})

socket.on('userConnected', (nick) => {
    var item = document.createElement('li');
    item.textContent = nick + ' Connected';
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('userDisconnected', (nick) => {
    var item = document.createElement('li');
    item.textContent = nick + ' Disconnected';
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('typing', (writers) => {
    var nickPos = writers.indexOf(window.nick);
    if (nickPos != -1) {
        writers.splice(nickPos, 1);
    }
    if (writers.length > 0) {
        let text = '';
        if (writers.length <= 3) {
            writers.forEach(writer => {
                text = text + ' ' + writer;
            });
        } else {
            text = 'Various users'
        };
        if (writers.length == 1) {
            text = text + ' is typing';
        } else {
            text = text + ' are typing';
        }
        typing.textContent = text;
    } else {
        typing.textContent = '';
    }
});

socket.on('chatMessage', (msg, nick) => {
    var item = document.createElement('li');
    item.textContent = nick + ': ' + msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
