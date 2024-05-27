import { directions } from "../../constants.js";

export const generateMines = (
  rows: number,
  cols: number,
  numMines: number,
  gridObject: GridObject
) => {
  // generate mines
  const mines = new Set<number>();
  while (mines.size < numMines) {
    let randomIdx = Math.floor(Math.random() * rows * cols);
    if (!mines.has(randomIdx)) mines.add(randomIdx);
  }
  // choose a random mine to disable
  const redundantMineIdx = Math.floor(Math.random() * numMines);
  const redundantMine = Array.from(mines)[redundantMineIdx]!;
  gridObject.redundantMineCell = [
    Math.floor(redundantMine / cols),
    redundantMine % cols,
  ];
  // console.log(
  //   "redundant mine",
  //   redundantMine,
  //   Math.floor(redundantMine / cols),
  //   redundantMine % cols,
  //   mines
  // );

  return (idx: number) => ({
    isMine: mines.has(idx),
    isRedundantMine: idx === redundantMine,
  });
};

export const disableMine = (
  row: number,
  col: number,
  gridObject: GridObject
) => {
  const grid = gridObject.grid;

  console.log("disable mine", row, col);
  let [r, c] = [row, col];
  // check if first cell is mine, if not disable the redundant mine
  if (!grid[row]![col]!.isMine) [r, c] = gridObject.redundantMineCell!;

  const [m, n] = [grid.length, grid[0]!.length];
  for (let i = r - 1; i < r + 2; i++) {
    for (let j = c - 1; j < c + 2; j++) {
      if (i < 0 || i >= m || j < 0 || j >= n || grid[i]![j]!.isMine) continue;
      grid[i]![j]!.neighboringMines -= 1;
    }
  }
  grid[r]![c]!.isMine = false;
  grid[r]![c]!.isRedundantMine = false;
  countNeighborMines(r, c, grid);
};

export const checkCellIsMine = (
  row: number,
  col: number,
  gridObject: GridObject
) => {
  const grid = gridObject.grid;

  return grid[row]![col]!.isMine;
};

export const countNeighborMines = (i: number, j: number, grid: Cell[][]) => {
  const [m, n] = [grid.length, grid[0]!.length];

  if (!grid[i]![j]!.isMine) {
    directions.forEach(([dx, dy]) => {
      const [newI, newJ] = [i + dx!, j + dy!];
      if (
        newI >= 0 &&
        newI < m &&
        newJ >= 0 &&
        newJ < n &&
        grid[newI]![newJ]!.isMine
      )
        grid[i]![j]!.neighboringMines++;
    });
  }
};
