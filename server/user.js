var User = exports = module.exports = function User(id) {
	this.id = id;
	this.position = {x: 0, y: 0};
}

User.prototype.update = function(data) {
	this.position.x = data[1];
	this.position.y = data[2];
}

User.prototype.encode = function() {
	return this.position.x + ',' + this.position.y;
}