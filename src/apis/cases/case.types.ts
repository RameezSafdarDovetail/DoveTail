export interface ActiveCase {
  Id: string;
  Title: string | null;
  CaseNumber: string;
  CreatedOn: string;
  Status: string;
  CaseAge: string | null;
  Sla: string;
  Priority: string;
  CustomerReference?: string | null;
  AccountId?: string | null;
  IsEscalated?: boolean;
}

export interface CasesPageResponse {
  Page: number;
  PageSize: number;
  TotalRecords: number;
  TotalPages: number;
  HasMore: boolean;
  Data: ActiveCase[];
}

export interface EscalateCasePayload {
  CaseId: string;
  Reason: string;
  EscalatedByContactId: string;
}

export interface EscalateCaseResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface EscalationDetails {
  CaseId: string;
  IsEscalated: boolean;
  CaseNumber: string;
  CaseTitle: string | null;
  Priority: string;
  CaseStatus: string;
  EscalationReason: string;
  EscalationStatus: string;
  EscalatedBy: string;
  EscalatedOn: string;
}

export interface CreateCasePayload {
  Subject: string;
  Details: string;
  AccountId: string;
  Product: string;
  CategoryOptionValue: number;
  SubCategory: string;
  PersonResponsible: string;
  ClientReference: string;
}

export interface CreateCaseResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface CaseDetailEntity {
  Id: string;
  LogicalName?: string;
  Name: string | null;
  Email?: string | null;
}

export interface CaseDetailAttachment {
  FileName: string | null;
  DocumentBody: string | null;
}

export interface CaseDetail {
  CaseId: string;
  Title: string | null;
  Description: string | null;
  CustomerReference: string | null;
  PriorityCode: number | null;
  CategoryCode: number | null;
  PersonResponsible: string | null;
  Account: CaseDetailEntity | null;
  Contact: CaseDetailEntity | null;
  Product: CaseDetailEntity | null;
  SubCategory: CaseDetailEntity | null;
  Attachments: CaseDetailAttachment[] | null;
}
