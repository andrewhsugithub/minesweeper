export const checkCanReveal = (
  row: number,
  col: number,
  gridObject: GridObject
) => {
  const grid = gridObject.grid;
  return grid[row]![col]!.hasRevealed || grid[row]![col]!.hasFlag;
};

export const checkCanPlaceFlag = (
  row: number,
  col: number,
  gridObject: GridObject
) => {
  const grid = gridObject.grid;
  return grid[row]![col]!.hasRevealed;
};
