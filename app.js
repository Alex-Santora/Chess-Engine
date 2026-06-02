const WHITE = "white";
const BLACK = "black";
const EMPTY = ".";
const FILES = "abcdefgh";
const MATE_SCORE = 1000000;
const INF = 10000000;

const STARTING_BOARD = [
  "rnbqkbnr".split(""),
  "pppppppp".split(""),
  "........".split(""),
  "........".split(""),
  "........".split(""),
  "........".split(""),
  "PPPPPPPP".split(""),
  "RNBQKBNR".split("")
];

const PIECE_VALUES = {
  P: 100,
  N: 300,
  B: 300,
  R: 500,
  Q: 900,
  K: 0
};

const PST = {
  P: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  N: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  B: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  R: [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  Q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  K: [
    [20, 30, 10, 0, 0, 10, 30, 20],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30]
  ]
};

const pieceNames = {
  P: "White pawn",
  N: "White knight",
  B: "White bishop",
  R: "White rook",
  Q: "White queen",
  K: "White king",
  p: "Black pawn",
  n: "Black knight",
  b: "Black bishop",
  r: "Black rook",
  q: "Black queen",
  k: "Black king"
};

const pieceImages = {
  P: "assets/pieces/wp.svg",
  N: "assets/pieces/wn.svg",
  B: "assets/pieces/wb.svg",
  R: "assets/pieces/wr.svg",
  Q: "assets/pieces/wq.svg",
  K: "assets/pieces/wk.svg",
  p: "assets/pieces/bp.svg",
  n: "assets/pieces/bn.svg",
  b: "assets/pieces/bb.svg",
  r: "assets/pieces/br.svg",
  q: "assets/pieces/bq.svg",
  k: "assets/pieces/bk.svg"
};

function opposite(color) {
  return color === WHITE ? BLACK : WHITE;
}

function pieceColor(piece) {
  if (piece === EMPTY) return null;
  return piece === piece.toUpperCase() ? WHITE : BLACK;
}

function squareName(row, col) {
  return `${FILES[col]}${8 - row}`;
}

function parseSquare(square) {
  if (square.length !== 2 || !FILES.includes(square[0]) || !"12345678".includes(square[1])) {
    throw new Error(`Invalid square: ${square}`);
  }
  return [8 - Number(square[1]), FILES.indexOf(square[0])];
}

class Move {
  constructor(fromRow, fromCol, toRow, toCol, promotion = null, isEnPassant = false, isCastle = false) {
    this.fromRow = fromRow;
    this.fromCol = fromCol;
    this.toRow = toRow;
    this.toCol = toCol;
    this.promotion = promotion;
    this.isEnPassant = isEnPassant;
    this.isCastle = isCastle;
  }

  uci() {
    return `${this.fromSquare()}${this.toSquare()}${this.promotion || ""}`;
  }

  fromSquare() {
    return squareName(this.fromRow, this.fromCol);
  }

  toSquare() {
    return squareName(this.toRow, this.toCol);
  }
}

class Board {
  constructor(board, turn = WHITE, castlingRights = "KQkq", enPassant = null, halfmoveClock = 0, fullmoveNumber = 1) {
    this.board = board.map((row) => row.slice());
    this.turn = turn;
    this.castlingRights = castlingRights;
    this.enPassant = enPassant ? enPassant.slice() : null;
    this.halfmoveClock = halfmoveClock;
    this.fullmoveNumber = fullmoveNumber;
  }

  static startingPosition() {
    return new Board(STARTING_BOARD);
  }

  copy() {
    return new Board(this.board, this.turn, this.castlingRights, this.enPassant, this.halfmoveClock, this.fullmoveNumber);
  }

  fenKey() {
    const rows = this.board.map((row) => {
      let empty = 0;
      let out = "";
      for (const piece of row) {
        if (piece === EMPTY) {
          empty += 1;
        } else {
          if (empty) out += String(empty);
          empty = 0;
          out += piece;
        }
      }
      if (empty) out += String(empty);
      return out;
    });
    const ep = this.enPassant ? squareName(this.enPassant[0], this.enPassant[1]) : "-";
    const rights = this.castlingRights || "-";
    const active = this.turn === WHITE ? "w" : "b";
    return `${rows.join("/")} ${active} ${rights} ${ep}`;
  }

  pieceAt(row, col) {
    return this.board[row][col];
  }

