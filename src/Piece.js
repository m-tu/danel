export default function Piece(x, y, type, player) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.player = player;
}

Piece.prototype.distance = function (piece) {
	return Math.abs(this.y - piece.y);
};