import { t } from "../../utils/trpc.js";
import { z } from "zod";
import {
  checkGameHasRevealedAlready,
  checkGameStatus,
} from "../services/checkGameStatus.js";
import { checkCellIsMine, disableMine } from "../services/mine.js";
import { checkCellStatus } from "../services/checkCellStatus.js";
import { cellReveal } from "../services/cellReveal.js";

export const cellRouter = t.router({
  cellReveal: t.procedure
    .input(
      z.object({
        row: z.number(),
        col: z.number(),
        first: z.boolean().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { gridObject } = ctx;

      if (input.first && !checkGameHasRevealedAlready(gridObject)) {
        disableMine(input.row, input.col, gridObject);
      } else if (!input.first && !checkGameHasRevealedAlready(gridObject)) {
        disableMine(input.row, input.col, gridObject);
      }

      if (checkCellIsMine(input.row, input.col, gridObject)) {
        return { msg: "Game Over!", grid: gridObject.grid };
      }

      if (checkCellStatus(input.row, input.col, gridObject)) {
        return { msg: "Cell already revealed", grid: gridObject.grid };
      }

      cellReveal(input.row, input.col, gridObject);

      return { hasWon: checkGameStatus(gridObject), grid: gridObject.grid };
    }),
});
