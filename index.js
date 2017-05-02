var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');

	var nickname = '';
	socket.emit('chat message', 'Say your name');

	socket.on('disconnect', function(){
		console.log('user disconnected: '+nickname);
		io.emit('chat message', nickname+' disconnected');
	})

	socket.on('chat message', function(msg){
		if (nickname == ''){
			nickname = msg;
			greet = "Thanks "+nickname+", now you can talk";
			socket.emit('chat message', greet);
		} else {
			io.emit('chat message', nickname+":\n"+msg);
		}
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
