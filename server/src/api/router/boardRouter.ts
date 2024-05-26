import { z } from "zod";
import { generateGrid } from "../services/generateGrid.js";
import { publicProcedure, router } from "../../utils/trpc.js";

export const boardRouter = router({
  generateGame: publicProcedure
    .input(
      z
        .object({
          numMines: z.number().gte(0),
          numRows: z.number().gte(1).lte(50),
          numCols: z.number().gte(1).lte(50),
        })
        .refine(
          (input) => input.numRows * input.numCols - 1 >= input.numMines,
          "#rows * #cols - 1 ( first selected cell can't be a mine ) should be greater than or equal to #mines"
        )
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
