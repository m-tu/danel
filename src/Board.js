export default function Board() {
	this.cells = [];
	this.create();
}

Board.prototype.create = function () {
	console.log("create board");

	let fragment = document.createDocumentFragment(),
			container = document.getElementById('app');

	for (let i = 0; i < 8; i++) {
		this.cells[i] = [];
		for (let j = 0; j < 8; j++) {
			let div = document.createElement("div");
			div.classList = 'cell';

			this.cells[i][j] = {
				x: i,
				y: j,
				filled: false,
				el: div
			};

			fragment.appendChild(div);
		}
	}

	container.appendChild(fragment);
};



