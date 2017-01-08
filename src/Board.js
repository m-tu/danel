export default function Board() {
	this.cells = [];
	this.turn = 1;
	this.currentPiece = null;
	this.lastCell = null;

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
			let pieceDiv = document.createElement("div");

			div.appendChild(pieceDiv);

			div.classList = 'cell';
			div.dataset.x = x;
			div.dataset.y = y;

			let cell = {
				x: x,
				y: y,
				filled: false,
				el: pieceDiv
			};

			this.cells[x][y] = cell;

			if ((x + y) % 2 !== 0) {
				div.classList.add('green');
			}

			if ((x + y) % 2 !== 0 && y < 3) {
				pieceDiv.classList += ' piece black';
				cell.piece = {
					player: 2,
					type: 'peasant'
				}
			}

			if ((x + y) % 2 !== 0 && y > 4) {
				pieceDiv.classList += ' piece white';
				cell.piece = {
					player: 1,
					type: 'peasant'
				}
			}

			function distance(p1, p2) {
				return Math.abs(p1.y - p2.y);
			}

			function removePiece(cell, turn) {
				delete cell.piece;
				var classesToRemove = ['piece', 'white', 'black'];

				if (turn != undefined) {
					if(turn === 1) {
						classesToRemove.splice(2, 1);
					} else {
						classesToRemove.splice(1, 1);
					}
				}

				cell.el.classList.remove.apply(cell.el.classList, classesToRemove);
			}

			div.addEventListener('click', (e) => {
				const {x, y} = e.currentTarget.dataset;

				let cell = this.cells[x][y];

				if ((cell.piece && cell.piece.player != this.turn) || !this.currentPiece && !cell.piece) {
					//not your turn
					console.log("Nothing");
					return;
				}

				if (this.currentPiece) {
					if (cell.piece) {
						console.error('Piece already present');
						return;
					}

					if (distance(cell, this.lastCell) === 2) {
						let cellInBtw = this.findPieceInBtw(this.lastCell, cell);
						if (cellInBtw.piece) {
							removePiece(cellInBtw);
						} else {
							console.error('Cannot remove piece because it does not exist')
						}
					}

					cell.piece = this.currentPiece;
					this.currentPiece = null;
					cell.el.classList.add('piece', this.turn == 1 ? 'white' : 'black');

					if(!equal(cell, this.lastCell)) {
						this.endTurn();
					} else {
						console.log('Piece was returned to its original location');
					}
				} else {
					this.currentPiece = Object.assign({}, cell.piece);
					this.lastCell = cell;
					removePiece(cell, this.turn);
				}


			});

			col.appendChild(div);
		}
	}

	setCurrentTurnClass(this.turn);
	container.appendChild(fragment);
};

Board.prototype.endTurn = function () {
	this.turn = this.turn == 1 ? 2 : 1;
	setCurrentTurnClass(this.turn);
};

function setCurrentTurnClass(turn) {
	var board = document.getElementById('app').classList;
	if(turn === 1) {
		document.querySelector('#turn').innerHTML = 'WHITE';
		board.remove('turn-black');
		board.add('turn-white');
	} else {
		document.querySelector('#turn').innerHTML = 'BLACK';
		board.remove('turn-white');
		board.add('turn-black');
	}
}

function equal(p1, p2) {
	return p1.x === p2.x && p1.y === p2.y;
}

Board.prototype.findPieceInBtw = function(p1, p2) {
	let x, y;
	if (p1.x < p2.x) {
		x = p1.x + 1;
	} else {
		x = p1.x - 1;
	}
	y = p1.y + (p1.y < p2.y ? 1 : -1);

	return this.cells[x][y];
};


