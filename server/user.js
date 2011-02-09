var User = module.exports = function(id) {
	this.id = id;
	this.position = {x: 0, y: 0};
	
	this.update = function(data) {
		this.position.x = data[1];
		this.position.y = data[2];
	}
	
	this.encode = function() {
		return this.position.x + ',' + this.position.y;
	}
}