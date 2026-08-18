import type {
  SlaTone,
  CaseStatus,
  CasePriority,
  HomeStatusTone,
} from "../../data/cases";

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