  static inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  kingPosition(color) {
    const target = color === WHITE ? "K" : "k";
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (this.board[row][col] === target) return [row, col];
      }
    }
    throw new Error(`${color} king is missing`);
  }

  isSquareAttacked(row, col, byColor) {
    const pawnRow = byColor === WHITE ? row + 1 : row - 1;
    const pawn = byColor === WHITE ? "P" : "p";
    for (const dc of [-1, 1]) {
      const pc = col + dc;
      if (Board.inBounds(pawnRow, pc) && this.board[pawnRow][pc] === pawn) return true;
    }

    const knight = byColor === WHITE ? "N" : "n";
    for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
      const nr = row + dr;
      const nc = col + dc;
      if (Board.inBounds(nr, nc) && this.board[nr][nc] === knight) return true;
    }

    const bishop = byColor === WHITE ? "B" : "b";
    const rook = byColor === WHITE ? "R" : "r";
    const queen = byColor === WHITE ? "Q" : "q";

    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
      let nr = row + dr;
      let nc = col + dc;
      while (Board.inBounds(nr, nc)) {
        const piece = this.board[nr][nc];
        if (piece !== EMPTY) {
          if (piece === bishop || piece === queen) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      let nr = row + dr;
      let nc = col + dc;
      while (Board.inBounds(nr, nc)) {
        const piece = this.board[nr][nc];
        if (piece !== EMPTY) {
          if (piece === rook || piece === queen) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    const king = byColor === WHITE ? "K" : "k";
    for (const dr of [-1, 0, 1]) {
      for (const dc of [-1, 0, 1]) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (Board.inBounds(nr, nc) && this.board[nr][nc] === king) return true;
      }
    }
    return false;
  }

  isInCheck(color) {
    const [kr, kc] = this.kingPosition(color);
    return this.isSquareAttacked(kr, kc, opposite(color));
  }

  generatePseudoLegalMoves(color) {
    const moves = [];
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = this.board[row][col];
        if (piece === EMPTY || pieceColor(piece) !== color) continue;
        const kind = piece.toUpperCase();
        if (kind === "P") this.pawnMoves(row, col, color, moves);
        if (kind === "N") this.knightMoves(row, col, color, moves);
        if (kind === "B") this.sliderMoves(row, col, color, moves, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
        if (kind === "R") this.sliderMoves(row, col, color, moves, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
        if (kind === "Q") this.sliderMoves(row, col, color, moves, [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]);
        if (kind === "K") this.kingMoves(row, col, color, moves);
      }
    }
    return moves;
  }

  generateLegalMoves(color = null) {
    const side = color || this.turn;
    const legal = [];
    for (const move of this.generatePseudoLegalMoves(side)) {
      const next = this.makeMove(move);
      if (!next.isInCheck(side)) legal.push(move);
    }
    return legal;
  }

  san(move) {
    const piece = this.board[move.fromRow][move.fromCol];
    const kind = piece.toUpperCase();
    const capture = move.isEnPassant || this.board[move.toRow][move.toCol] !== EMPTY;
    let notation = "";

    if (move.isCastle) {
      notation = move.toCol === 6 ? "O-O" : "O-O-O";
    } else {
      if (kind === "P") {
        if (capture) notation += FILES[move.fromCol];
      } else {
        notation += kind;
        notation += this.disambiguation(move, piece);
      }

      if (capture) notation += "x";
      notation += move.toSquare();
      if (move.promotion) notation += `=${move.promotion.toUpperCase()}`;
    }

    const next = this.makeMove(move);
    const opponent = next.turn;
    if (next.isInCheck(opponent)) {
      notation += next.generateLegalMoves(opponent).length ? "+" : "#";
    }
    return notation;
  }

  disambiguation(move, piece) {
    const kind = piece.toUpperCase();
    const alternatives = this.generateLegalMoves(pieceColor(piece)).filter((candidate) => {
      if (candidate.fromRow === move.fromRow && candidate.fromCol === move.fromCol) return false;
      if (candidate.toRow !== move.toRow || candidate.toCol !== move.toCol) return false;
      return this.board[candidate.fromRow][candidate.fromCol].toUpperCase() === kind;
    });

    if (!alternatives.length) return "";
    const sameFile = alternatives.some((candidate) => candidate.fromCol === move.fromCol);
    const sameRank = alternatives.some((candidate) => candidate.fromRow === move.fromRow);
    if (!sameFile) return FILES[move.fromCol];
    if (!sameRank) return String(8 - move.fromRow);
    return `${FILES[move.fromCol]}${8 - move.fromRow}`;
  }

  addPromotionMoves(row, col, toRow, toCol, moves, isEnPassant = false) {
    for (const promotion of ["q", "r", "b", "n"]) {
      moves.push(new Move(row, col, toRow, toCol, promotion, isEnPassant));
    }
  }

  pawnMoves(row, col, color, moves) {
    const direction = color === WHITE ? -1 : 1;
    const startRow = color === WHITE ? 6 : 1;
    const promotionRow = color === WHITE ? 0 : 7;
    const enemy = opposite(color);
    let nr = row + direction;

    if (Board.inBounds(nr, col) && this.board[nr][col] === EMPTY) {
      if (nr === promotionRow) {
        this.addPromotionMoves(row, col, nr, col, moves);
      } else {
        moves.push(new Move(row, col, nr, col));
        const nr2 = row + 2 * direction;
        if (row === startRow && this.board[nr2][col] === EMPTY) moves.push(new Move(row, col, nr2, col));
      }
    }

    for (const dc of [-1, 1]) {
      const nc = col + dc;
      nr = row + direction;
      if (!Board.inBounds(nr, nc)) continue;
      const target = this.board[nr][nc];
      if (target !== EMPTY && pieceColor(target) === enemy) {
        if (nr === promotionRow) this.addPromotionMoves(row, col, nr, nc, moves);
        else moves.push(new Move(row, col, nr, nc));
      }
      if (this.enPassant && this.enPassant[0] === nr && this.enPassant[1] === nc) {
        const captured = this.board[row][nc];
        if (captured !== EMPTY && pieceColor(captured) === enemy && captured.toUpperCase() === "P") {
          moves.push(new Move(row, col, nr, nc, null, true));
        }
      }
    }
  }

  knightMoves(row, col, color, moves) {
    for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
      const nr = row + dr;
      const nc = col + dc;
      if (!Board.inBounds(nr, nc)) continue;
      const target = this.board[nr][nc];
      if (target === EMPTY || pieceColor(target) === opposite(color)) moves.push(new Move(row, col, nr, nc));
    }
  }

  sliderMoves(row, col, color, moves, directions) {
    for (const [dr, dc] of directions) {
      let nr = row + dr;
      let nc = col + dc;
      while (Board.inBounds(nr, nc)) {
        const target = this.board[nr][nc];
        if (target === EMPTY) {
          moves.push(new Move(row, col, nr, nc));
        } else {
          if (pieceColor(target) === opposite(color)) moves.push(new Move(row, col, nr, nc));
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  }

  kingMoves(row, col, color, moves) {
    for (const dr of [-1, 0, 1]) {
      for (const dc of [-1, 0, 1]) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (!Board.inBounds(nr, nc)) continue;
        const target = this.board[nr][nc];
        if (target === EMPTY || pieceColor(target) === opposite(color)) moves.push(new Move(row, col, nr, nc));
      }
    }

    if (color === WHITE && row === 7 && col === 4 && this.board[7][4] === "K") {
      if (this.castlingRights.includes("K") && this.board[7][5] === EMPTY && this.board[7][6] === EMPTY && this.board[7][7] === "R") {
        if (!this.isInCheck(WHITE) && !this.isSquareAttacked(7, 5, BLACK) && !this.isSquareAttacked(7, 6, BLACK)) moves.push(new Move(7, 4, 7, 6, null, false, true));
      }
      if (this.castlingRights.includes("Q") && this.board[7][3] === EMPTY && this.board[7][2] === EMPTY && this.board[7][1] === EMPTY && this.board[7][0] === "R") {
        if (!this.isInCheck(WHITE) && !this.isSquareAttacked(7, 3, BLACK) && !this.isSquareAttacked(7, 2, BLACK)) moves.push(new Move(7, 4, 7, 2, null, false, true));
      }
    }

    if (color === BLACK && row === 0 && col === 4 && this.board[0][4] === "k") {
      if (this.castlingRights.includes("k") && this.board[0][5] === EMPTY && this.board[0][6] === EMPTY && this.board[0][7] === "r") {
        if (!this.isInCheck(BLACK) && !this.isSquareAttacked(0, 5, WHITE) && !this.isSquareAttacked(0, 6, WHITE)) moves.push(new Move(0, 4, 0, 6, null, false, true));
      }
      if (this.castlingRights.includes("q") && this.board[0][3] === EMPTY && this.board[0][2] === EMPTY && this.board[0][1] === EMPTY && this.board[0][0] === "r") {
        if (!this.isInCheck(BLACK) && !this.isSquareAttacked(0, 3, WHITE) && !this.isSquareAttacked(0, 2, WHITE)) moves.push(new Move(0, 4, 0, 2, null, false, true));
      }
    }
  }

  removeCastlingRights(rights) {
    for (const right of rights) this.castlingRights = this.castlingRights.replace(right, "");
  }

  makeMove(move) {
    const nb = this.copy();
    const piece = nb.board[move.fromRow][move.fromCol];
    const captured = nb.board[move.toRow][move.toCol];
    const color = pieceColor(piece);
    if (!color) throw new Error("Cannot move an empty square");

    if (piece === "K") nb.removeCastlingRights("KQ");
    else if (piece === "k") nb.removeCastlingRights("kq");
    else if (piece === "R") {
      if (move.fromRow === 7 && move.fromCol === 0) nb.removeCastlingRights("Q");
      if (move.fromRow === 7 && move.fromCol === 7) nb.removeCastlingRights("K");
    } else if (piece === "r") {
      if (move.fromRow === 0 && move.fromCol === 0) nb.removeCastlingRights("q");
      if (move.fromRow === 0 && move.fromCol === 7) nb.removeCastlingRights("k");
    }

    if (captured === "R") {
      if (move.toRow === 7 && move.toCol === 0) nb.removeCastlingRights("Q");
      if (move.toRow === 7 && move.toCol === 7) nb.removeCastlingRights("K");
    } else if (captured === "r") {
      if (move.toRow === 0 && move.toCol === 0) nb.removeCastlingRights("q");
      if (move.toRow === 0 && move.toCol === 7) nb.removeCastlingRights("k");
    }

    nb.board[move.fromRow][move.fromCol] = EMPTY;
    if (move.isEnPassant) nb.board[move.fromRow][move.toCol] = EMPTY;

    if (move.isCastle) {
      const rookFromCol = move.toCol === 6 ? 7 : 0;
      const rookToCol = move.toCol === 6 ? 5 : 3;
      const rook = nb.board[move.fromRow][rookFromCol];
      nb.board[move.fromRow][rookFromCol] = EMPTY;
      nb.board[move.fromRow][rookToCol] = rook;
    }

    let placedPiece = piece;
    if (move.promotion) placedPiece = color === WHITE ? move.promotion.toUpperCase() : move.promotion.toLowerCase();
    nb.board[move.toRow][move.toCol] = placedPiece;

    nb.enPassant = null;
    if (piece.toUpperCase() === "P" && Math.abs(move.toRow - move.fromRow) === 2) {
      nb.enPassant = [(move.fromRow + move.toRow) / 2, move.fromCol];
    }

    if (piece.toUpperCase() === "P" || captured !== EMPTY || move.isEnPassant) nb.halfmoveClock = 0;
    else nb.halfmoveClock += 1;
    if (color === BLACK) nb.fullmoveNumber += 1;
    nb.turn = opposite(this.turn);
    return nb;
  }

  moveFromUci(uci) {
    if (![4, 5].includes(uci.length)) return null;
    let fromRow;
    let fromCol;
    let toRow;
    let toCol;
    try {
      [fromRow, fromCol] = parseSquare(uci.slice(0, 2));
      [toRow, toCol] = parseSquare(uci.slice(2, 4));
    } catch {
      return null;
    }
    let promotion = uci.length === 5 ? uci[4].toLowerCase() : null;
    for (const move of this.generateLegalMoves(this.turn)) {
      if (move.fromRow === fromRow && move.fromCol === fromCol && move.toRow === toRow && move.toCol === toCol) {
        if (move.promotion) {
          if (promotion === null) promotion = "q";
          if (move.promotion === promotion) return move;
        } else if (promotion === null) {
          return move;
        }
      }
    }
    return null;
  }

  gameStatus() {
    const legalMoves = this.generateLegalMoves(this.turn);
    const inCheck = this.isInCheck(this.turn);
    if (!legalMoves.length) {
      if (inCheck) {
        const winner = opposite(this.turn);
        return {
          game_over: true,
          winner,
          reason: "checkmate",
          message: `Checkmate! ${winner === WHITE ? "White" : "Black"} wins.`
        };
      }
      return {
        game_over: true,
        winner: null,
        reason: "stalemate",
        message: "Draw by stalemate."
      };
    }
    return {
      game_over: false,
      winner: null,
      reason: null,
      message: `${this.turn === WHITE ? "White" : "Black"} to move${inCheck ? " - check!" : ""}`
    };
  }

  toPayload(lastCpu = null, depth = 3) {
    const status = this.gameStatus();
    return {
      board: this.board,
      turn: this.turn,
      castling_rights: this.castlingRights,
      en_passant: this.enPassant ? squareName(this.enPassant[0], this.enPassant[1]) : null,
      in_check: status.game_over ? false : this.isInCheck(this.turn),
      status,
      fen_key: this.fenKey(),
      last_cpu: lastCpu,
      depth,
      move_history: []
    };
  }
}

class SearchTimeout extends Error {}

class ChessEngine {
  constructor() {
    this.tt = new Map();
    this.deadline = 0;
    this.nodes = 0;
  }

  chooseMove(board, depth = 3) {
    const cleanDepth = Math.max(1, Math.min(10, Number.parseInt(depth, 10) || 3));
    const legalMoves = board.generateLegalMoves(BLACK);
    if (!legalMoves.length) {
      return { move: null, score: this.evaluate(board), completedDepth: 0, nodes: 0, elapsed: 0, stoppedEarly: false };
    }

    const timeLimit = Math.min(12000, Math.max(1000, cleanDepth * 1200));
    const start = performance.now();
    this.deadline = start + timeLimit;
    this.nodes = 0;
    let bestMove = this.orderMoves(board, legalMoves)[0];
    let bestScore = -INF;
    let completedDepth = 0;
    let stoppedEarly = false;

    try {
      for (let currentDepth = 1; currentDepth <= cleanDepth; currentDepth += 1) {
        let alpha = -INF;
        const beta = INF;
        let currentBestMove = bestMove;
        let currentBestScore = -INF;
        const ordered = this.orderMoves(board, legalMoves, bestMove ? bestMove.uci() : null);
        for (const move of ordered) {
          this.checkTime();
          const child = board.makeMove(move);
          const score = this.search(child, currentDepth - 1, alpha, beta, false, 1);
          if (score > currentBestScore) {
            currentBestScore = score;
            currentBestMove = move;
          }
          alpha = Math.max(alpha, currentBestScore);
        }
        bestMove = currentBestMove;
        bestScore = currentBestScore;
        completedDepth = currentDepth;
      }
    } catch (err) {
      if (!(err instanceof SearchTimeout)) throw err;
      stoppedEarly = true;
    }

    return {
      move: bestMove,
      score: bestScore,
      completedDepth,
      nodes: this.nodes,
      elapsed: (performance.now() - start) / 1000,
      stoppedEarly
    };
  }

  checkTime() {
    if (performance.now() >= this.deadline) throw new SearchTimeout();
  }

  search(board, depth, alpha, beta, maximizing, ply) {
    this.checkTime();
    this.nodes += 1;

    const status = board.gameStatus();
    if (status.game_over) {
      if (status.reason === "checkmate") return status.winner === BLACK ? MATE_SCORE - ply : -MATE_SCORE + ply;
      return 0;
    }
    if (depth <= 0) return this.quiescence(board, alpha, beta, ply, 4);

    const ttKey = `${board.fenKey()}|${depth}`;
    const cached = this.tt.get(ttKey);
    if (cached) {
      if (cached.flag === "exact") return cached.score;
      if (cached.flag === "lower") alpha = Math.max(alpha, cached.score);
      if (cached.flag === "upper") beta = Math.min(beta, cached.score);
      if (alpha >= beta) return cached.score;
    }

    const originalAlpha = alpha;
    const originalBeta = beta;
    const ordered = this.orderMoves(board, board.generateLegalMoves(board.turn), cached ? cached.move : null);
    let bestMoveUci = null;
    let value;

    if (maximizing) {
      value = -INF;
      for (const move of ordered) {
        const score = this.search(board.makeMove(move), depth - 1, alpha, beta, false, ply + 1);
        if (score > value) {
          value = score;
          bestMoveUci = move.uci();
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
    } else {
      value = INF;
      for (const move of ordered) {
        const score = this.search(board.makeMove(move), depth - 1, alpha, beta, true, ply + 1);
        if (score < value) {
          value = score;
          bestMoveUci = move.uci();
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
    }

    let flag = "exact";
    if (value <= originalAlpha) flag = "upper";
    else if (value >= originalBeta) flag = "lower";
    this.tt.set(ttKey, { score: value, flag, move: bestMoveUci });
    return value;
  }

  quiescence(board, alpha, beta, ply, maxQDepth) {
    this.checkTime();
    const standPat = this.evaluate(board);

    if (board.turn === BLACK) {
      if (standPat >= beta) return beta;
      alpha = Math.max(alpha, standPat);
    } else {
      if (standPat <= alpha) return alpha;
      beta = Math.min(beta, standPat);
    }

    if (maxQDepth <= 0) return standPat;

    const noisyMoves = this.orderMoves(
      board,
      board.generateLegalMoves(board.turn).filter((move) => this.isNoisy(board, move))
    );

    let value = standPat;
    if (board.turn === BLACK) {
      for (const move of noisyMoves) {
        value = Math.max(value, this.quiescence(board.makeMove(move), alpha, beta, ply + 1, maxQDepth - 1));
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
    } else {
      for (const move of noisyMoves) {
        value = Math.min(value, this.quiescence(board.makeMove(move), alpha, beta, ply + 1, maxQDepth - 1));
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
    }
    return value;
  }

  isNoisy(board, move) {
    return board.pieceAt(move.toRow, move.toCol) !== EMPTY || move.isEnPassant || move.promotion !== null;
  }

  orderMoves(board, moves, preferred = null) {
    return moves.slice().sort((a, b) => this.moveScore(board, b, preferred) - this.moveScore(board, a, preferred));
  }

  moveScore(board, move, preferred) {
    let score = 0;
    if (preferred && move.uci() === preferred) score += 1000000;
    const movingPiece = board.pieceAt(move.fromRow, move.fromCol);
    let capturedPiece = board.pieceAt(move.toRow, move.toCol);
    if (move.isEnPassant) capturedPiece = movingPiece === movingPiece.toLowerCase() ? "P" : "p";
    if (capturedPiece !== EMPTY) score += 10000 + PIECE_VALUES[capturedPiece.toUpperCase()] * 10 - PIECE_VALUES[movingPiece.toUpperCase()];
    if (move.promotion) score += 8000 + PIECE_VALUES[move.promotion.toUpperCase()];
    if (move.isCastle) score += 300;
    try {
      const child = board.makeMove(move);
      if (child.isInCheck(child.turn)) score += 500;
    } catch {}
    if ((move.toRow === 3 || move.toRow === 4) && (move.toCol === 3 || move.toCol === 4)) score += 60;
    return score;
  }

  evaluate(board) {
    const status = board.gameStatus();
    if (status.game_over) {
      if (status.reason === "checkmate") return status.winner === BLACK ? MATE_SCORE : -MATE_SCORE;
      return 0;
    }

    let score = 0;
    let whiteBishops = 0;
    let blackBishops = 0;
    const whitePawnsByFile = Array(8).fill(0);
    const blackPawnsByFile = Array(8).fill(0);

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = board.board[row][col];
        if (piece === EMPTY) continue;
        const kind = piece.toUpperCase();
        const value = PIECE_VALUES[kind];
        if (piece === piece.toUpperCase()) {
          score -= value + PST[kind][row][col];
          if (kind === "B") whiteBishops += 1;
          if (kind === "P") whitePawnsByFile[col] += 1;
        } else {
          score += value + PST[kind][7 - row][col];
          if (kind === "B") blackBishops += 1;
          if (kind === "P") blackPawnsByFile[col] += 1;
        }
      }
    }

    if (blackBishops >= 2) score += 35;
    if (whiteBishops >= 2) score -= 35;
    score += this.pawnStructureScore(blackPawnsByFile);
    score -= this.pawnStructureScore(whitePawnsByFile);

    const blackMobility = board.generatePseudoLegalMoves(BLACK).length;
    const whiteMobility = board.generatePseudoLegalMoves(WHITE).length;
    score += 3 * (blackMobility - whiteMobility);

    for (const [row, col] of [[3, 3], [3, 4], [4, 3], [4, 4]]) {
      if (board.isSquareAttacked(row, col, BLACK)) score += 18;
      if (board.isSquareAttacked(row, col, WHITE)) score -= 18;
    }

    score += this.kingSafety(board, BLACK);
    score -= this.kingSafety(board, WHITE);
    if (board.isInCheck(WHITE)) score += 45;
    if (board.isInCheck(BLACK)) score -= 45;
    return Math.trunc(score);
  }

  pawnStructureScore(pawnsByFile) {
    let score = 0;
    for (let fileIdx = 0; fileIdx < 8; fileIdx += 1) {
      const count = pawnsByFile[fileIdx];
      if (count > 1) score -= 15 * (count - 1);
      if (count > 0) {
        const left = fileIdx > 0 ? pawnsByFile[fileIdx - 1] : 0;
        const right = fileIdx < 7 ? pawnsByFile[fileIdx + 1] : 0;
        if (left === 0 && right === 0) score -= 10;
      }
    }
    return score;
  }

  kingSafety(board, color) {
    let kr;
    let kc;
    try {
      [kr, kc] = board.kingPosition(color);
    } catch {
      return -500;
    }
    const enemy = opposite(color);
    let safety = 0;
    for (const dr of [-1, 0, 1]) {
      for (const dc of [-1, 0, 1]) {
        const nr = kr + dr;
        const nc = kc + dc;
        if (Board.inBounds(nr, nc) && board.isSquareAttacked(nr, nc, enemy)) safety -= 8;
      }
    }
    return safety;
  }
}

class Game {
  constructor() {
    this.board = Board.startingPosition();
    this.engine = new ChessEngine();
    this.depth = 3;
    this.lastCpu = null;
    this.moveHistory = [];
  }

  reset(depth = 3) {
    this.board = Board.startingPosition();
    this.engine = new ChessEngine();
    this.depth = this.cleanDepth(depth);
    this.lastCpu = null;
    this.moveHistory = [];
    return this.state();
  }

  cleanDepth(depth) {
    return Math.max(1, Math.min(10, Number.parseInt(depth, 10) || 3));
  }

  state() {
    const payload = this.board.toPayload(this.lastCpu, this.depth);
    payload.move_history = this.moveHistory.map((move) => ({ ...move }));
    return payload;
  }

  legalMovesFrom(square) {
    const status = this.board.gameStatus();
    if (status.game_over || this.board.turn !== WHITE) return { moves: [] };
    let row;
    let col;
    try {
      [row, col] = parseSquare(square);
    } catch {
      return { moves: [] };
    }
    const piece = this.board.pieceAt(row, col);
    if (piece === EMPTY || pieceColor(piece) !== WHITE) return { moves: [] };
    return {
      moves: this.board.generateLegalMoves(WHITE)
        .filter((move) => move.fromRow === row && move.fromCol === col)
        .map((move) => ({
          uci: move.uci(),
          from: move.fromSquare(),
          to: move.toSquare(),
          promotion: move.promotion,
          is_en_passant: move.isEnPassant,
          is_castle: move.isCastle
        }))
    };
  }

  makeHumanMove(from, to, promotion = "q", depth = null) {
    if (depth !== null) this.depth = this.cleanDepth(depth);
    const status = this.board.gameStatus();
    if (status.game_over) return { ok: false, error: "The game is already over.", state: this.state() };
    if (this.board.turn !== WHITE) return { ok: false, error: "It is not White's turn.", state: this.state() };

    let move = this.board.moveFromUci(`${from}${to}${promotion || ""}`);
    if (!move && promotion) move = this.board.moveFromUci(`${from}${to}`);
    if (!move) return { ok: false, error: "Illegal move.", state: this.state() };

    const san = this.board.san(move);
    const moveNumber = this.board.fullmoveNumber;
    this.board = this.board.makeMove(move);
    this.moveHistory.push({ move_number: moveNumber, color: WHITE, san, uci: move.uci() });
    const afterHuman = this.board.gameStatus();
    return {
      ok: true,
      human_move: move.uci(),
      human_san: san,
      awaiting_cpu: !afterHuman.game_over && this.board.turn === BLACK,
      state: this.state()
    };
  }

  makeCpuMove(depth = null) {
    if (depth !== null) this.depth = this.cleanDepth(depth);
    const status = this.board.gameStatus();
    if (status.game_over) return { ok: true, cpu_move: null, cpu_info: null, state: this.state() };
    if (this.board.turn !== BLACK) return { ok: false, error: "It is not Black's turn.", state: this.state() };

    const result = this.engine.chooseMove(this.board, this.depth);
    this.lastCpu = {
      move: result.move ? result.move.uci() : null,
      score: result.score,
      completed_depth: result.completedDepth,
      nodes: result.nodes,
      elapsed: Number(result.elapsed.toFixed(3)),
      stopped_early: result.stoppedEarly
    };
    let cpuMove = null;
    let cpuSan = null;
    if (result.move) {
      cpuSan = this.board.san(result.move);
      const moveNumber = this.board.fullmoveNumber;
      this.board = this.board.makeMove(result.move);
      cpuMove = result.move.uci();
      this.moveHistory.push({ move_number: moveNumber, color: BLACK, san: cpuSan, uci: cpuMove });
    }
    return { ok: true, cpu_move: cpuMove, cpu_san: cpuSan, cpu_info: this.lastCpu, state: this.state() };
  }
}

function pieceImage(piece) {
  if (piece === EMPTY) return "";

  const isWhite = piece === piece.toUpperCase();
  return `<img class="piece ${isWhite ? "white-piece" : "black-piece"}" src="${pieceImages[piece]}" alt="${pieceNames[piece]}" draggable="false">`;
}

function runBrowserGame() {
  const boardEl = document.getElementById("board");
  const statusBox = document.getElementById("statusBox");
  const thinkingBox = document.getElementById("thinkingBox");
  const evaluationBox = document.getElementById("evaluationBox");
  const evaluationToggle = document.getElementById("evaluationToggle");
  const lastMoveBox = document.getElementById("lastMoveBox");
  const moveHistoryBox = document.getElementById("moveHistoryBox");
  const copyMovesBtn = document.getElementById("copyMovesBtn");
  const backMoveBtn = document.getElementById("backMoveBtn");
  const forwardMoveBtn = document.getElementById("forwardMoveBtn");
  const replayStatus = document.getElementById("replayStatus");
  const newGameBtn = document.getElementById("newGameBtn");
  const depthSelect = document.getElementById("depthSelect");
  const game = new Game();

  let state = game.state();
  let visualHistory = [{ state: cloneState(state), lastMoveSquares: [] }];
  let historyCursor = 0;
  let selectedSquare = "";
  let legalMoves = [];
  let lastMoveSquares = [];
  let busy = false;

  function cloneState(source) {
    return {
      ...source,
      board: source.board.map((row) => row.slice()),
      move_history: source.move_history.map((move) => ({ ...move })),
      status: { ...source.status },
      last_cpu: source.last_cpu ? { ...source.last_cpu } : null
    };
  }

  function addVisualSnapshot(nextState, moveUci) {
    visualHistory.push({
      state: cloneState(nextState),
      lastMoveSquares: moveUci ? [moveUci.slice(0, 2), moveUci.slice(2, 4)] : []
    });
    historyCursor = visualHistory.length - 1;
  }

  function currentSnapshot() {
    return visualHistory[historyCursor] || visualHistory[visualHistory.length - 1];
  }

  function isViewingLivePosition() {
    return historyCursor === visualHistory.length - 1;
  }

  function fillDepthSelect() {
    for (let depth = 1; depth <= 10; depth += 1) {
      const option = document.createElement("option");
      option.value = String(depth);
      option.textContent = String(depth);
      if (depth === 3) option.selected = true;
      depthSelect.appendChild(option);
    }
  }

  function isWhitePiece(piece) {
    return piece !== EMPTY && piece === piece.toUpperCase();
  }

  function setBusy(value) {
    busy = value;
    thinkingBox.hidden = !value;
    newGameBtn.disabled = value;
    depthSelect.disabled = value;
    evaluationToggle.disabled = value;
    copyMovesBtn.disabled = value;
  }

  function animateMove(uci) {
    if (!uci) return Promise.resolve();
    const fromSquare = uci.slice(0, 2);
    const toSquare = uci.slice(2, 4);
    const fromEl = boardEl.querySelector(`[data-square="${fromSquare}"]`);
    const toPiece = boardEl.querySelector(`[data-square="${toSquare}"] .piece`);
    if (!fromEl || !toPiece || !toPiece.animate) return Promise.resolve();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toPiece.getBoundingClientRect();
    return toPiece.animate(
      [
        { transform: `translate(${fromRect.left - toRect.left}px, ${fromRect.top - toRect.top}px) scale(0.98)`, filter: "drop-shadow(0 14px 10px rgba(0,0,0,0.25))" },
        { transform: "translate(0, 0) scale(1)", filter: "drop-shadow(0 5px 4px rgba(0,0,0,0.28))" }
      ],
      { duration: 280, easing: "cubic-bezier(.2,.8,.2,1)" }
    ).finished.catch(() => {});
  }

  function handleSquareClick(row, col) {
    if (!state || busy || !isViewingLivePosition() || state.turn !== WHITE || state.status.game_over) return;

    const square = squareName(row, col);
    const piece = state.board[row][col];
    const move = legalMoves.find((legalMove) => legalMove.to === square);

    if (selectedSquare && move) {
      makeHumanMove(selectedSquare, square, move.promotion || "q");
      return;
    }

    if (isWhitePiece(piece)) {
      selectedSquare = square;
      legalMoves = game.legalMovesFrom(square).moves;
      render();
      return;
    }

    selectedSquare = "";
    legalMoves = [];
    render();
  }

  async function makeHumanMove(from, to, promotion = "q") {
    setBusy(true);
    const data = game.makeHumanMove(from, to, promotion, Number(depthSelect.value));

    if (!data.ok) {
      statusBox.textContent = data.error || "Illegal move.";
      state = data.state;
      setBusy(false);
      render();
      return;
    }

    state = data.state;
    selectedSquare = "";
    legalMoves = [];
    lastMoveSquares = [data.human_move.slice(0, 2), data.human_move.slice(2, 4)];
    addVisualSnapshot(state, data.human_move);
    render();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await animateMove(data.human_move);

    if (!data.awaiting_cpu) {
      setBusy(false);
      render();
      return;
    }

    window.setTimeout(async () => {
      const cpuData = game.makeCpuMove(Number(depthSelect.value));
      if (!cpuData.ok) {
        statusBox.textContent = cpuData.error || "CPU move failed.";
        state = cpuData.state;
      } else {
        state = cpuData.state;
        if (cpuData.cpu_move) {
          lastMoveSquares = [cpuData.cpu_move.slice(0, 2), cpuData.cpu_move.slice(2, 4)];
          addVisualSnapshot(state, cpuData.cpu_move);
        }
      }
      setBusy(false);
      render();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await animateMove(cpuData.cpu_move);
    }, 40);
  }

  function formatEvaluation() {
    const whiteScore = -game.engine.evaluate(game.board);
    if (Math.abs(whiteScore) >= MATE_SCORE / 2) {
      return whiteScore > 0 ? "+M" : "-M";
    }
    const pawns = whiteScore / 100;
    return `${pawns >= 0 ? "+" : ""}${pawns.toFixed(2)}`;
  }

  function formatMoveHistory(moves) {
    const lines = [];
    for (const move of moves) {
      if (move.color === WHITE) {
        lines.push(`${move.move_number}. ${move.san}`);
      } else if (lines.length) {
        lines[lines.length - 1] += ` ${move.san}`;
      } else {
        lines.push(`${move.move_number}... ${move.san}`);
      }
    }
    return lines.join("\n");
  }

  function setHistoryCursor(nextCursor) {
    historyCursor = Math.max(0, Math.min(visualHistory.length - 1, nextCursor));
    selectedSquare = "";
    legalMoves = [];
    render();
  }

  function render() {
    const snapshot = currentSnapshot();
    const displayState = snapshot.state;
    const displayLastMoveSquares = snapshot.lastMoveSquares;
    const legalTargets = new Set(legalMoves.map((move) => move.to));
    boardEl.innerHTML = "";

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const square = squareName(row, col);
        const piece = displayState.board[row][col];
        const button = document.createElement("button");

        button.type = "button";
        button.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
        button.innerHTML = pieceImage(piece);
        button.title = piece === EMPTY ? square : `${square}: ${pieceNames[piece]}`;
        button.setAttribute("aria-label", button.title);
        button.dataset.square = square;

        if (square === selectedSquare) button.classList.add("selected");
        if (isViewingLivePosition() && legalTargets.has(square)) button.classList.add("legal");
        if (displayLastMoveSquares.includes(square)) button.classList.add("last-move");

        button.addEventListener("click", () => handleSquareClick(row, col));
        boardEl.appendChild(button);
      }
    }

    statusBox.textContent = isViewingLivePosition()
      ? state.status.message
      : `Viewing move ${historyCursor} of ${visualHistory.length - 1}`;
    statusBox.classList.toggle("game-over", isViewingLivePosition() && state.status.game_over);
    evaluationBox.hidden = !evaluationToggle.checked;
    if (evaluationToggle.checked) {
      evaluationBox.textContent = `Evaluation: ${formatEvaluation()} (positive is White)`;
    }

    const moveText = formatMoveHistory(state.move_history);
    moveHistoryBox.value = moveText;
    copyMovesBtn.textContent = "Copy";
    backMoveBtn.disabled = busy || historyCursor === 0;
    forwardMoveBtn.disabled = busy || isViewingLivePosition();
    replayStatus.textContent = isViewingLivePosition()
      ? "Live position"
      : `${historyCursor}/${visualHistory.length - 1}`;

    if (state.last_cpu) {
      const early = state.last_cpu.stopped_early ? "; time cutoff" : "";
      const lastBlackMove = state.move_history.filter((move) => move.color === BLACK).at(-1);
      const label = lastBlackMove ? `${lastBlackMove.san} (${state.last_cpu.move})` : state.last_cpu.move || "none";
      lastMoveBox.textContent = `Last CPU move: ${label}; depth: ${state.last_cpu.completed_depth}; nodes: ${state.last_cpu.nodes}${early}`;
    } else {
      lastMoveBox.textContent = "Last CPU move: none";
    }
  }

  evaluationToggle.addEventListener("change", render);

  copyMovesBtn.addEventListener("click", async () => {
    moveHistoryBox.select();
    try {
      await navigator.clipboard.writeText(moveHistoryBox.value);
      copyMovesBtn.textContent = "Copied";
    } catch {
      document.execCommand("copy");
      copyMovesBtn.textContent = "Copied";
    }
  });

  backMoveBtn.addEventListener("click", () => setHistoryCursor(historyCursor - 1));
  forwardMoveBtn.addEventListener("click", () => setHistoryCursor(historyCursor + 1));

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    if (isTyping || busy) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setHistoryCursor(historyCursor - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setHistoryCursor(historyCursor + 1);
    }
  });

  newGameBtn.addEventListener("click", () => {
    setBusy(true);
    selectedSquare = "";
    legalMoves = [];
    lastMoveSquares = [];
    state = game.reset(Number(depthSelect.value));
    visualHistory = [{ state: cloneState(state), lastMoveSquares: [] }];
    historyCursor = 0;
    setBusy(false);
    render();
  });

  fillDepthSelect();
  render();
}

if (typeof document !== "undefined") {
  runBrowserGame();
}

if (typeof module !== "undefined") {
  module.exports = { Board, ChessEngine, Game, Move, WHITE, BLACK, parseSquare, squareName };
}
