(function($) {
	var Cursor = function(el) {
		var c = this;
		c.x = 0;
		c.y = 0;
		c.element = el;
	}
	
	var Behind = function(options) {
		var mouse = {x:0,y:0},
			settings = {
				behindSelector: '#behind',
				pageSelector: '#page',
				delay: 10
			},
			cursor,
			time = 0
		;
		
		$.extend(settings, options);
		
		var behind = $(settings.behindSelector);
		var page = $(settings.pageSelector);
		
		cursor = new Cursor(behind.find('.cursor'));
		
		var move = function() {
			time+=.02;
			cursor.x = Math.cos(time)*200+500;
			cursor.y = Math.sin(time)*200+500;
			
			cursor.element.css({
				left: cursor.x,
				top: cursor.y
			});
		}
		
		$(document).click(function() {
			page.animate({
				top: $(window).height()-100
			}, 1000, 'easeOutBounce');
			
			setTimeout(function() {
				cursor.element.removeClass('blurred');
			}, 200);
		});
		
		$(document).mousemove(function(e) {
			mouse = {
				x: e.clientX,
				y: e.clientY
			}
		});
		
		setInterval(move, 30);
	}
	
	$(function() {
		new Behind();
	});
})(jQuery);