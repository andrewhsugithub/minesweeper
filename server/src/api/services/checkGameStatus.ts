export const checkGameStatus = (gridObject: GridObject) => {
  // let hasWon = true;
  // grid.forEach((row, i) =>
  //   row.map((cell: Cell) => {
  //     if (!cell.isMine) hasWon &&= cell.hasRevealed;
  //   })
  // );
  const [rows, cols] = [gridObject.rows, gridObject.cols];

  return (
    rows * cols - gridObject.numberOfRevealedCells === gridObject.numberOfMines
  );
};

export const checkGameHasRevealedAlready = (gridObject: GridObject) => {
  return gridObject.firstCellSelected;
};
