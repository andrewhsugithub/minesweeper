import { gridObject } from "./grid.js";

let redundantMineCell: [number, number];

export const generateMines = (rows: number, cols: number, numMines: number) => {
  // generate mines
  const mines = new Set<number>();
  while (mines.size < numMines) {
    let randomIdx = Math.floor(Math.random() * rows * cols);
    if (!mines.has(randomIdx)) mines.add(randomIdx);
  }
  // choose a random mine to disable
  const redundantMineIdx = Math.floor(Math.random() * numMines);
  const redundantMine = Array.from(mines)[redundantMineIdx]!;
  redundantMineCell = [Math.floor(redundantMine / cols), redundantMine % cols];
  console.log(
    "redundant mine",
    redundantMine,
    Math.floor(redundantMine / cols),
    redundantMine % cols,
    mines
  );

  return (idx: number) => ({
    isMine: mines.has(idx),
    isRedundantMine: idx === redundantMine,
  });
};

export const disableMine = (row: number, col: number) => {
  const grid = gridObject.grid;

  console.log("disable mine", row, col);
  // console.log("row", grid[row]);
  // console.log("col", grid[row]![col]);
  let [r, c] = [row, col];
  // check if first cell is mine, if not disable the redundant mine
  if (!grid[row]![col]!.isMine) [r, c] = redundantMineCell;

  const [m, n] = [grid.length, grid[0]!.length];
  for (let i = r - 1; i < r + 2; i++) {
    for (let j = c - 1; j < c + 2; j++) {
      if (i < 0 || i >= m || j < 0 || j >= n || grid[i]![j]!.isMine) continue;
      grid[i]![j]!.neighboringMines -= 1;
    }
  }
  grid[r]![c]!.isMine = false;
  grid[r]![c]!.isRedundantMine = false;
};

export const checkCellIsMine = (row: number, col: number) => {
  const grid = gridObject.grid;

  return grid[row]![col]!.isMine;
};
