import { directions } from "../constants.js";
import { generateMines } from "./mine.js";
import { gridObject } from "./grid.js";

const countNeighborMines = (i: number, j: number, grid: Cell[][]) => {
  const [m, n] = [grid.length, grid[0]!.length];

  if (grid[i]![j]!.isMine) {
    directions.forEach(([dx, dy]) => {
      const [newI, newJ] = [i + dx!, j + dy!];
      if (
        newI >= 0 &&
        newI < m &&
        newJ >= 0 &&
        newJ < n &&
        !grid[newI]![newJ]!.isMine
      )
        grid[newI]![newJ]!.neighboringMines++;
    });
  }
};

export const generateGrid = (rows: number, cols: number, numMines: number) => {
  console.log("generate grid", rows, cols, numMines - 1);
  // generate mines
  const mineStatus = generateMines(rows, cols, numMines);
  // generate map
  const grid = Array.from({ length: +rows }, (_, i) =>
    Array.from({ length: +cols }, (_, j) => {
      const cell: Cell = {
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
