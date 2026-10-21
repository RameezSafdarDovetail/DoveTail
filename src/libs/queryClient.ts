import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const caseListQueryKeys = [
  ["active-cases"],
  ["closed-cases"],
  ["all-cases"],
  ["cases"],
] as const;

/** Refetch every cached case list after a create or update. */
export function refreshCaseLists() {
  return Promise.all(
    caseListQueryKeys.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey })
    )
  );
}
