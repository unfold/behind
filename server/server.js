var fs = require('fs')
var http = require('http')
var io = require('../lib/socket.io')
var User = require('./user')

var server = http.createServer(function(request, response) {
	response.writeHead(400);
	response.write('404');
	response.end();
})

server.listen(8080);

var socket = io.listen(server);
socket.on('connection', function(client) {
	console.log(client.sessionId + ' connected.');
	
	client.user = new User(client.sessionId);
	//client.broadcast(JSON.stringify({type: 'welcome', user: client.user}));

	client.on('message', function(message) {
		var data = JSON.parse(message);
		
		switch (data.type) {
			case 'update':
				client.user.update(data);
				client.broadcast(JSON.stringify({type: 'update', user: client.user}));
				break;
		}
	});
	
	client.on('disconnect', function(message) {
		console.log(client.sessionId + ' disconnected.');

		client.broadcast(JSON.stringify({type: 'disconnect', user: client.user}));
	});
});