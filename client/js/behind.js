var Behind = function(options) {
	var app;
	
	var settings = {
		serverUrl: 'localhost',
		behindElement: $('#behind'),
		pageElement: $('#page')
	};
	
	var Cursor = function(data) {
		var c = this,
			moveInterval;
		
		this.id			= data.id;
		this.target		= this.position	= {x: data.x,y: data.y};
		this.element	= $('<div/>', {'class': 'cursor'});
		
		this.isTimeToMove = function() {
			return 	Math.round(c.position.x * .8) != Math.round(c.target.x * .8)
				||	Math.round(c.position.y * .8) != Math.round(c.target.y * .8);
		};
		
		this.update = function(data) {
			this.target = { x: data.x,y: data.y };
			if(c.isTimeToMove()) {
				moveInterval = setInterval(c.move, 30);
			}
		};
		
		this.moveElementToPosition = function() {
			c.element.css({
				left: c.position.x,
				top: c.position.y
			});
		}
		
		this.move = function() {
			c.position.x += (c.target.x - c.position.x) / 10;
			c.position.y += (c.target.y - c.position.y) / 10;
			
			c.moveElementToPosition();
			
			if(!c.isTimeToMove) {
				clearInterval(moveInterval);	
			}
		};
		
		(function() {
			settings.behindElement.append(c.element);
			c.moveElementToPosition();
		})();
	};
	
	var UserCursor = function() {
		var c  = this;
		this.x = 0;
		this.y = 0;
		
		var mousemove = function(e) {
			c.x = e.clientX;
			c.y = e.clientY;
		};
		
		(function() {
			$(document).bind('mousemove', mousemove);
		})();
	}
	
	var WebSocketService = function(model, webSocket) {
		var webSocketService = this,
			model = model,
			webSocket = webSocket
		;
		
		this.hasConnection = false;
		
		this.connectHandler = function(data) {
			console.log('WebSocket connection opened:');
			webSocketService.hasConnection = true;
		};
		
		this.messageHandler = function(data) {
			console.log('WebSocket update recieved:', data);
			
			var data = $.parseJSON(data);
			var cursor = model.cursors[data.id];
			
			// New cursor
			if(!cursor) {
				cursor = model.cursors[data.id] = new Cursor(data);
			} else {
				cursor.update(data);
			}
		};
		
		this.disconnectHandler = function(data) {
			console.log('WebSocket connection closed:', data);
			webSocketService.hasConnection = false;
		};
		
		this.sendUpdate = function(userData) {
			if(webSocketService.hasConnection) {
				console.log('Sending update on:', data);
				var sendData = {
					x: userData.x,
					y: userData.y,
					type: 'update'
				}
				webSocket.send(JSON.stringify(sendData));
			} else {
				console.log('Has no connection. Data not sent.')
			}
		}
	};
	
	var App = function() {
		var webSocket,
			webSocketService,
			model = {};
		
		var sendUserUpdate = function(e) {
			webSocketService.sendUpdate(model.userCursor);
		};
		
		(function() {
			model.cursors		= {};
			model.userCursor	= new UserCursor();
			
			webSocket			= new io.Socket(settings.serverUrl, {port: 8080, rememberTransport: false});
			webSocketService	= new WebSocketService(model, webSocket);
			
			webSocket.on('connect',		webSocketService.connectHandler);
			webSocket.on('message',		webSocketService.messageHandler);
			webSocket.on('disconnect',	webSocketService.disconnectHandler);
			
			webSocket.connect();
			
			$(document).bind('mousemove', $.throttle(200, sendUserUpdate));
		})();
	};
	
	(function(options) {
		$.extend(settings, options);
		app = new App();
	})(options);
};