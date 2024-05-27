import { countNeighborMines, generateMines } from "./mine.js";

export const generateGrid = (
  rows: number,
  cols: number,
  numMines: number,
  gridObject: GridObject
) => {
  console.log();
  console.log("generate grid", rows, cols, numMines - 1);
  // generate mines
  const mineStatus = generateMines(rows, cols, numMines, gridObject);
  // generate map
  const grid = Array.from({ length: +rows }, (_, i) =>
    Array.from({ length: +cols }, (_, j) => {
      const cell: Cell = {
        row: i,
        col: j,
        // value: "*",
        hasFlag: false,
        hasRevealed: false,
        neighboringMines: 0,
        ...mineStatus(i * cols + j),
      };
      return cell;
    })
  );
  // count neighboring mines
  grid.forEach((row, i) =>
    row.forEach((_, j) => countNeighborMines(i, j, grid))
  );

  // set grid object
  gridObject.grid = grid;
  gridObject.rows = rows;
  gridObject.cols = cols;
  // -1 because of the redundant mine
  gridObject.numberOfMines = numMines - 1;
  gridObject.numberOfRevealedCells = 0;
  gridObject.firstCellSelected = false;
};

// if win return true, else return false
export const checkGameStatus = (gridObject: GridObject) => {
  const [rows, cols] = [gridObject.rows, gridObject.cols];
  console.log(
    "check game status",
    rows,
    cols,
    gridObject.numberOfRevealedCells,
    gridObject.numberOfMines,
    rows * cols - gridObject.numberOfRevealedCells === gridObject.numberOfMines
  );

  return (
    rows * cols - gridObject.numberOfRevealedCells === gridObject.numberOfMines
  );
};

export const checkGameHasRevealedAlready = (gridObject: GridObject) => {
  return gridObject.firstCellSelected;
};
