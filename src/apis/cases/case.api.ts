import { apiRequest, apiFormRequest } from "../index";
import type {
  CaseDetail,
  CasesPageResponse,
  EscalationDetails,
  CreateCaseResponse,
  EscalateCasePayload,
  EscalateCaseResponse,
} from "./case.types";

const DEFAULT_PAGE_SIZE = 1000;

export async function getActiveCases(
  contactId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) {
  const params = new URLSearchParams({
    contactId,
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest<CasesPageResponse>(`GetActiveCases?${params.toString()}`, {
    method: "GET",
  });
}

export async function getAllCases(
  contactId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) {
  const params = new URLSearchParams({
    contactId,
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest<CasesPageResponse>(`GetAllCases?${params.toString()}`, {
    method: "GET",
  });
}

export async function getClosedCases(
  contactId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) {
  const params = new URLSearchParams({
    contactId,
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest<CasesPageResponse>(`GetClosedCases?${params.toString()}`, {
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

export async function getEscalationDetails(caseId: string) {
  const params = new URLSearchParams({ caseId });
  return apiRequest<EscalationDetails>(
    `GetEscalationDetails?${params.toString()}`,
    {
      method: "GET",
    }
  );
}

export async function escalateCase(payload: EscalateCasePayload) {
  return apiRequest<EscalateCaseResponse>("EscalateCase", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
