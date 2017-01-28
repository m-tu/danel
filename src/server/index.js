let express = require('express');
let  app = express();
let  http = require('http').Server(app);
let  io = require('socket.io')(http);
let  path = require('path');

let staticResPath = path.join(__dirname, '../../dist');
app.use(express.static(staticResPath));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '../../index.html'));
});

let clients = {};

io.on('connection', function(socket){
	console.log('a user connected: %s, nr: %s', socket.id, Object.keys(clients).length);
	clients[socket.id] = { sokk: socket};

	socket.on('disconnect', function () {
		if(clients[socket.id]) {
			console.log("Removing client because of disconnect: ", socket.id);
			delete clients[socket.id];
		} else {
			console.log("No client to remove");
		}
	});

	socket.on('setup', setup);
	socket.on('move', move);
	socket.on('askGame', askGame);
	socket.on('gameAcceptDecision', gameAcceptDecision);

	socket.emit('setup', {"hello": 'world'})
});

function setup(msg) {
	console.log("SETUP: ", msg);
	if(msg.id && clients[msg.id]) {
		clients[msg.id].player = msg.player;
		clients[msg.id].status = 0; // 0 - idle, 1 - in game, 3 - already negotiating
		io.emit('newPlayer', getPlayers());
	} else {
		console.log("SEtup failed: ", msg);
	}
}

function move(msg){
	console.log('move: ', msg);
	if(msg.to) {
		console.log("Sending moves to: ", msg.to);
		let to = findPlayerBy(msg.to);
		to.sokk.emit('move', msg.moves);
	}
}

function askGame(msg) {
	console.log("Asking for game: ", msg);
	if(msg.from && msg.to) {
		let playerTo = findPlayerBy(msg.to);
		if (playerTo !== null && playerTo.status === 0) {
			playerTo.status = 3;

			//ask for that player if he agrees
			playerTo.sokk.emit('askingForGame', {
				name: clients[msg.from].player
			});

		} else {
			console.log("Player not available");
			//TODO respond
		}
	} else {
		console.log("Cannot start game, no id in msg: ", msg);
	}
}

function gameAcceptDecision(msg) {
	console.log("Player accepted game: ", msg);
	let initiator = findPlayerBy(msg.to),
		recipient = clients[msg.from];

	console.log("%s asked %s for game. Acceptance status: %s", initiator.player, recipient.player, msg.decision);
	if(msg.decision) {
		console.log("Emitting start game msg");
		initiator.status = 1;
		recipient.status = 1;

		let gameStarted = decideSides(initiator.player, recipient.player);
		initiator.sokk.emit('gameStarted', gameStarted);
		recipient.sokk.emit('gameStarted', gameStarted);
	} else {
		console.log("Game was declined, resetting <%s> status from <%s> to <%s>", initiator.sokk.id, initiator.status, 0);
		initiator.status = 0;
	}
}

function decideSides(player1, player2) {
	const side = Math.random() < 0.5;
	let info = {};
	info[player1] = side ? 1 : 2;
	info[player2] = side ? 2 : 1;
	return info;
}

function findPlayerBy(name) {
	for (let id in clients) {
		let client = clients[id];
		if (client.player && client.player === name) {
			return client;
		}
	}
	return null;
}

function getPlayers() {
	let names = [];
	for(const client in clients) {
		if (clients[client].player) {
			names.push(clients[client].player);
		}
	}
	return names;
}

http.listen(3210, function(){
	console.log('listening on *:3210');
});