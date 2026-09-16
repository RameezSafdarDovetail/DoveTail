import { useAuth } from "./useAuth";
import { getAllCases } from "../apis/cases";
import { useQuery } from "@tanstack/react-query";

export const casesQueryKey = ["cases"] as const;

/** Shared cases list for Open/Closed/All pages (first page of GetAllCases). */
export function useCasesQuery() {
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";

  return useQuery({
    queryKey: [...casesQueryKey, contactId],
    queryFn: async () => {
      const response = await getAllCases(contactId, 1, 1000);
      return response.Data ?? [];
    },
    enabled: Boolean(contactId),
  });
}
