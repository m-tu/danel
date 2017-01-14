import Piece from './Piece';

export default function Board() {
	this.cells = [];
	this.turn = 1;
	this.currentPiece = null;
	this.lastCell = null;

	this.create();
	this.addPieces();
	this.redraw();
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
			div.dataset.x = x;
			div.dataset.y = y;

			this.cells[x][y] = {
				x: x,
				y: y,
				el: div
			};

			if ((x + y) % 2 !== 0) {
				div.classList.add('green');
			}

			div.addEventListener('click', (e) => {
				onClick.call(this, e);
			});
			col.appendChild(div);
		}
	}

	setCurrentTurnClass(this.turn);
	container.appendChild(fragment);
};

function distance(p1, p2) {
	return Math.abs(p1.y - p2.y);
}


function onClick(e) {

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

			let pieceWasTaken = false;
			const dist = distance(cell, this.lastCell);
			if (dist === 2) {
				let cellsInBtw = this.findPiecesInBtw(this.lastCell, cell);
				console.log("cellsinbtw: ", cellsInBtw);
				if (cellsInBtw[0].piece) {
					delete cellsInBtw[0].piece;
					removePiece(cellsInBtw[0]);
					pieceWasTaken = true;
				} else {
					console.error('Cannot remove piece because it does not exist')
				}
			} else if (dist > 2) {
				if (piece.type !== 2) {
					return;
				}

			}

			cell.piece = this.currentPiece;

			if (cell.y === 0 && this.turn === 1 || cell.y === 7 && this.turn === 2) {
				cell.piece.type = 2;
			}

			this.currentPiece = null;

			addPiece(cell);

			if (pieceWasTaken && this.canPieceBeTaken(cell)) {
				//if there are more pieces that can be taken, don't end the turn
				return;
			}

			if (!equal(cell, this.lastCell)) {
				this.endTurn();
			} else {
				console.log('Piece was returned to its original location');
			}
		} else {
			this.currentPiece = Object.assign({}, cell.piece);
			this.lastCell = cell;
			delete cell.piece;

			removePiece(cell);
		}
}

function removePiece(cell) {
	cell.el.innerHTML = '';
}

function addPiece(cell) {
	let pieceDiv = document.createElement("div");
	if(cell.piece.player === 1) {
		pieceDiv.classList += ' piece white';
	} else {
		pieceDiv.classList += ' piece black';
	}
	if (cell.piece.type == 2) {
		cell.el.classList.add('tamm');
	}
	cell.piece.el = pieceDiv;
	cell.el.appendChild(pieceDiv);
	pieceDiv.innerHTML += 'x: ' + cell.x + ' y: ' + cell.y;
}

Board.prototype.redraw = function () {
	this.cells.forEach( (col) => {
		col.forEach( (cell) => {
			if(cell.el.classList.contains('piece') && !cell.piece) {
				removePiece(cell);
			} else if (cell.piece) {
				addPiece(cell);
			}
		});
	})
};

Board.prototype.addPieces = function (pieces) {
	if(pieces) {
		pieces.forEach((p) => {
			const {x, y} = p;
			this.cells[x][y].piece = p;
		});
	} else {
		let x, y;
		for(x = 0; x < 8; x++) {
			for(y = 0; y < 8; y++) {
				if ((x + y) % 2 !== 0 && y < 3) {
					this.cells[x][y].piece = new Piece(x, y, 1, 2);
				}
				if ((x + y) % 2 !== 0 && y > 4) {
					this.cells[x][y].piece = new Piece(x, y, 1, 1);
				}
			}
		}
	}
};

Board.prototype.endTurn = function () {
	this.turn = this.turn == 1 ? 2 : 1;
	setCurrentTurnClass(this.turn);
};


Board.prototype.canPieceBeTaken = function (cell) {
	let cells = this.cells;
	const {x, y} = cell;

	//TODO check for out of bounds first

	// can simplify
	if (x - 2 >= 0 && y - 2 >= 0) {
		let cell = cells[x - 1][y - 1];
		if (cell.piece && cell.piece.player !== this.turn && !cells[x - 2][y - 2].piece) {
			console.log("Cell can be taken: ", cell);
			return true;
		}
	}

	if (x + 2 <= 7 && y - 2 >= 0) {
		let cell = cells[x + 1][y - 1];
		if (cell.piece && cell.piece.player !== this.turn && !cells[x + 2][y - 2].piece) {
			console.log("Cell can be taken: ", cell);
			return true;
		}
	}
	if (x - 2 >= 0 && y + 2 <= 7) {
		let cell = cells[x - 1][y + 1];
		if (cell.piece && cell.piece.player !== this.turn && !cells[x - 2][y + 2].piece) {
			console.log("Cell can be taken: ", cell);
			return true;
		}
	}
	if (x + 2 <= 7 && y + 2 <= 7) {
		let cell = cells[x + 1][y + 1];
		if (cell.piece && cell.piece.player !== this.turn && !cells[x + 2][y + 2].piece) {
			console.log("Cell can be taken: ", cell);
			return true;
		}
	}
};

function setCurrentTurnClass(turn) {
	var board = document.getElementById('app').classList;
	if (turn === 1) {
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

Board.prototype.findPiecesInBtw = function (p1, p2) {
	let cellsWithPieces = [];
	const distance = Math.abs(p1.y - p2.y);
	let x, y, i;
	const xDirection = p1.x < p2.x ? 1 : -1;
	const yDirection = p1.y < p2.y ? 1 : -1;

	for (x = p1.x + xDirection, y = p1.y + yDirection, i = 1; i < distance; i++, x += xDirection, y += yDirection) {
		let cell = this.cells[x][y];
		if (cell.piece) {
			cellsWithPieces.push(cell);
		}
	}

	return cellsWithPieces;
};

