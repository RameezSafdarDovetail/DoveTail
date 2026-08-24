import { apiRequest, apiFormRequest } from "../index";
import type {
  ActiveCase,
  CaseDetail,
  CreateCaseResponse,
} from "./case.types";

export async function getActiveCases(contactId: string) {
  const params = new URLSearchParams({ contactId });
  return apiRequest<ActiveCase[]>(`GetActiveCases?${params.toString()}`, {
    method: "GET",
  });
}

export async function getAllCases(contactId: string) {
  const params = new URLSearchParams({ contactId });
  return apiRequest<ActiveCase[]>(`GetAllCases?${params.toString()}`, {
    method: "GET",
  });
}

export async function createCase(payload: FormData) {
  return apiFormRequest<CreateCaseResponse>("CreateCase", {
    method: "POST",
    body: payload,
  });
}

export async function getCaseDetailByID(caseId: string) {
  return apiRequest<CaseDetail>(`GetCaseDetail/${encodeURIComponent(caseId)}`, {
    method: "GET",
  });
}
