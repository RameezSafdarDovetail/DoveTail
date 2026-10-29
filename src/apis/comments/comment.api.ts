import { apiFormRequest, apiRequest } from "../index";
import type {
  PortalCommentsPage,
  UpdateCaseCommentResponse,
} from "./comment.types";

const DEFAULT_PAGE_SIZE = 10;

export async function updateCaseComment(payload: FormData) {
  return apiFormRequest<UpdateCaseCommentResponse>("UpdateCaseComment", {
    method: "POST",
    body: payload,
  });
}

export async function getPortalComments(
  caseId: string,
  contactId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) {
  const params = new URLSearchParams({
    caseId,
    contactId,
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest<PortalCommentsPage>(
    `GetPortalComments?${params.toString()}`,
    { method: "GET" }
  );
}
