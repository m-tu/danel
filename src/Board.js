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

			div.dataset.i = i;
			div.dataset.j = j;

			let cell = {
				x: i,
				y: j,
				filled: false,
				el: div
			};

			this.cells[i][j] = cell;

			if ((i + j) % 2 !== 0 && j < 3) {
				div.classList += ' piece black';
				cell.piece = {
					color: 'black',
					type: 'peasant'
				}
			}

			if ((i + j) % 2 !== 0 && j > 4) {
				div.classList += ' piece white';
				cell.piece = {
					color: 'white',
					type: 'peasant'
				}
			}

			div.addEventListener('click',  (e) => {
					const {i, j} = e.currentTarget.dataset;
					console.log("click: ", i, j, typeof i);

					let cell = this.cells[i][j];
			});

			col.appendChild(div);
		}
	}

	container.appendChild(fragment);
};



