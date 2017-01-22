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

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('move', function(move){
		console.log('move: ', move);
		io.emit('move', 'hello everybody');
	});
});

http.listen(3210, function(){
	console.log('listening on *:3210');
});