export default function Piece(x, y, player, type) {
	this.x = x;
	this.y = y;
	this.player = player;
	this.type = type || 1;
}

Piece.prototype.distance = function (piece) {
	return Math.abs(this.y - piece.y);
};