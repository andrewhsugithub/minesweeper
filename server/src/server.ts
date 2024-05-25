import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./api/_app.js";
import { createContext } from "./utils/context.js";

async function main() {
  const app = express();

  // put into loaders folder
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const port = 5000;

  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
}

main();
