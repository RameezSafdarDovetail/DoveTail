import type {
  SlaTone,
  CaseStatus,
  CasePriority,
  HomeStatusTone,
} from "../../data/cases";
import { categoryOptionValues } from "../../data/cases";

const categoryCodeLabels = Object.fromEntries(
  Object.entries(categoryOptionValues).map(([label, value]) => [value, label])
) as Record<number, string>;

const priorityCodeLabels: Record<number, string> = {
  1: "P1 High Priority Call",
  2: "P2 Normal Priority Call",
  3: "P3 Low Priority Call",
};

export function mapCategoryCodeLabel(code: number | null | undefined) {
  if (code == null) return "—";
  return categoryCodeLabels[code] ?? String(code);
}

export function mapPriorityCodeLabel(code: number | null | undefined) {
  if (code == null) return "—";
  return priorityCodeLabels[code] ?? String(code);
}

export function mapPriority(priority: string | null | undefined): CasePriority {
  const value = (priority ?? "").toLowerCase();
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

export function mapStatus(status: string | null | undefined): {
  label: string;
  tone: HomeStatusTone;
} {
  const value = (status ?? "").toLowerCase();
  if (value.includes("progress")) {
    return { label: "In Progress", tone: "progress" };
  }
  return { label: "Open", tone: "open" };
}

export function mapSla(sla: string | null | undefined): SlaTone {
  const value = (sla ?? "").toLowerCase();
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

export function mapPriorityType(priority: string) {
  const value = mapPriority(priority);
  if (value === "p1") return "P1";
  if (value === "p2") return "P2";
  return "P3";
}
