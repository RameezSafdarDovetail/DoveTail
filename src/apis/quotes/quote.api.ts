import { apiRequest, apiFormRequest } from "../index";
import type {
  QuotesPageResponse,
  AcceptQuoteResponse,
  RejectQuotePayload,
  RejectQuoteResponse,
} from "./quote.types";

const DEFAULT_PAGE_SIZE = 1000;

export async function getQuotes(
  contactId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
) {
  const params = new URLSearchParams({
    contactId,
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest<QuotesPageResponse>(`GetQuotes?${params.toString()}`, {
    method: "GET",
  });
}

export async function acceptQuote(payload: FormData) {
  return apiFormRequest<AcceptQuoteResponse>("AcceptQuote", {
    method: "POST",
    body: payload,
  });
}

export async function rejectQuote(payload: RejectQuotePayload) {
  return apiRequest<RejectQuoteResponse>("RejectQuote", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
