"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime:        60 * 1000,
            retry:            1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background:  "#161628",
            color:       "#F0F0FF",
            border:      "1px solid rgba(255,255,255,0.1)",
            borderRadius:"12px",
            fontSize:    "14px",
            fontFamily:  "'Plus Jakarta Sans', sans-serif",
          },
          success: {
            iconTheme: { primary: "#10D9A0", secondary: "#161628" },
          },
          error: {
            iconTheme: { primary: "#F45B69", secondary: "#161628" },
          },
        }}
      />
    </QueryClientProvider>
  );
}
