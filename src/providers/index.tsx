import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";

import { queryClient } from "@/lib/query-client";
import { LocaleProvider } from "./locale";
import { ThemeProvider } from "./theme";
import { Toaster } from "@/components/ui/sonner";

export const Providers = () => (
  <LocaleProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Outlet />
        <Toaster closeButton richColors />
      </ThemeProvider>
    </QueryClientProvider>
  </LocaleProvider>
);
