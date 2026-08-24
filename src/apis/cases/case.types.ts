export interface ActiveCase {
  Id: string;
  Title: string | null;
  CaseNumber: string;
  CreatedOn: string;
  Status: string;
  CaseAge: string;
  Sla: string;
  Priority: string;
  CustomerReference?: string | null;
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
