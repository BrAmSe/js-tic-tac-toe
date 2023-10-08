import './style.css'

const cells = document.getElementsByClassName("cell");
const CIRCLE_VALUE = "O";
const CROSS_VALUE = "X";
let BOARD_STATE = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
]

const NUMBER_OF_PLAYS = [
  [3, 2, 3],
  [2, 4, 2],
  [3, 2, 3]
]

function renderCross(event) {
  const col = this.getAttribute("data-col");
  const row = this.getAttribute("data-row");
  if (!BOARD_STATE[row][col]) {
    const cross = generateCrossHtml();
    event.target.appendChild(cross);
    BOARD_STATE[row][col] = CROSS_VALUE;
  }
}

function renderCircle(event) {
  const col = this.getAttribute("data-col");
  const row = this.getAttribute("data-row");
  if (!BOARD_STATE[row][col]) {
    const circle = generateCircleHtml();
    event.target.appendChild(circle);
    BOARD_STATE[row][col] = CIRCLE_VALUE;
  }
  if (checkGameEnd(BOARD_STATE, CIRCLE_VALUE)) {
    // Reset Board.
    setTimeout(() => resetBoard(), 1000);
  }
  // Acaba el turno de jugador. Juega la maquina.
  let bestMachinePlay = selectCell(CROSS_VALUE, CIRCLE_VALUE);
  console.log("bestMachinePlay: ", bestMachinePlay);
  if (!BOARD_STATE[bestMachinePlay[0]][bestMachinePlay[1]]) {
    const cross = generateCrossHtml();
    document.getElementById(`cell-${bestMachinePlay[0]}-${bestMachinePlay[1]}`).appendChild(cross);
    BOARD_STATE[bestMachinePlay[0]][bestMachinePlay[1]] = CROSS_VALUE;
  } else {
    throw "I'm an asshole";
  }
  if (checkGameEnd(BOARD_STATE, CIRCLE_VALUE)) {
    // Reset Board.
    setTimeout(() => resetBoard(), 1000);
  }
}

function resetBoard() {
  const plays = document.getElementsByClassName("playermark");
  while(plays.length > 0) {
    plays[0].remove();
  }
  BOARD_STATE = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  
}

for (let cell of cells) {
  console.log("cell: ", cell);
  cell.addEventListener('click', renderCircle, false);
}

function generateCircleHtml() {
  const fragment = document.createDocumentFragment();
  const svg = fragment.appendChild(document.createElement("img"));
  svg.setAttribute("src", "./circle.svg");
  svg.setAttribute("class", "playermark");
  return svg;
}

function generateCrossHtml() {
  const fragment = document.createDocumentFragment();
  const svg = fragment.appendChild(document.createElement("img"));
  svg.setAttribute("src", "./cross.svg");
  svg.setAttribute("class", "playermark");
  return svg;
}

function checkGameEnd(boardGame, playerValue) {
  // Comprobamos las filas.
  for (let i = 0; i < 3; i++) {
    if (boardGame[i][0] != 0 &&  boardGame[i][0] == boardGame[i][1] && boardGame[i][0] == boardGame[i][2]) {
      return assignWinner(boardGame[i][0], playerValue);
    } 
  }
  // Comprobamos las columnas.
  for (let i = 0; i < 3; i++) {
    if (boardGame[0][i] != 0 &&  boardGame[0][i] == boardGame[1][i] && boardGame[0][i] == boardGame[2][i]) {
      return assignWinner(boardGame[0][i], playerValue);
    }
  }
  // Comprobamos ambas diagonales.
  // Diagonal principal:
  if (boardGame[0][0] != 0 &&  boardGame[0][0] == boardGame[1][1] && boardGame[0][0] == boardGame[2][2]) {
    return assignWinner(boardGame[0][0], playerValue);
  }
  // Diagonal invertida: 
  if (boardGame[0][2] != 0 && boardGame[0][2] == boardGame[1][1] && boardGame[0][2] == boardGame[2][0]) {
    return assignWinner(boardGame[0][2], playerValue);
  }
  // Comprobamos si no quedan huecos.
  if (!boardGame.some((row) => row.includes(0))) {
    // Empate
    alert("Its a draw!");
    return true;
  }
  return false;
}

function assignWinner(rowElement, playerValue) {
  console.log("rowElement: ", rowElement, "playerValue: ", playerValue);
  if (rowElement == playerValue) {
    alert("You are the winner");
  } else {
    alert("You loose!");
  }
  return true;
}

function selectCell(selfValue, othersValue) {
  let hBoard = heuristicBoard(BOARD_STATE, selfValue, othersValue);
  let bestCell = 0;
  let bestCellRow = 0;
  let bestCellCol = 0;
  console.log("hBoard: ", hBoard);
  hBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell > bestCell) {
        bestCell = cell;
        bestCellRow = rowIndex;
        bestCellCol = colIndex;
      }
    })
  });
  return ([bestCellRow, bestCellCol]);
}

// Posibles jugadas:
// (1,1) [(1,2) (1,3)] [(2,1) (3,1)] 
// (1,2) [(2,2) (2,3)] [(1,1) (1,3)]
// (1,3) [(1,1) (1,2)] [(2,3) (3,3)] [(1,3),(2,2) (3,1)]


function heuristicBoard(boardGame, selfValue, othersValue) {
  return boardGame.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      if (cell) {
        // La celda no está vacía, no se puede seleccionar. Devolvemos 0;
        return 0;
      } else {
        let value = NUMBER_OF_PLAYS[rowIndex][colIndex];
        // Comprobamos la líneas.
        let rowValue = ponderLine(row, selfValue, othersValue);
        // Comprobamos las columnas.
        let col = [boardGame[0][colIndex], boardGame[1][colIndex], boardGame[2][colIndex]];
        let colValue = ponderLine(col, selfValue, othersValue);
        let diagonalValue = 0;
        let invertedDiagValue = 0;
        // Comprobamos las diagonales
        if (rowIndex == colIndex || Math.abs(rowIndex - colIndex) == 2) {
          const DIAG = [[0, 0], [1, 1], [2, 2]];
          const INVERTED_DIAG = [[0, 2], [1, 1], [2, 0]];
          if (DIAG.some((element) => element[0] == rowIndex && element[1] == colIndex)) {
            console.log("PONDER DIAG: ")
            diagonalValue = ponderLine(DIAG.map((position) => boardGame[position[0]][position[1]]), selfValue, othersValue);
          }
          if (INVERTED_DIAG.some((element) => element[0] == rowIndex && element[1] == colIndex)) {
            console.log("PONDER INVERSE: ")
            invertedDiagValue = ponderLine(INVERTED_DIAG.map((position) => boardGame[position[0]][position[1]]), selfValue, othersValue);
          }
        }
        return value + rowValue + colValue + diagonalValue + invertedDiagValue;
      }
    })
  })
}

function ponderLine(line, selfValue, othersValue) {
  const ocurrencesCount = {};
  line.forEach((checkedCell) => {
    ocurrencesCount[checkedCell] = (ocurrencesCount[checkedCell] || 0) + 1;
  });
  if (ocurrencesCount[selfValue] == 2) {
    return 100;
  } else if (ocurrencesCount[othersValue] == 2) {
    return 50;
  } else if (ocurrencesCount[selfValue] != ocurrencesCount[othersValue]) {
    return 1;
  } else {
    return 0;
  }
}