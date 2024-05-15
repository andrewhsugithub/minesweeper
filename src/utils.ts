import { directions } from "./constants.js";

export const cellReveal = (i, j, grid: Cell[][]) => {
  const [m, n] = [grid.length, grid[0].length];

  grid[i][j].hasRevealed = true;
  if (grid[i][j].neighboringMines === 0) {
    directions.forEach(([dx, dy]) => {
      const [newI, newJ] = [i + dx, j + dy];
      if (
        newI >= 0 &&
        newI < m &&
        newJ >= 0 &&
        newJ < n &&
        !grid[newI][newJ].hasRevealed &&
        !grid[newI][newJ].isMine &&
        !grid[newI][newJ].hasFlag
      )
        cellReveal(newI, newJ, grid);
    });
  }
};

const getValue = (cell: Cell) => {
  if (cell.hasRevealed) {
    if (cell.isMine) return "M";
    return `${cell.neighboringMines}`;
  }
  if (cell.hasFlag) return "F";
  return "*";
};

export const showField = async (gameGrid) =>
  new Promise<boolean>((res, rej) => {
    const [m, n] = [gameGrid.length, gameGrid[0].length];
    let hasWon = true; // check if all non-mine cells have been revealed
    // print out the column indices
    console.log(
      [...Array(n).keys()]
        .map((i) => {
          if (i === 0) return "     " + (i + 1).toString().padEnd(2, " ");
          return (i + 1).toString().padEnd(2, " ");
        })
        .join(" ")
    );
    gameGrid.forEach((row, i) =>
      console.log(
        // print out the row indices
        `${(i + 1).toString().padStart(2, " ")} | ${row
          .map((cell: Cell) => {
            // print out the cell values
            if (!cell.isMine) hasWon &&= cell.hasRevealed;
            return getValue(cell);
          })
          .join(" ".padEnd(2, " "))}`
      )
    );
    res(hasWon);
  });
