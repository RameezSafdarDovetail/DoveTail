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

export interface PortalComment {
  Id?: string | null;
  Title?: string | null;
  Description?: string | null;
  CreatedOn?: string | null;
  Subject?: string | null;
  CommentSubject?: string | null;
  CommentDetail?: string | null;
  Detail?: string | null;
}

export interface PortalCommentsPage {
  Page: number;
  PageSize: number;
  TotalRecords: number;
  TotalPages: number;
  HasMore: boolean;
  Data: PortalComment[] | null;
}
