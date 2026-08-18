import { apiRequest } from "../index";
import type { ActiveAccount } from "./account.types";

export async function getActiveAccounts() {
  return apiRequest<ActiveAccount[]>("GetActiveAccounts", { method: "GET" });
}
