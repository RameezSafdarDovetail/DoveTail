import { apiRequest } from "./index";
import type {
  SlaTone,
  CaseStatus,
  CasePriority,
  HomeStatusTone,
} from "../data/cases";

export interface ActiveCase {
  Id: string;
  Title: string | null;
  CaseNumber: string;
  CreatedOn: string;
  Status: string;
  CaseAge: string;
  Sla: string;
  Priority: string;
}

export function mapPriority(priority: string): CasePriority {
  const value = priority.toLowerCase();
  if (value.includes("p1") || value.includes("high")) return "p1";
  if (
    value.includes("p2") ||
    value.includes("normal") ||
    value.includes("medium")
  )
    return "p2";
  return "p3";
}

export function mapPriorityLabel(priority: CasePriority) {
  if (priority === "p1") return "! P1";
  if (priority === "p2") return "! P2";
  return "✓ P3";
}

export function mapStatus(status: string): {
  label: string;
  tone: HomeStatusTone;
} {
  const value = status.toLowerCase();
  if (value.includes("progress")) {
    return { label: "In Progress", tone: "progress" };
  }
  return { label: "Open", tone: "open" };
}

export function mapSla(sla: string): SlaTone {
  const value = sla.toLowerCase();
  if (value.includes("overdue")) return "risk";
  if (value.includes("left")) {
    if (
      value.startsWith("0d") ||
      value.includes("h left") ||
      value.includes("m left")
    )
      return "watch";
  }
  return "ok";
}

/** Parse CaseAge like "19d 22h 58m" / "4h 51m" / "1h 5m" into minutes. */
export function parseCaseAgeMinutes(caseAge: string): number {
  const days = Number(/(\d+)\s*d/i.exec(caseAge)?.[1] ?? 0);
  const hours = Number(/(\d+)\s*h/i.exec(caseAge)?.[1] ?? 0);
  const minutes = Number(/(\d+)\s*m/i.exec(caseAge)?.[1] ?? 0);
  return days * 24 * 60 + hours * 60 + minutes;
}

export function formatAvgAge(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "—";
  const days = minutes / (24 * 60);
  if (days >= 1) return `${days.toFixed(1)}d`;
  const hours = minutes / 60;
  if (hours >= 1) return `${hours.toFixed(1)}h`;
  return `${Math.round(minutes)}m`;
}

export function buildDashboardStats(cases: ActiveCase[]) {
  const openCount = cases.length;
  const p1Cases = cases.filter((item) => mapPriority(item.Priority) === "p1");
  const p2Count = cases.filter(
    (item) => mapPriority(item.Priority) === "p2"
  ).length;
  const p3Count = cases.filter(
    (item) => mapPriority(item.Priority) === "p3"
  ).length;

  const atRiskCases = cases.filter(
    (item) => mapSla(item.Sla) === "risk" || mapSla(item.Sla) === "watch"
  );
  const overdueCount = cases.filter(
    (item) => mapSla(item.Sla) === "risk"
  ).length;
  const p1AtRisk = p1Cases.filter(
    (item) => mapSla(item.Sla) === "risk" || mapSla(item.Sla) === "watch"
  );
  const p1AtRiskDelta =
    p1AtRisk.length > 0
      ? `P1: ${p1AtRisk[0].Sla}`
      : overdueCount > 0
      ? `${overdueCount} overdue`
      : "None at risk";

  const ages = cases
    .map((item) => parseCaseAgeMinutes(item.CaseAge))
    .filter((value) => value > 0);
  const avgMinutes = ages.length
    ? ages.reduce((sum, value) => sum + value, 0) / ages.length
    : 0;

  const inProgressCount = cases.filter(
    (item) => mapStatus(item.Status).tone === "progress"
  ).length;

  return [
    {
      label: "Open Cases",
      value: String(openCount),
      delta: `${p1Cases.length} P1 · ${p2Count} P2 · ${p3Count} P3`,
      tone: "neutral" as const,
      to: "/open?priority=all",
      ariaLabel: "Open the Open Cases page",
    },
    {
      label: "SLA At Risk",
      value: String(atRiskCases.length),
      delta: p1AtRiskDelta,
      tone: atRiskCases.length > 0 ? ("down" as const) : ("up" as const),
      to: "/open?priority=p1",
      ariaLabel: "Open P1 cases at SLA risk",
    },
    {
      label: "Avg Case Age",
      value: formatAvgAge(avgMinutes),
      delta: "Across active cases",
      tone: "up" as const,
      to: "/open?priority=all",
      ariaLabel: "Open cases to review average case age",
    },
    {
      label: "In Progress",
      value: String(inProgressCount),
      delta: `${openCount - inProgressCount} open / created`,
      tone: "up" as const,
      to: "/open?priority=all",
      ariaLabel: "Open cases currently in progress",
    },
  ];
}

