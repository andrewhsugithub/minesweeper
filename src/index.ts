import { select, input } from "@inquirer/prompts";

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const getValue = (cell: Cell) => {
  if (cell.hasRevealed) {
    if (cell.isMine) return "M";
    // console.log("hello");
    return `${cell.neighboringMines}`;
  }
  if (cell.hasFlag) return "F";
  return "*";
};

const showField = async (gameGrid) =>
  new Promise<boolean>((res, rej) => {
    const [m, n] = [gameGrid.length, gameGrid[0].length];
    let hasWon = true;
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
        `${(i + 1).toString().padStart(2, " ")} | ${row
          .map((cell: Cell) => {
            if (!cell.isMine) hasWon &&= cell.hasRevealed;
            return getValue(cell);
          })
          .join(" ".padEnd(2, " "))}`
      )
    );
    res(hasWon);
  });

const generateMines = (firstCellRow, firstCellCol, rows, cols, numMines) => {
  const mines = new Set<number>();
  while (mines.size <= numMines) {
    let randomIdx = -1;
    while (
      mines.has(randomIdx) ||
      randomIdx === firstCellRow * cols + firstCellCol
    )
      randomIdx = Math.floor(Math.random() * rows * cols);
    mines.add(randomIdx);
  }
  return (idx) => mines.has(idx);
};

const countNeighborMines = (i, j, grid) => {
  const [m, n] = [grid.length, grid[0].length];

  if (grid[i][j].isMine) {
    directions.forEach(([dx, dy]) => {
      const [newI, newJ] = [i + dx, j + dy];
      if (
        newI >= 0 &&
        newI < m &&
        newJ >= 0 &&
        newJ < n &&
        !grid[newI][newJ].isMine
      )
        grid[newI][newJ].neighboringMines++;
    });
  }
};

const cellReveal = (i, j, grid: Cell[][]) => {
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

const generateGrid = async (firstCellRow, firstCellCol, rows, cols, numMines) =>
  new Promise<Cell[][]>((res, rej) => {
    // generate mines
    const isCellAMine = generateMines(
      firstCellRow,
      firstCellCol,
      rows,
      cols,
      numMines
    );
    // generate map
    const grid: Cell[][] = Array.from({ length: +rows }, (_, i) =>
      Array.from({ length: +cols }, (_, j) => {
        const cell: Cell = {
          // value: "*",
          hasFlag: false,
          hasRevealed: false,
          neighboringMines: 0,
        };
        if (isCellAMine(i * cols + j)) return { ...cell, isMine: true };
        else return cell;
      })
    );
    // count neighboring mines
    grid.forEach((row, i) =>
      row.forEach((_, j) => countNeighborMines(i, j, grid))
    );

    // reveal first cell
    cellReveal(firstCellRow, firstCellCol, grid);
    res(grid);
  });

const welcome = async () => {
  console.log("Welcome to Minesweeper!");
  const rows = await input({
    message: "Enter the number of rows:",
    validate: (input) => +input > 0 && +input < 100,
  });
  const cols = await input({
    message: "Enter the number of cols:",
    validate: (input) => +input > 0 && +input < 100,
  });
  const mines = await input({
    message: "Enter the number of mines:",
    validate: (input) => +input > 0 && +input <= +rows * +cols - 1,
  });

  // check too much rows cols mines?
  const firstCellRow = await input({
    message: "Enter the row of the first cell (1-indexed):",
    validate: (input) => +input > 0 && +input <= +rows,
  });
  const firstCellCol = await input({
    message: "Enter the col of the first cell (1-indexed):",
    validate: (input) => +input > 0 && +input <= +cols,
  });
  const grid = await generateGrid(
    +firstCellRow - 1,
    +firstCellCol - 1,
    rows,
    cols,
    mines
  );
  const hasWon = await showField(grid);
  if (hasWon) {
    console.log("Congratulations! You have won!");
    process.exit();
  }
  return grid;
};

const actions = async (grid: Cell[][]) => {
  const action = await select({
    message: "Select an action:",
    choices: [
      {
        name: "Reveal a Cell",
        value: "Reveal a Cell",
        description: "Reveal a Cell",
      },
      {
        name: "Place a Flag",
        value: "Place a Flag",
        description: "Place a Flag",
      },
      {
        name: "Exit",
        value: "Exit",
        description: "Exit Game",
      },
    ],
  });

  const [m, n] = [grid.length, grid[0].length];

  switch (action) {
    case "Reveal a Cell": {
      const row = await input({
        message: "Enter the row of the cell to reveal (1-indexed):",
        validate: (input) => +input > 0 && +input <= m,
      });
      const col = await input({
        message: "Enter the col of the cell to reveal (1-indexed):",
        validate: (input) => +input > 0 && +input <= n,
      });
      if (grid[+row - 1][+col - 1].hasRevealed) {
        console.log("Cell has already been revealed!");
        await actions(grid);
      }
      if (grid[+row - 1][+col - 1].isMine) {
        console.log("Game Over! You stepped on a mine!");
        grid[+row - 1][+col - 1].hasRevealed = true;
        await showField(grid);
        return;
      }
      cellReveal(+row - 1, +col - 1, grid);
      const allRevealed = await showField(grid);
      if (allRevealed) {
        console.log("Congratulations! You have won!");
        return;
      }
      await actions(grid);
      break;
    }
    case "Place a Flag": {
      const row = await input({
        message: "Enter the row of the cell to place a flag (1-indexed):",
        validate: (input) => +input > 0 && +input <= m,
      });
      const col = await input({
        message: "Enter the col of the cell to place a flag (1-indexed):",
        validate: (input) => +input > 0 && +input <= n,
      });
      if (grid[+row - 1][+col - 1].hasRevealed) {
        console.log("Cell has already been revealed!");
        await actions(grid);
      }
      if (grid[+row - 1][+col - 1].hasFlag) {
        console.log("Cell has already been flagged!");
        await actions(grid);
      }
      grid[+row - 1][+col - 1].hasFlag = true;
      const allRevealed = await showField(grid);
      if (allRevealed) {
        console.log("Congratulations! You have won!");
        return;
      }
      await actions(grid);
      break;
    }
    case "Exit":
      break;
  }
};

const main = async () => {
  const field = await welcome();
  await actions(field);
};

await main();
