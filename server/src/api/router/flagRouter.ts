import { publicProcedure, router } from "../../utils/trpc.js";
import { z } from "zod";
import { validateRangeMiddleware } from "../middlewares/validateRange.js";
import { TRPCError } from "@trpc/server";
import { checkCanPlaceFlag, placeFlag } from "../services/cell.js";
import { checkGameStatus } from "../services/board.js";

export const flagRouter = router({
  flag: publicProcedure
    .input(
      z.object({
        row: z.number().gte(0),
        col: z.number().gte(0),
      })
    )
    .use(validateRangeMiddleware)
    .mutation(({ input, ctx }) => {
      const { gridObject } = ctx;

      // if the cell has already been revealed, throw TRPCError
      if (checkCanPlaceFlag(input.row, input.col, gridObject)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cell has already been revealed",
        });
      }

      placeFlag(input.row, input.col, gridObject);

      // const checkIfWin = checkGameStatus(gridObject);
      return {
        gameStatus: false,
        hasWon: false,
        grid: gridObject.grid,
      };
    }),
});
