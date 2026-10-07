import { apiRequest } from "../index";
import type { ActiveAccount, CustomerProduct } from "./account.types";

export async function getActiveAccounts(contactId: string) {
  const data = await apiRequest<ActiveAccount | ActiveAccount[]>(
    `GetActiveAccounts/${encodeURIComponent(contactId)}`,
    { method: "GET" }
  );
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function getCustomerProduct(contactId: string) {
  const params = new URLSearchParams({ contactId });
  const data = await apiRequest<CustomerProduct | CustomerProduct[]>(
    `GetCustomerProduct?${params.toString()}`,
    { method: "GET" }
  );
  return Array.isArray(data) ? data : data ? [data] : [];
}
