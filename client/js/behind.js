var Behind = function(options) {
	var app;
	
	var settings = {
		serverUrl: 'localhost',
		behindElement: $('#behind'),
		pageElement: $('#page')
	};
	
	var Cursor = function(appendToEl, x, y, cursorType) {
		var c = this;
		
		this.target = this.position	= {x: x,y: y};
		this.cursorType = cursorType;
		this.element = $('<div/>', {'class': 'cursor'});
		
		this.update = function() {
			
		};
		
		(function() {
			appendToEl.append(c.element);
		})();
	};
	
	var WebSocketService = function(model, webSocket) {
		var webSocketService = this,
			model = model,
			webSocket = webSocket
		;
		
		this.welcomeHandler = function() {
			
		};
		
		this.updateHandler = function() {
			
		};
		
		this.disconnectHandler = function() {
			
		};
		
		this.sendUpdate = function(cursor) {
			
		}
	};
	
	var App = function() {
		var webSocket,
			webSocketService,
			model;
			
		(function() {
			// webSocket			= new io.Socket(settings.serverUrl);
			// webSocketService	= new WebSocketService(model, webSocket);
		})();
	};
	
	
	(function(options) {
		$.extend(settings, options);
		app = new App();
	})(options);
};


(function($) {
	$(function() {
		new Behind();
	});
})(jQuery);