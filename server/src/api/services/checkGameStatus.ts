// if win return true, else return false
export const checkGameStatus = (gridObject: GridObject) => {
  // let hasWon = true;
  // grid.forEach((row, i) =>
  //   row.map((cell: Cell) => {
  //     if (!cell.isMine) hasWon &&= cell.hasRevealed;
  //   })
  // );
  const [rows, cols] = [gridObject.rows, gridObject.cols];
  console.log(
    "check game status",
    rows,
    cols,
    gridObject.numberOfRevealedCells,
    gridObject.numberOfMines,
    rows * cols - gridObject.numberOfRevealedCells === gridObject.numberOfMines
  );

  return (
    rows * cols - gridObject.numberOfRevealedCells === gridObject.numberOfMines
  );
};

export const checkGameHasRevealedAlready = (gridObject: GridObject) => {
  return gridObject.firstCellSelected;
};
