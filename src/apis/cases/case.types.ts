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
