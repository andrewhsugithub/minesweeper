import { directions } from "./constants.js";
import { cellReveal } from "./utils.js";

// init process
const generateMines = (firstCellRow, firstCellCol, rows, cols, numMines) => {
  const mines = new Set<number>();
  while (mines.size <= numMines) {
    let randomIdx = -1;
    while (
      mines.has(randomIdx) ||
      randomIdx === firstCellRow * cols + firstCellCol
    )
      randomIdx = Math.floor(Math.random() * rows * cols);
    mines.add(randomIdx);
  }
  return (idx) => mines.has(idx);
};

const countNeighborMines = (i, j, grid) => {
  const [m, n] = [grid.length, grid[0].length];

  if (grid[i][j].isMine) {
    directions.forEach(([dx, dy]) => {
      const [newI, newJ] = [i + dx, j + dy];
      if (
        newI >= 0 &&
        newI < m &&
        newJ >= 0 &&
        newJ < n &&
        !grid[newI][newJ].isMine
      )
        grid[newI][newJ].neighboringMines++;
    });
  }
};

export const generateGrid = async (
  firstCellRow,
  firstCellCol,
  rows,
  cols,
  numMines
) =>
  new Promise<Cell[][]>((res, rej) => {
    // generate mines
    const isCellAMine = generateMines(
      firstCellRow,
      firstCellCol,
      rows,
      cols,
      numMines
    );
    // generate map
    const grid: Cell[][] = Array.from({ length: +rows }, (_, i) =>
      Array.from({ length: +cols }, (_, j) => {
        const cell: Cell = {
          // value: "*",
          hasFlag: false,
          hasRevealed: false,
          neighboringMines: 0,
        };
        if (isCellAMine(i * cols + j)) return { ...cell, isMine: true };
        else return cell;
      })
    );
    // count neighboring mines
    grid.forEach((row, i) =>
      row.forEach((_, j) => countNeighborMines(i, j, grid))
    );

    // reveal first cell
    cellReveal(firstCellRow, firstCellCol, grid);
    res(grid);
  });
