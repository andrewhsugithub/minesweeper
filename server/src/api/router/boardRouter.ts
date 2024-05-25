import { t } from "@/utils/trpc.js";
import { z } from "zod";
import { generateGrid } from "../services/generateGrid.js";

export const boardRouter = t.router({
  generateGame: t.procedure
    .input(
      z.object({
        numMines: z.number(),
        numRows: z.number(),
        numCols: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { gridObject } = ctx;
      generateGrid(
        input.numRows,
        input.numCols,
        input.numMines + 1,
        gridObject
      );
      return { grid: gridObject.grid };
    }),
});
