import io from 'socket.io-client';
import * as $ from 'jquery';

export default class Client {
    constructor(game) {
        var self = this;
        const socket = io.connect(process.env.HOST);
        var others = {};
        socket.on('connect', function() {
            console.log("Client Successfully Connected. Id: " + socket.id);

            // game.setSocket(socket);
            game.addPlayer(socket);

            // socket.io
        });

        // Prompt user for name
        // var name = prompt("Please enter your name", "");
        // if (name != null || name !== "") {
        //     socket.emit('send-nickname', name);
        // }

        $('form').submit(function (e) {
            e.preventDefault(); // prevents page reloading
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('chat message', function (msg) {
            $('#messages').append($('<li>').text(msg));
        });

        socket.on('other player movement', function (msg) {
            // console.log(others);
            others[msg.id].mesh.position = msg.position;
        });

        socket.on('disconnect', function (msg) {
            others[msg].mesh.dispose();
            delete others[msg];
        });

        socket.on('newPlayer', function (msg) {
            others[msg.playerId] = msg;
            others[msg.playerId].mesh = game.addOtherPlayer();
        });

        socket.on('currentPlayers', function (players) {
            console.log(players);
            others = players;
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === socket.id) {
                    // addPlayer(self, players[id]);
                } else {
                    players[id].mesh = game.addOtherPlayer(players[id].position);
                    // addOtherPlayers(self, players[id]);
                }
            });
            $('#messages').append($('<li>').text((Object.keys(players).length - 1) + " player(s) are in the game."));
        });
    }
}
