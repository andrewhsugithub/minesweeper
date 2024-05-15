import { select, input } from "@inquirer/prompts";
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

const main = async () => {
  const field = await initializeGame();
};

await main();
