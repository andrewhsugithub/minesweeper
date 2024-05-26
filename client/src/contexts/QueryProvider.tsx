import { QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { useTrpc } from "../hooks/useTrpc";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const { queryClient, trpcClient } = useTrpc();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default QueryProvider;
