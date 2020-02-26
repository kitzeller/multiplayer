import io from 'socket.io-client';
import * as $ from 'jquery';

export default class Client {
    constructor() {

        const socket = io.connect(process.env.HOST);

        // console.log('init');
        // socket.on('connect', onConnect);
        // function onConnect(){
        //     console.log('connect ' + socket.id);
        // }

        // Prompt user for name
        var name = prompt("Please enter your name", "");
        if (name != null || name !== "") {
            socket.emit('send-nickname', name);
        }

        $('form').submit(function (e) {
            e.preventDefault(); // prevents page reloading
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
        });
        socket.on('chat message', function (msg) {
            $('#messages').append($('<li>').text(msg));
        });

        socket.on('currentPlayers', function (msg) {
            console.log(msg);
        });
    }
}
