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
		this.cursorType = data.cursorType;
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
	
	var WebSocketService = function(model, webSocket) {
		var webSocketService = this,
			model = model,
			webSocket = webSocket
		;
		
		this.hasConnection = false;
		
		this.welcomeHandler = function(data) {
			console.log('WebSocket connection opened:', data);
			webSocketService.hasConnection = true;
		};
		
		this.updateHandler = function(data) {
			console.log('WebSocket update recieved:', data);
			
			var data = BehindUtils.parseCursor(data);
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
		
		this.sendUpdate = function(cursor) {
			console.log('Sending update on:', cursor);
			webSocket.send(BehindUtils.serializeCursor(cursor));
		}
	};
	
	var App = function() {
		var webSocket,
			webSocketService,
			model = {};
			
		(function() {
			model.cursors		= {};
			
			webSocket			= new io.Socket(settings.serverUrl);
			webSocketService	= new WebSocketService(model, webSocket);
			
			webSocket.on('welcome',		webSocketService.welcomeHandler);
			webSocket.on('update',		webSocketService.updateHandler);
			webSocket.on('disconnect',	webSocketService.disconnectHandler);
		})();
	};
	
	(function(options) {
		$.extend(settings, options);
		app = new App();
	})(options);
};