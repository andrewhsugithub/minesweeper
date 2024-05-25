export const checkCellStatus = (
  row: number,
  col: number,
  gridObject: GridObject
) => {
  const grid = gridObject.grid;
  return grid[row]![col]!.hasRevealed || grid[row]![col]!.hasFlag;
};
