var fs = require('fs')
var http = require('http')
var io = require('../lib/socket.io')

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
	client.broadcast(1 + ',' + client.sessionId);

	client.on('message', function(message) {
		var data = message.split(',');
		var type = data[0];
		
		switch (type) {
			case 2: // Update
				client.user.update(data);
				client.broadcast(data.type + ',', client.user.encode());
				break;
		}
	});
	
	client.on('disconnect', function(message) {
		console.log(client.sessionId + ' disconnected.');

		client.broadcast(3 + ',' + client.sessionId);
	});
});