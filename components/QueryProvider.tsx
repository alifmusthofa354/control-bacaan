// components/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Opsional: untuk debugging

const queryClient = new QueryClient();

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools sangat membantu saat pengembangan */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
