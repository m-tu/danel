import Board from './Board';
import css from './css/main.css';
import io from './server/node_modules/socket.io-client';

let socket = io();
let userName;

socket.on('setup', function(msg){
	if(!userName) {
		userName = window.prompt('Enter name');
	}
	console.log("name: ", userName, socket.id);

	if(userName) {
		socket.emit('setup', {
			player: userName,
			id: socket.id || null
		});
	} else {
		window.alert('No name entered -  playing single player');
	}
});

socket.on('newPlayer', function(players){
	console.log("PLAYERS: ", players);
	let playerList = document.getElementById('player-list')
	playerList.innerHTML = '';
	if(players.length > 1) {
		players.forEach( player => {
			if(player !== userName) {
				let li = document.createElement("div");
				li.innerHTML = player;
				li.addEventListener('click', askToPlay);
				playerList.appendChild(li);
			}
		});
	}
});

function askToPlay(e) {
	console.log("ask to play: ", e.target.innerHTML);
}

socket.on('move', function(move){
	console.log("move: ", move);
});

window.sokk = socket;
let board = new Board();

