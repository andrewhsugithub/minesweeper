import { publicProcedure, router } from "../../utils/trpc.js";
import { z } from "zod";

import { checkCellIsMine, disableMine } from "../services/mine.js";
import { validateRangeMiddleware } from "../middlewares/validateRange.js";
import { TRPCError } from "@trpc/server";
import { cellReveal, checkCanReveal } from "../services/cell.js";
import {
  checkGameHasRevealedAlready,
  checkGameStatus,
} from "../services/board.js";

export const cellRouter = router({
  cellReveal: publicProcedure
    .input(
      z.object({
        row: z.number().gte(0),
        col: z.number().gte(0),
        first: z.boolean().optional(), // if it is the first cell selected
      })
    )
    .use(validateRangeMiddleware)
    .mutation(({ input, ctx }) => {
      const { gridObject } = ctx;

      const { cellHasFlag, cellRevealed } = checkCanReveal(
        input.row,
        input.col,
        gridObject
      );
      // if the cell has already been revealed, throw TRPCError
      if (cellHasFlag || cellRevealed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: cellRevealed
            ? "Cell has already been revealed"
            : "Cell has a flag placed on it",
        });
      }

      // if first cell is selected and the game has not been revealed yet, disable the mine
      if (!checkGameHasRevealedAlready(gridObject))
        disableMine(input.row, input.col, gridObject); // if the first cell selected is a mine, disable it, else disable the redundant mine

      // if the cell is a mine, game over
      if (checkCellIsMine(input.row, input.col, gridObject)) {
        return { gameStatus: true, hasWon: false, grid: gridObject.grid };
      }

      cellReveal(input.row, input.col, gridObject);

      const checkIfWin = checkGameStatus(gridObject);
      return {
        gameStatus: checkIfWin,
        hasWon: checkIfWin,
        grid: gridObject.grid,
      };
    }),
});
