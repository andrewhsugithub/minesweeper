import { directions } from "../../constants.js";

// check if cell is revealed or has flag => can't reveal
export const checkCanReveal = (
  row: number,
  col: number,
  gridObject: GridObject
) => {
  const grid = gridObject.grid;
  return grid[row]![col]!.hasRevealed || grid[row]![col]!.hasFlag;
};

// check if cell is revealed => can't place flag
export const checkCanPlaceFlag = (
  row: number,
  col: number,
  gridObject: GridObject
) => {
  const grid = gridObject.grid;
  return grid[row]![col]!.hasRevealed;
};

// reveal cell using bfs
export const cellReveal = (r: number, c: number, gridObject: GridObject) => {
  gridObject.firstCellSelected = true;
  const grid = gridObject.grid;
  console.log("cell reveal", r, c);
  const [m, n] = [grid.length, grid[0]!.length];
  let revealedCellsCount = 1;
  grid[r]![c]!.hasRevealed = true;

  let queue: [number, number][] = [[r, c]];
  while (queue.length) {
    const cell = queue.shift();
    const [i, j] = cell!;
    if (grid[i]![j]!.neighboringMines === 0) {
      directions.forEach(([dx, dy]: number[]) => {
        const [newI, newJ] = [i + dx!, j + dy!];
        if (
          newI >= 0 &&
          newI < m &&
          newJ >= 0 &&
          newJ < n &&
          !grid[newI]![newJ]!.hasRevealed &&
          !grid[newI]![newJ]!.isMine
        ) {
          queue.push([newI, newJ]);
          grid[newI]![newJ]!.hasRevealed = true;
          revealedCellsCount++;
        }
      });
    }
  }
  gridObject.numberOfRevealedCells += revealedCellsCount;
};

// flag or unflag cell
export const placeFlag = (row: number, col: number, gridObject: GridObject) => {
  const grid = gridObject.grid;
  grid[row]![col]!.hasFlag = !grid[row]![col]!.hasFlag;
};
