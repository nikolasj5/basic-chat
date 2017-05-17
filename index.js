var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/html/index.html');
});

var users_online = [];
io.on('connection', function(socket){
	console.log('a user connected');

	var nickname = '';
	socket.emit('chat message', 'What\'s your name');

	socket.on('disconnect', function(){
		console.log('User disconnected: '+nickname);
		io.emit('chat message', nickname+' is off');
		

		index =	users_online.findIndex(function(user){
			return user.match(nickname)
		});
		users_online.splice(index,1);
		io.emit('user_change', users_online);
	})

	socket.on('chat message', function(msg){
		if (nickname == ''){
			nickname = msg;

			greet = "Thanks "+nickname+", now you're on the loop";
			socket.emit('chat message', greet);
			socket.broadcast.emit('chat message', nickname+" is on");

			users_online.push(nickname);
			io.emit('user_change', users_online);

			console.log('User connected: '+nickname);
		} else {
			socket.broadcast.emit('chat message', nickname+': '+msg);
		}
	});

	socket.on('typing', function(stat){
		socket.broadcast.emit('typing', stat, nickname)
	})
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
