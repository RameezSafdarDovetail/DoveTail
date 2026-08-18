import type { ActiveCase } from "./case.types";
import { formatAvgAge, parseCaseAgeMinutes } from "./case.utils";
import { mapPriority, mapSla, mapStatus } from "./case.mappers";

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
