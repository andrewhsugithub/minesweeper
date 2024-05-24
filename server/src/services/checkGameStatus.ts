import { gridObject } from "./grid.js";

export const checkGameStatus = () => {
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

export const checkGameHasRevealedAlready = () => {
  return gridObject.firstCellSelected;
};
