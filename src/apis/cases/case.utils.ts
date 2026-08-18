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
