﻿import { t } from "../utils/trpc.js";
import { boardRouter } from "./router/boardRouter.js";
import { cellRouter } from "./router/cellRouter.js";
import { flagRouter } from "./router/flagRouter.js";

export const appRouter = t.router({
  board: boardRouter,
  cell: cellRouter,
  flag: flagRouter,
});

export type AppRouter = typeof appRouter;
