import {selectCellToPlay} from "./computer-player.js";

const CIRCLE_VALUE = "O";
const CROSS_VALUE = "X";
const PLAYERS = [CIRCLE_VALUE, CROSS_VALUE];
export const GAMEMODES = {
  multiPlayer: "multiPlayer",
  singlePlayer: "singlePlayer"
}
export const GAME_RESULTS = {
  win: "WIN",
  lose: "LOSE",
  draw: "DRAW"
}

export default class Game {

  #boardState;
  #cells;
  #turn;
  #gamemode;
  #onGameEnd;

  constructor(cells, onGameEnd) {
    this.#cells = cells;
    this.#cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        this.#playTurn(
          this.getCurrentPlayer(),
          cell.getAttribute("data-row"),
          cell.getAttribute("data-col")
        );
      }, false);
    });
    this.#onGameEnd = onGameEnd;
  };

  startGame(gamemode) {
    this.#gamemode = gamemode;
    this.#resetBoard();
    this.#turn = CROSS_VALUE;
  }

  #playTurn(player, row, col) {
    if (this.#turn == player && this.#cellAvailable(row, col)) {
      this.#markCell(player, row, col);
      if (this.#checkWin(player)) {
        this.#onGameEnd(GAME_RESULTS["win"]);
        return;
      }
      if (this.#checkDraw()) {
        this.#onGameEnd(GAME_RESULTS["draw"]);
        return;
      }
      this.#turn = PLAYERS.filter((nextplayer) => nextplayer != player) [0];
      if (this.#gamemode == GAMEMODES["singlePlayer"]) {
        // Make the computer play.
        const computerPlay = selectCellToPlay(this.#boardState, this.#turn, player);
        if (this.#cellAvailable(computerPlay[0], computerPlay[1])) {
          this.#markCell(this.#turn, computerPlay[0], computerPlay[1]);
          if (this.#checkWin(this.#turn)) {
            this.#onGameEnd(GAME_RESULTS["lose"]);
            return;
          }
          if (this.#checkDraw()) {
            this.#onGameEnd(GAME_RESULTS["draw"]);
            return;
          }
        }
        this.#turn = PLAYERS.filter((nextplayer) => nextplayer != this.#turn) [0];
      }
    };
  };

  getCurrentPlayer() {
    return this.#turn;
  }

  #resetBoard() {
    const playerMarks = Array.from(document.getElementsByClassName("playermark"));
    playerMarks.forEach((playerMark) => {
      playerMark.remove();
    })
    this.#boardState = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }


  #markCell(player, row, col) {
    const markedCell = this.#getCellHtml(row, col);
    if (markedCell) {
      const playerMark = this.#generatePlayerMarkHtml(player);
      this.#boardState[row][col] = player;
      markedCell.appendChild(playerMark);
    } else {
      throw "What is this cell!";
    }
    if (this.#cellAvailable(row, col)) {
    }
  }

  #checkWin(playerValue) {
    // Comprobamos las filas.
    for (let i = 0; i < 3; i++) {
      if (this.#boardState[i][0] == playerValue &&  this.#boardState[i][0] == this.#boardState[i][1] && this.#boardState[i][0] == this.#boardState[i][2]) {
        return true;
      }
    }
    // Comprobamos las columnas.
    for (let i = 0; i < 3; i++) {
      if (this.#boardState[0][i] == playerValue &&  this.#boardState[0][i] == this.#boardState[1][i] && this.#boardState[0][i] == this.#boardState[2][i]) {
        return true;
      }
    }
    // Comprobamos ambas diagonales.
    // Diagonal principal:
    if (this.#boardState[0][0] == playerValue &&  this.#boardState[0][0] == this.#boardState[1][1] && this.#boardState[0][0] == this.#boardState[2][2]) {
      return true;
    }
    // Diagonal invertida:
    if (this.#boardState[0][2] == playerValue && this.#boardState[0][2] == this.#boardState[1][1] && this.#boardState[0][2] == this.#boardState[2][0]) {
      return true;
    }
    return false;
  }

  #checkDraw() {
    return !this.#boardState.some((row) => row.includes(0));
  }

  #cellAvailable(row, col) {
    return this.#boardState[row][col] == 0;
  };

  #getCellHtml(row, col) {
    return this.#cells.find((cell) => (row == cell.getAttribute("data-row") && col == cell.getAttribute("data-col")));
  };

  #generatePlayerMarkHtml(player){
    switch(player) {
      case CROSS_VALUE:
        return this.#generateCrossHtml();
      case CIRCLE_VALUE:
        return this.#generateCircleHtml();
      default:
        throw("This player is fake.")
    }

  };

  #generateCircleHtml() {
    const fragment = document.createDocumentFragment();
    const svg = fragment.appendChild(document.createElement("img"));
    svg.setAttribute("src", "./circle.svg");
    svg.setAttribute("class", "playermark");
    return svg;
  };

  #generateCrossHtml() {
    const fragment = document.createDocumentFragment();
    const svg = fragment.appendChild(document.createElement("img"));
    svg.setAttribute("src", "./cross.svg");
    svg.setAttribute("class", "playermark");
    return svg;
  };

}