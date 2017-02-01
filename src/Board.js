import Piece from './Piece';

export default function Board(player, cb) {
	this.cells = [];
	this.player = player || 1;
	this.turn = 1;
	this.currentPiece = null;
	this.lastCell = null;

	this.broadcastMoves = cb;
	this.currentTurnMoves = [];

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
			// div.innerHTML += 'x: ' + x + ' y: ' + y;

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

function isOnTheSameDiagonal(cell, lastCell) {
	return Math.abs(cell.x - lastCell.x) === Math.abs(cell.y - lastCell.y);
}

Board.prototype.validateMove = function(cell, lastCell) {
	let move = {
		valid: true,
		from: lastCell,
		to: cell,
		removedPieces: []
	};

	if (!isOnTheSameDiagonal(cell, lastCell)) {
		console.log("Move not on the same diagonal");
		return {valid: false};
	}

	const dist = distance(cell, lastCell);
	let cellsInBtw = this.findPiecesInBtw(lastCell, cell);

	if (dist === 2 && cellsInBtw.length === 1) {
		if (cellsInBtw[0].piece) {
			move.removedPieces.push(cellsInBtw[0]);
		} else {
			console.error('Cannot remove piece because it does not exist')
		}
	} else if (dist > 2 && this.currentPiece.type === 2) {
		const ownPieces = cellsInBtw.filter(cell => {
			return cell.piece && cell.piece.player === this.turn;
		});

		if (!ownPieces.length) {
			//if there are no blocking own pieces see if there are double enemy pieces
			const {xDir, yDir} = findMoveDirection(cell, lastCell);
			const unCapturablePieces = cellsInBtw.filter((cell) => {
				return this.cells[cell.x + xDir][cell.y + yDir].piece;
			});

			if (unCapturablePieces.length) {
				console.error('Cannot take because of double pieces');
				return;
			} else {
				cellsInBtw.forEach(cell => {
					move.removedPieces.push(cell);
				})
			}
		} else {
			console.log('Player own pieces are blocking the capture');
		}
	} else if (dist === 1 || dist === 0) {
		console.log("normal move");
	} else {
		console.log("Distance too long", dist);
		move.valid = false;
	}

	return move;
};

Board.prototype.move = function (move, local) {
	if (move.removedPieces.length) {
		move.removedPieces.forEach(cell => {
			delete cell.piece;
			removePiece(cell);
		});
	}
	let cell = this.cells[move.to.x][move.to.y];

	if(local) {
		cell.piece = this.currentPiece;
		this.currentPiece = null;
		this.lastCell.el.classList.remove('highlight');
	}

	if (cell.y === 0 && this.turn === 1 || cell.y === 7 && this.turn === 2) {
		cell.piece.type = 2;
	}


	addPiece(cell);
};

function onClick(e) {
	if(this.turn !== this.player) {
		console.log("not your turn");
		return;
	}

	const {x, y} = e.currentTarget.dataset;
	let cell = this.cells[x][y];

	if (cell.piece && cell.piece.player != this.turn || !this.currentPiece && !cell.piece) {
		//not your turn
		console.log("Nothing");
		return;
	}

	if (this.currentPiece) {
		if (cell.piece) {
			console.log('Piece already present');
			return;
		}

		if ((cell.x + cell.y) % 2 === 0) {
			console.log("pls");
			return;
		}

		const move = this.validateMove(cell, this.lastCell);

		if (move.valid) {
			this.currentTurnMoves.push({
				from: {
					x: this.lastCell.x,
					y: this.lastCell.y
				},
				to: {
					x: cell.x,
					y: cell.y
				}
			});

			this.move(move, true);

			if (move.removedPieces.length && this.canPieceBeTaken(cell)) {
				//if there are more pieces that can be taken, don't end the turn
				return;
			}

			if (!equal(cell, this.lastCell)) {
				this.endTurn();
				this.broadcastMoves(this.currentTurnMoves);
			} else {
				console.log('Piece was returned to its original location');
			}
		}

	} else {
		this.currentPiece = Object.assign({}, cell.piece);
		this.lastCell = cell;
		delete cell.piece;

		removePiece(cell);
		//highlight home cell
		cell.el.classList.add('highlight');
	}
}

function removePiece(cell) {
	cell.el.innerHTML = '';
}

function addPiece(cell) {
	let pieceDiv = document.createElement("div");
	if (cell.piece.player === 1) {
		pieceDiv.classList += ' piece white';
	} else {
		pieceDiv.classList += ' piece black';
	}
	if (cell.piece.type == 2) {
		pieceDiv.classList.add('tamm');
	}

	cell.piece.el = pieceDiv;
	cell.el.appendChild(pieceDiv);
}

Board.prototype.redraw = function () {
	this.cells.forEach((col) => {
		col.forEach((cell) => {
			if (cell.el.classList.contains('piece') && !cell.piece) {
				removePiece(cell);
			} else if (cell.piece) {
				addPiece(cell);
			}
		});
	})
};

Board.prototype.addPieces = function (pieces) {
	if (pieces) {
		pieces.forEach((p) => {
			const {x, y} = p;
			this.cells[x][y].piece = p;
		});
	} else {
		let x, y;
		for (x = 0; x < 8; x++) {
			for (y = 0; y < 8; y++) {
				if ((x + y) % 2 !== 0 && y < 3) {
					this.cells[x][y].piece = new Piece(x, y, 2);
				}
				if ((x + y) % 2 !== 0 && y > 4) {
					this.cells[x][y].piece = new Piece(x, y, 1);
				}
			}
		}
	}
};

Board.prototype.endTurn = function () {
	this.turn = this.turn == 1 ? 2 : 1;
	setCurrentTurnClass(this.turn);
	areThereValidMoves();
};

function areThereValidMoves() {
	//if not end game
}

Board.prototype.canPieceBeTaken = function (cell) {
	let cells = this.cells;
	const {x, y} = cell;

	//TODO check for out of bounds first
	//TODO combine for type 1 and 2

	if (cell.piece.type === 2) {
		let a = x - y;
		let b = y + x;

		const p1 = a >= 0 ? {x: a, y: 0} : {x: 0, y: -a};
		const p2 = b >= 7 ? {x: b - 7, y: 7} : {x: 0, y: b};
		const p3 = {x: p2.y, y: p2.x};
		const p4 = {x: 7 - p1.y, y: 7 - p1.x};

		console.log("PS: ", p1, p2, p3, p4);

		const directions = [
			{xDir: -1, yDir: -1, lastCell: p1},
			{xDir: -1, yDir: 1, lastCell: p2},
			{xDir: 1, yDir: -1, lastCell: p3},
			{xDir: 1, yDir: 1, lastCell: p4}
		];

		let canBeTaken = false;
		directions.forEach(dir => {
			let xC = x + dir.xDir, yC = y + dir.yDir, i = 0;

			const dist = distance(cell, dir.lastCell);
			console.log("dir: ", dir);
			for (; i < dist - 1; i++, xC += dir.xDir, yC += dir.yDir) {
				console.log("x: %s, y: %s", xC, yC);
				let next = this.cells[xC][yC];
				if (next.piece && next.piece.player !== this.turn && !this.cells[xC + dir.xDir][yC + dir.yDir].piece) {
					console.log("Can be taken: ", next);
					canBeTaken = true;
					break;
				}
			}
		});

		return canBeTaken;
	}

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

function findMoveDirection(p1, p2) {
	return {
		xDir: p1.x < p2.x ? 1 : -1,
		yDir: p1.y < p2.y ? 1 : -1
	}
}

Board.prototype.findPiecesInBtw = function (p1, p2) {
	let cellsWithPieces = [];
	const distance = Math.abs(p1.y - p2.y);
	let x, y, i;
	const {xDir, yDir} = findMoveDirection(p1, p2);

	for (x = p1.x + xDir, y = p1.y + yDir, i = 1; i < distance; i++, x += xDir, y += yDir) {
		let cell = this.cells[x][y];
		if (cell.piece) {
			cellsWithPieces.push(cell);
		}
	}

	return cellsWithPieces;
};

