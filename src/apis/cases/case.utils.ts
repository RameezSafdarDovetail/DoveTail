import type { ActiveCase } from "./case.types";

export function matchesCaseSearch(
  item: ActiveCase,
  term: string,
  by?: string | null
) {
  const query = term.trim().toLowerCase();
  if (!query) return true;

  const title = (item.Title ?? "").toLowerCase();
  const caseNumber = item.CaseNumber.toLowerCase();
  const customerReference = (item.CustomerReference ?? "").toLowerCase();

  if (by === "Case Number") return caseNumber.includes(query);
  if (by === "Client Reference Number")
    return customerReference.includes(query);
  if (by === "Keywords") return title.includes(query);

  return (
    caseNumber.includes(query) ||
    title.includes(query) ||
    customerReference.includes(query)
  );
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

export function formatCaseDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Matches statuses like "84 Problem Solved". */
export function isProblemSolvedStatus(status: string) {
  return status.trim().toLowerCase().includes("problem solved");
}

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses a `date` input value (`YYYY-MM-DD`) as a local calendar-day bound.
 * Start = local 00:00:00.000, End = local 23:59:59.999.
 */
export function parseLocalDateBound(
  value: string,
  bound: "start" | "end"
): Date | null {
  const trimmed = value.trim();
  if (!LOCAL_DATE_PATTERN.test(trimmed)) return null;
  const [year, month, day] = trimmed.split("-").map(Number);
  if (!year || !month || !day) return null;
  if (bound === "start") return new Date(year, month - 1, day, 0, 0, 0, 0);
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

export function isInvalidCreatedOnRange(startLocal: string, endLocal: string) {
  const start = parseLocalDateBound(startLocal, "start");
  const end = parseLocalDateBound(endLocal, "start");
  if (!start || !end) return false;
  return end.getTime() < start.getTime();
}

/**
 * Filters by CreatedOn (UTC ISO) against local date-only start/end values.
 * - start only: CreatedOn >= start of that local day
 * - end only: CreatedOn <= end of that local day
 * - both: inclusive local-day range
 * - invalid range (end < start): no matches
 */
export function matchesCreatedOnRange(
  createdOn: string,
  startLocal: string,
  endLocal: string
) {
  if (!startLocal.trim() && !endLocal.trim()) return true;

  if (isInvalidCreatedOnRange(startLocal, endLocal)) return false;

  const created = new Date(createdOn);
  if (Number.isNaN(created.getTime())) return false;

  const start = parseLocalDateBound(startLocal, "start");
  const end = parseLocalDateBound(endLocal, "end");

  if (start && created.getTime() < start.getTime()) return false;
  if (end && created.getTime() > end.getTime()) return false;
  return true;
}
