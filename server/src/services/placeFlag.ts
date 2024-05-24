import { gridObject } from "./grid.js";

export const flag = (row: number, col: number) => {
  const grid = gridObject.grid;
  grid[row]![col]!.hasFlag = !grid[row]![col]!.hasFlag;
};
