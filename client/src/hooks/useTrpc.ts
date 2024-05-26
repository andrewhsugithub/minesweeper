import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { httpBatchLink } from "@trpc/client";

export const useTrpc = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5000/trpc",
          // // You can pass any HTTP headers you wish here
          // async headers() {
          //   return {
          //     authorization: getAuthCookie(),
          //   };
          // },
        }),
      ],
    })
  );

  return {
    queryClient,
    trpcClient,
  };
};
