import { directions } from "constants.js";

export const cellReveal = (r: number, c: number, gridObject: GridObject) => {
  gridObject.firstCellSelected = true;
  const grid = gridObject.grid;
  console.log("cell reveal", r, c);
  const [m, n] = [grid.length, grid[0]!.length];
  let revealedCellsCount = 0;

  let queue: [number, number][] = [[r, c]];
  while (queue.length) {
    const cell = queue.shift();
    const [i, j] = cell!;
    grid[i]![j]!.hasRevealed = true;
    revealedCellsCount++;
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
        )
          queue.push([newI, newJ]);
      });
    }
  }
  gridObject.numberOfRevealedCells += revealedCellsCount;
};
