import { QueryClient } from "@tanstack/react-query";

// Shared client for the whole app. Sensible defaults for a manga reader:
// - data stays "fresh" for 5 min (no refetch on remount/navigation within that
//   window — this is what makes back-navigation instant),
// - kept in memory for 30 min after the last observer unmounts,
// - one retry on failure.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      retry: 1,
    },
  },
});
