export interface CreateChangeRequestPayload {
  LinkedCaseNumber: string;
  ChangeTitle: string;
  Details: string;
  ImpactedAreas: string;
  SupportingDocumentOptionValues: number[];
  CurrentProcess: string;
  Justification: string;
}

export interface CreateChangeRequestResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface CaseChangeRequestInfo {
  CaseId: string;
  CaseNumber: string;
  ChangeRequestNumberPreview: string;
  LinkedCaseDetails: string;
  Account: string;
  RequesterEmail: string;
  CreatedOn: string;
}
