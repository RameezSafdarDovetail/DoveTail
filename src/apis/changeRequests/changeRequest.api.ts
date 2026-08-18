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

export async function getCaseChangeRequestInfo() {
  return apiRequest<CaseChangeRequestInfo[]>("GetCaseChangeRequestInfo", {
    method: "GET",
  });
}
