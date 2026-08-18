import { apiRequest, apiFormRequest } from "../index";
import type {
  QuoteItem,
  AcceptQuoteResponse,
  RejectQuotePayload,
  RejectQuoteResponse,
} from "./quote.types";

export async function getQuotes(contactId: string) {
  const params = new URLSearchParams({ contactId });
  console.log(`GetQuotes?${params.toString()}`);
  return apiRequest<QuoteItem[]>(`GetQuotes?${params.toString()}`, {
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
