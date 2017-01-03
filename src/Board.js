export default function Board() {
	this.cells = [];
	this.create();
}

Board.prototype.create = function () {
	let fragment = document.createDocumentFragment(),
			container = document.getElementById('app');

	for (let i = 0; i < 8; i++) {
		this.cells[i] = [];
		let col = document.createElement("div");
		col.classList = 'col';
		fragment.appendChild(col);

		for (let j = 0; j < 8; j++) {
			let div = document.createElement("div");
			div.classList = 'cell';

			if ((i + j) % 2 !== 0 && j < 3) {
				div.classList += ' piece black'
			}

			if ((i + j) % 2 !== 0 && j > 4) {
				div.classList += ' piece white'
			}

			let cell = {
				x: i,
				y: j,
				filled: false,
				el: div
			};

			this.cells[i][j] = cell;

			div.addEventListener('click', function () {
				div.classList.toggle('picked');
			});

			col.appendChild(div);
		}
	}

	container.appendChild(fragment);
};