export async function getActiveCases(contactId: string) {
  const params = new URLSearchParams({ contactId });
  return apiRequest<ActiveCase[]>(`GetActiveCases?${params.toString()}`, {
    method: "GET",
  });
}

export async function getAllCases(contactId: string) {
  const params = new URLSearchParams({ contactId });
  return apiRequest<ActiveCase[]>(`GetAllCases?${params.toString()}`, {
    method: "GET",
  });
}

export interface QuoteItem {
  Id: string;
  QuoteNumber: string;
  Title: string | null;
  Status: string;
  CreatedOn: string;
  Subject: string | null;
  Product: string | null;
}

export async function getQuotes(contactId: string) {
  const params = new URLSearchParams({ contactId });
  console.log(`GetQuotes?${params.toString()}`);
  return apiRequest<QuoteItem[]>(`GetQuotes?${params.toString()}`, {
    method: "GET",
  });
}

export function mapQuoteStatusTone(
  status: string
): "pending" | "awaiting" | "approved" | "closed" | "open" {
  const value = status.toLowerCase();
  if (value.includes("approved") || value.includes("accepted"))
    return "approved";
  if (
    value.includes("await") ||
    value.includes("sent") ||
    value.includes("review")
  )
    return "awaiting";
  if (
    value.includes("closed") ||
    value.includes("declined") ||
    value.includes("expired")
  )
    return "closed";
  if (
    value.includes("progress") ||
    value.includes("pending") ||
    value.includes("draft")
  )
    return "pending";
  return "open";
}

export function mapCatalogStatus(status: string): CaseStatus {
  const value = status.toLowerCase();
  if (
    value.includes("solved") ||
    value.includes("closed") ||
    value.includes("resolved") ||
    value.includes("cancelled") ||
    value.includes("canceled")
  ) {
    return "closed";
  }
  if (
    value.includes("quote") ||
    value.includes("pending") ||
    value.includes("waiting") ||
    value.includes("on hold")
  ) {
    return "pending";
  }
  return "open";
}

export function mapCatalogStatusLabel(status: string) {
  return status.replace(/^\d+\s*/, "").trim() || status;
}

export function formatCaseDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function mapPriorityType(priority: string) {
  const value = mapPriority(priority);
  if (value === "p1") return "P1";
  if (value === "p2") return "P2";
  return "P3";
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

export async function createCase(payload: CreateCasePayload) {
  return apiRequest<CreateCaseResponse>("CreateCase", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ActiveAccount {
  Id: string;
  Name: string;
}

export async function getActiveAccounts() {
  return apiRequest<ActiveAccount[]>("GetActiveAccounts", { method: "GET" });
}

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

export async function createChangeRequest(payload: CreateChangeRequestPayload) {
  return apiRequest<CreateChangeRequestResponse>("CreateChangeRequest", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface CaseChangeRequestInfo {
  CaseId: string;
  CaseNumber: string;
  ChangeRequestNumberPreview: string;
  LinkedCaseDetails: string;
  Account: string;
  RequesterEmail: string;
}

export async function getCaseChangeRequestInfo() {
  return apiRequest<CaseChangeRequestInfo[]>("GetCaseChangeRequestInfo", {
    method: "GET",
  });
}
