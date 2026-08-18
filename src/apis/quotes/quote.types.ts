export interface QuoteItem {
  Id: string;
  QuoteNumber: string;
  Title: string | null;
  Status: string;
  CreatedOn: string;
  Subject: string | null;
  Product: string | null;
}

export interface AcceptQuoteResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export interface RejectQuotePayload {
  QuoteId: string;
  RejectionReasonOptionValue: number;
  RejectionComments: string;
}

export interface RejectQuoteResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}
