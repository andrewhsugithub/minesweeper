import { TRPCError } from "@trpc/server";
import { t } from "../../utils/trpc.js";

interface Input {
  row: number;
  col: number;
  first?: boolean;
}

// middleware to check if the row and col are within board range
export const validateRangeMiddleware = t.middleware(({ ctx, next, input }) => {
  const { row, col } = input as Input;
  const { gridObject } = ctx;

  const numRows = gridObject.grid.length;
  const numCols = gridObject.grid[0]!.length;

  if (row < 0 || row >= numRows || col < 0 || col >= numCols) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Row or column is out of range",
    });
  }

  return next();
});
