export interface UpdateCaseCommentPayload {
  CaseId: string;
  UserEmail: string;
  CommentSubject: string;
  CommentDetail: string;
}

export interface UpdateCaseCommentResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}
