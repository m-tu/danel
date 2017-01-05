export default function Board() {
	this.cells = [];
	this.turn = 1;
	this.currentPiece = null;

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
					player: 2,
					type: 'peasant'
				}
			}

			if ((i + j) % 2 !== 0 && j > 4) {
				div.classList += ' piece white';
				cell.piece = {
					player: 1,
					type: 'peasant'
				}
			}

			div.addEventListener('click',  (e) => {
					const {i, j} = e.currentTarget.dataset;
					console.log("click: ", i, j, typeof i);

					let cell = this.cells[i][j];

					if (this.currentPiece == null && cell.piece && cell.piece.player == this.turn) {
						this.currentPiece = Object.assign({}, cell.piece);
						delete cell.piece;
						cell.el.classList.remove('piece', this.turn == 1 ? 'white' : 'black');
					} else if(this.currentPiece && !cell.piece) {
						cell.piece = this.currentPiece;
						this.currentPiece = null;

						cell.el.classList.add('piece', this.turn == 1 ? 'white' : 'black');

						this.turn = this.turn == 1 ? 2 : 1;
					}
			});

			col.appendChild(div);
		}
	}

	container.appendChild(fragment);
};



