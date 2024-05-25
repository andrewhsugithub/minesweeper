import { t } from "../../utils/trpc.js";
import { z } from "zod";
import { checkGameStatus } from "../services/checkGameStatus.js";
import { flag } from "../services/placeFlag.js";

export const flagRouter = t.router({
  flag: t.procedure
    .input(
      z.object({
        row: z.number(),
        col: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { gridObject } = ctx;

      flag(input.row, input.col, gridObject);

      return { hasWon: checkGameStatus(gridObject), grid: gridObject.grid };
    }),
});
