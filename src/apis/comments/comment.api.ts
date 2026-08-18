import { apiFormRequest } from "../index";
import type { UpdateCaseCommentResponse } from "./comment.types";

export async function updateCaseComment(payload: FormData) {
  return apiFormRequest<UpdateCaseCommentResponse>("UpdateCaseComment", {
    method: "POST",
    body: payload,
  });
}
