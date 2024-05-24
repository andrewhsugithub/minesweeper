import express from "express";
import cors from "cors";
import { generateGrid } from "@/services/generateGrid.js";
import { checkCellIsMine, disableMine } from "@/services/mine.js";
import { cellReveal } from "@/services/cellReveal.js";
import { type Request, type Response } from "express";
import {
  checkGameHasRevealedAlready,
  checkGameStatus,
} from "@/services/checkGameStatus.js";
import { flag } from "@/services/placeFlag.js";
import { checkCellStatus } from "@/services/checkCellStatus.js";
import { gridObject } from "./services/grid.js";

async function main() {
  const app = express();

  // put into loaders folder
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // api
  // app.use("/api", routes);

  const port = 5000;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get(
    "/api/v1/generate-game",
    (req, res, next) => {
      if (Object.keys(req.query).length !== 3)
        return res.status(400).json({ msg: "Invalid query parameters" });

      // const numMines = req.query.numMines;
      // const numRows = req.query.numRows;
      // const numCols = req.query.numCols;
      const { numMines, numRows, numCols } = req.query;
      if (!numMines || !numRows || !numCols)
        return res.status(400).json({ msg: "Invalid query parameters" });
      console.log(numMines, numRows, numCols);

      // generate game with mines+1 (for faster performance, we can disable the mine that is the +1)
      generateGrid(+numRows!, +numCols!, +numMines! + 1);

      next();
    },
    sendGrid
  );

  app.get(
    "/api/v1/cell-reveal",
    (req, res, next) => {
      if (
        Object.keys(req.query).length < 2 ||
        Object.keys(req.query).length > 3
      )
        return res.status(400).json({ msg: "Invalid query parameters" });

      const { row, col, first } = req.query;
      if (!row || !col)
        return res.status(400).json({ msg: "Invalid query parameters" });
      console.log("in cell reveal api", row, col);

      // check if first cell is clicked, if yes, disable the mine, else continue
      if (first === "true") {
        // check if the game has already revealed the first cell
        if (!checkGameHasRevealedAlready())
          // check if the first cell is a mine, if not disable the redundant mine, else disable the first cell mine
          disableMine(+row!, +col!);
      } else {
        // if first is omitted or false for some reason and the game hasn't revealed its first cell, disable the mine
        if (!checkGameHasRevealedAlready()) disableMine(+row!, +col!);
      }

      // check if cell is a mine, if it's a mine, game over!!
      if (checkCellIsMine(+row!, +col!)) {
        res.status(200).json({ msg: "Game Over!", grid: gridObject.grid });
        return;
      }

      // check if the cell is already revealed or flagged
      if (checkCellStatus(+row!, +col!)) {
        res.status(200).json({ msg: "Cell already revealed" });
        return;
      }

      // do cell reveal including the neighboring cells
      cellReveal(+row!, +col!);

      next();
    },
    sendGrid
  );

  app.get(
    "/api/v1/flag",
    (req, res, next) => {
      if (Object.keys(req.query).length !== 2)
        return res.status(400).json({ msg: "Invalid query parameters" });

      const { row, col } = req.query;
      if (!row || !col)
        return res.status(400).json({ msg: "Invalid query parameters" });
      console.log("flag", row, col);

      // place flag or unflag
      flag(+row!, +col!);

      next();
    },
    sendGrid
  );

  function sendGrid(req: Request, res: Response) {
    res.status(200).json({ hasWon: checkGameStatus(), grid: gridObject.grid });
  }

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
}

main();
