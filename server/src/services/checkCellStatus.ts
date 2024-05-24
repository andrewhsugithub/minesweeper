import { gridObject } from "./grid.js";

export const checkCellStatus = (row: number, col: number) => {
  const grid = gridObject.grid;
  return grid[row]![col]!.hasRevealed || grid[row]![col]!.hasFlag;
};
