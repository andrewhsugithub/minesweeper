﻿import { select, input } from "@inquirer/prompts";
import { generateGrid } from "./initializeGame.js";
import { cellReveal, showField } from "./utils.js";
const initializeGame = async () => {
  console.log("Welcome to Minesweeper!");
  // ask for input
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
  // ask for the first cell
  const firstCellRow = await input({
    message: "Enter the row of the first cell (1-indexed):",
    validate: (input) => +input > 0 && +input <= +rows,
  });
  const firstCellCol = await input({
    message: "Enter the col of the first cell (1-indexed):",
    validate: (input) => +input > 0 && +input <= +cols,
  });
  // generate the grid
  const grid = await generateGrid(
    +firstCellRow - 1,
    +firstCellCol - 1,
    rows,
    cols,
    mines
  );
  // show the field
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
        process.exit();
      }
      cellReveal(+row - 1, +col - 1, grid);
      const allRevealed = await showField(grid);
      if (allRevealed) {
        console.log("Congratulations! You have won!");
        process.exit();
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
        process.exit();
      }
      await actions(grid);
      break;
    }
    case "Exit":
      break;
  }
};

const main = async () => {
  const field = await initializeGame();
  await actions(field);
};

await main();
