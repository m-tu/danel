import Board from './Board';
import css from './css/main.css';
import io from './server/node_modules/socket.io-client';

let socket = io();

socket.on('move', function(move){
	console.log("move: ", move);
});

window.sokk = socket;
let board = new Board();

