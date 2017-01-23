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

	socket.on('disconnect', function(){
		if (clients[socket.id]) {
			delete clients[socket.id];
			console.log("Disconnected client: ", socket.id);
		} else {
			console.log("ERROR: Could not disconnect client: ", socket.id);
		}
	});

	socket.on('setup', setup);
	socket.on('move', move);
	socket.on('startGame', startGame);

	socket.emit('setup', {"hello": 'world'})
});

function setup(msg) {
	console.log("SETUP: ", msg);
	if(msg.id && clients[msg.id]) {
		clients[msg.id].player = msg.player;
		clients[msg.id].status = 0; // 0 - idle 1 - in game
		io.emit('newPlayer', getPlayers());
	} else {
		console.log("SEtup failed: ", msg);
	}
}

function move(msg){
	console.log('move: ', msg);
	// io.emit('move', 'hello everybody');
}

function startGame(msg) {
	if(msg.id) {

	} else {
		console.log("Cannot start game, no id in msg: ", msg);
	}
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