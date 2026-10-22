import { apiRequest, apiFormRequest } from "../index";
import type {
  CaseChangeRequestInfo,
  CreateChangeRequestResponse,
} from "./changeRequest.types";

export async function createChangeRequest(payload: FormData) {
  return apiFormRequest<CreateChangeRequestResponse>("CreateChangeRequest", {
    method: "POST",
    body: payload,
  });
}

export async function getCaseChangeRequestInfo(contactId: string) {
  const params = new URLSearchParams({ contactId });
  return apiRequest<CaseChangeRequestInfo[]>(
    `GetCaseChangeRequestInfo?${params.toString()}`,
    { method: "GET" }
  );
}
