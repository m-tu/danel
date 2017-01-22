export default function Piece(x, y, player, type) {
	this.x = x;
	this.y = y;
	this.player = player;
	this.type = type || 1;
}