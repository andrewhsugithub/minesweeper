export const flag = (row: number, col: number, gridObject: GridObject) => {
  const grid = gridObject.grid;
  grid[row]![col]!.hasFlag = !grid[row]![col]!.hasFlag;
};
