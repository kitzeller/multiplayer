const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');

const PORT = process.env.PORT || 8080;

const players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a player connected');

    // send the players object to the new player
    socket.emit('currentPlayers', players);

    // broadcast to everyone except sender
    // socket.broadcast.emit('hi');
    // io.emit('chat message', "user " + socket.id + " connected ");

    socket.on('send-nickname', function(nickname) {
        socket.nickname = nickname;
        players[socket.id] = {
            nickname: nickname,
            playerId: socket.id
        };
        console.log(players);
        io.emit('chat message', socket.nickname + " connected ");
    });

    socket.on('chat message', function(msg){
        console.log(socket.nickname + ': ' + msg);
        io.emit('chat message', socket.nickname + ': ' + msg);
    });


    // update all other players of the new player
    // socket.broadcast.emit('newPlayer', players[socket.id]);

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
        console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
    });
});

server.listen(PORT, function () {
    console.log(`Listening on ${server.address().port}`);
});
