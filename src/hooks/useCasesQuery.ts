import { useAuth } from "./useAuth";
import { getAllCases } from "../apis/cases";
import { useQuery } from "@tanstack/react-query";

export const casesQueryKey = ["cases"] as const;

export function useCasesQuery() {
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";

  return useQuery({
    queryKey: [...casesQueryKey, contactId],
    queryFn: () => getAllCases(contactId),
    enabled: Boolean(contactId),
  });
}
