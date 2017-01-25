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
	let playerList = document.getElementById('player-list');
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

socket.on('askingForGame', function(msg){
	console.log("Is asking for game: ", msg);
	let askGame = document.querySelector('#asking-for-game');
	let name = document.querySelector('.name');

	name.innerHTML = msg.player;
	askGame.classList.remove('hidden');
});

function askToPlay(e) {
	console.log("ask to play: ", e.target.innerHTML);
	socket.emit('askGame', {
		to: e.target.innerHTML,
		from: socket.id
	});
}

socket.on('move', function(move){
	console.log("move: ", move);
});

let accept = document.querySelector('#accept');
let decline = document.querySelector('#decline');

accept.addEventListener('click', () => {
	let askGame = document.querySelector('#asking-for-game');
	askGame.classList.remove('hidden');
});


window.sokk = socket;
let board = new Board();

