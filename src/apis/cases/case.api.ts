import { apiRequest, apiFormRequest } from "../index";
import type {
  ActiveCase,
  CaseDetail,
  CreateCaseResponse,
  EscalateCasePayload,
  EscalateCaseResponse,
  EscalationDetails,
} from "./case.types";

function normalizeActiveCases(data: unknown): ActiveCase[] {
  if (Array.isArray(data)) return data;

  // Some backends return a JSON string instead of a parsed array.
  if (typeof data === "string") {
    try {
      const parsed: unknown = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["value", "data", "cases", "Cases", "result", "Result"]) {
      if (Array.isArray(record[key])) return record[key] as ActiveCase[];
    }
    console.error("GetActiveCases returned unexpected object:", data);
  }
  return [];
}

export async function getActiveCases(contactId: string) {
  const params = new URLSearchParams({ contactId });
  const data = await apiRequest<unknown>(
    `GetActiveCases?${params.toString()}`,
    { method: "GET" }
  );
  return normalizeActiveCases(data);
}

export async function getAllCases(contactId: string) {
  const params = new URLSearchParams({ contactId });
  const data = await apiRequest<unknown>(`GetAllCases?${params.toString()}`, {
    method: "GET",
  });
  return normalizeActiveCases(data);
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
