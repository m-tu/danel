import Board from './Board';
import css from './css/main.css';
import io from './server/node_modules/socket.io-client';

let socket = io();
let userName = 'test';

window.socket = socket;
window.Board = Board;

socket.on('setup', function (msg) {
	if (!userName) {
		userName = window.prompt('Enter name');
	}
	console.log("name: ", userName, socket.id);

	if (userName) {
		socket.emit('setup', {
			player: userName,
			id: socket.id || null
		});
	} else {
		window.alert('No name entered -  playing single player');
	}
});

socket.on('newPlayer', function (players) {
	console.log("PLAYERS: ", players);
	let playerList = document.getElementById('player-list');
	playerList.innerHTML = '';
	if (players.length > 1) {
		players.forEach(player => {
			if (player !== userName) {
				let li = document.createElement("div");
				li.innerHTML = player;
				li.addEventListener('click', askToPlay);
				playerList.appendChild(li);
			}
		});
	}
});

let potentialOpponent = null;

socket.on('askingForGame', function (msg) {
	console.log("Is asking for game: ", msg);
	if (potentialOpponent === null) {
		potentialOpponent = msg;
	}

	let askGame = document.querySelector('#asking-for-game');
	let name = document.querySelector('.name');

	name.innerHTML = msg.name;
	askGame.classList.remove('hidden');
});

function askToPlay(e) {
	console.log("ask to play: ", e.target.innerHTML);
	socket.emit('askGame', {
		to: e.target.innerHTML,
		from: socket.id
	});
}

function onMoves(moves) {
	console.log("move: ", moves);
	moves.forEach(move => {
		const validation = board.validateMove(move.to, move.from);
		if (validation.valid) {
			console.log("move: ", validation.to, validation.from);
			board.pickUpPiece(validation.from, false);
			board.move(validation, false);
		} else {
			console.log("Opponent move not valid");
		}
	});

	board.endTurn();
}

socket.on('move', onMoves);

function makeMove(moves) {
	console.log("This turn moves: ", moves);
	// socket.emit('move', {
	// 	to: opponent,
	// 	moves: moves
	// });
}

let opponent = null;
let board;

socket.on('gameStarted', function (startGame) {
	console.log("startGame: ", startGame);
	board = new Board(startGame[userName], makeMove);
	window.board = board;
	for (let i in startGame) {
		if (i !== userName) {
			opponent = i;
		}
	}
});

let game = {
	onMove: onMoves
};

window.game = game;

let accept = document.querySelector('#accept');
let decline = document.querySelector('#decline');

accept.addEventListener('click', () => {
	hideAskingForGame();
	socket.emit('gameAcceptDecision', {
		from: socket.id,
		to: potentialOpponent.name,
		decision: true
	});
});

decline.addEventListener('click', () => {
	hideAskingForGame();

	socket.emit('gameAcceptDecision', {
		from: socket.id,
		to: potentialOpponent.name,
		decision: false
	});
});

function hideAskingForGame() {
	let askGame = document.querySelector('#asking-for-game');
	askGame.classList.add('hidden');
}


