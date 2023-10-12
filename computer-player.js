// Starting heuristic value for every piece of the board.
const NUMBER_OF_PLAYS = [
  [3, 2, 3],
  [2, 4, 2],
  [3, 2, 3]
];

// Select the best Cell to play based on the state of the board.
export function selectCellToPlay(boardState, selfValue, othersValue) {
  let hBoard = heuristicBoard(boardState, selfValue, othersValue);
  let bestCell = 0;
  let bestCellRow = 0;
  let bestCellCol = 0;
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

// Generates a board with the values for each cell.
// The higher the value the most desirable the cell.
function heuristicBoard(boardState, selfValue, othersValue) {
  return boardState.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      if (cell) {
        // The cell is not available, return 0;
        return 0;
      } else {
        let value = NUMBER_OF_PLAYS[rowIndex][colIndex];
        // Check the value of the cell based on the lines.
        let rowValue = calculateCellHeuristic(row, selfValue, othersValue);
        // Check the value of the cell based on the columns.
        let col = [boardState[0][colIndex], boardState[1][colIndex], boardState[2][colIndex]];
        let colValue = calculateCellHeuristic(col, selfValue, othersValue);
        let diagonalValue = 0;
        let invertedDiagValue = 0;
        // Check the value of the cell based on the diagonals.
        if (rowIndex == colIndex || Math.abs(rowIndex - colIndex) == 2) {
          const DIAG = [[0, 0], [1, 1], [2, 2]];
          const INVERTED_DIAG = [[0, 2], [1, 1], [2, 0]];
          if (DIAG.some((element) => element[0] == rowIndex && element[1] == colIndex)) {
            diagonalValue = calculateCellHeuristic(DIAG.map((position) => boardState[position[0]][position[1]]), selfValue, othersValue);
          }
          if (INVERTED_DIAG.some((element) => element[0] == rowIndex && element[1] == colIndex)) {
            invertedDiagValue = calculateCellHeuristic(INVERTED_DIAG.map((position) => boardState[position[0]][position[1]]), selfValue, othersValue);
          }
        }
        return value + rowValue + colValue + diagonalValue + invertedDiagValue;
      }
    })
  })
}

// Calculates the value of a cell in a line.
// If the line has two player marks, adds 100 to the value.
// If the line has two opponent marks, adds 50 to the value.
// If the line has only one mark, either player or opponent, ads 1 to the value.
// If the line has both marks, adds 0 to the value.
function calculateCellHeuristic(line, selfValue, othersValue) {
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