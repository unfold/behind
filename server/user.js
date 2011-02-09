var User = exports = module.exports = function User(id) {
	this.id = id;
	this.position = {x: 0, y: 0};
}

User.prototype.update = function(data) {
	this.position.x = data.position.x;
	this.position.y = data.position.y;
}