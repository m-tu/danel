export default function Board() {
	this.cells = [];
	this.turn = 1;
	this.currentPiece = null;

	this.create();
}

Board.prototype.create = function () {
	let fragment = document.createDocumentFragment(),
			container = document.getElementById('app');

	for (let x = 0; x < 8; x++) {
		this.cells[x] = [];
		let col = document.createElement("div");
		col.classList = 'col';
		fragment.appendChild(col);

		for (let y = 0; y < 8; y++) {
			let div = document.createElement("div");
			div.classList = 'cell';
			div.innerHTML = x + ' ' +y;
			div.dataset.x = x;
			div.dataset.y = y;

			let cell = {
				x: x,
				y: y,
				filled: false,
				el: div
			};

			this.cells[x][y] = cell;

			if ((x + y) % 2 !== 0 && y < 3) {
				div.classList += ' piece black';
				cell.piece = {
					player: 2,
					type: 'peasant'
				}
			}

			if ((x + y) % 2 !== 0 && y > 4) {
				div.classList += ' piece white';
				cell.piece = {
					player: 1,
					type: 'peasant'
				}
			}

			function findPieceInBtw(p1, p2) {
				let x,y;
				if (p1.x < p2.x) {
					x = p1.x + 1;
				} else {
					x = p1.x - 1;
				}
				y = p1.y + (p1.y < p2.y ? 1 : -1);
				return this.cells[x][y];
			}

			div.addEventListener('click',  (e) => {
					const {x, y} = e.currentTarget.dataset;

					let cell = this.cells[x][y];

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



