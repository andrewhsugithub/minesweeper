import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { gridObject } from "../api/models/grid.js";

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
  gridObject,
});
export type Context = Awaited<ReturnType<typeof createContext>>;
