import {
  getAllCases,
  formatCaseDate,
  mapPriorityType,
  type ActiveCase,
  mapCatalogStatusLabel,
} from "../../apis/getActiveCases";
import { tableCols, ui } from "../../libs/ui";
import { useAuth } from "../../hooks/useAuth";
import { cn, pluralize } from "../../libs/utils";
import { Pill } from "../../components/badges/Pill";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../../components/badges/Badge";
import { Button } from "../../components/buttons/Button";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { FilterPill } from "../../components/buttons/FilterPill";
import { SearchInput } from "../../components/layout/SearchInput";
import { TableCard, TableRow } from "../../components/tables/TableCard";

function isProblemSolved(status: string) {
  return status.toLowerCase().includes("problem solved");
}

export function ClosedCasesPage() {
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const [cases, setCases] = useState<ActiveCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCases() {
      if (!contactId) {
        setCases([]);
        setError("Missing contact id. Please sign in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await getAllCases(contactId);
        if (!cancelled)
          setCases(data.filter((item) => isProblemSolved(item.Status)));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load closed cases"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCases();
    return () => {
      cancelled = true;
    };
  }, [contactId]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return cases.filter((item) => {
      if (!term) return true;
      const title = item.Title ?? "";
      const type = mapPriorityType(item.Priority);
      const resolution = mapCatalogStatusLabel(item.Status);
      return (
        item.CaseNumber.toLowerCase().includes(term) ||
        title.toLowerCase().includes(term) ||
        type.toLowerCase().includes(term) ||
        item.Priority.toLowerCase().includes(term) ||
        resolution.toLowerCase().includes(term)
      );
    });
  }, [cases, query]);

  return (
    <div className={ui.view}>
      <PageBody>
        <PageHeader
          title="Closed Cases"
          subtitle="Previously resolved support requests"
          actions={
            <Button
              variant="secondary"
              disabled={loading || visible.length === 0}
              onClick={() =>
                exportPortalReport("Dovetail-Closed-Cases", {
                  title: "Closed Cases",
                  headers: [
                    "Case #",
                    "Title",
                    "Type",
                    "Subject",
                    "Resolution",
                    "Closed",
                  ],
                  rows: visible.map((item) => [
                    item.CaseNumber,
                    item.Title || "Untitled case",
                    mapPriorityType(item.Priority),
                    item.Priority,
                    mapCatalogStatusLabel(item.Status),
                    formatCaseDate(item.CreatedOn),
                  ]),
                })
              }
            >
              ↓ Export Excel
            </Button>
          }
        />

        <div className={ui.controlsBar}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search closed cases…"
          />
          <FilterPill
            active={scope === "mine"}
            showDot
            onClick={() => setScope("mine")}
          >
            My Closed Cases <span>▾</span>
          </FilterPill>
          <FilterPill active={scope === "all"} onClick={() => setScope("all")}>
            All Closed
          </FilterPill>
          <span className={ui.controlsMeta}>
            {loading ? "Loading…" : pluralize(visible.length, "case")}
          </span>
        </div>

        <TableCard
          columnsClassName={tableCols.closed}
          headers={[
            "Case #",
            "Title",
            "Type",
            "Subject",
            "Resolution",
            "Closed",
          ]}
        >
          {loading ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              Loading closed cases…
            </div>
          ) : null}
          {error ? (
            <div className="px-5 py-4 text-[12.5px] text-red">{error}</div>
          ) : null}
          {!loading && !error && visible.length === 0 ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              No closed cases found.
            </div>
          ) : null}
          {visible.map((item) => {
            const title = item.Title || "Untitled case";
            const type = mapPriorityType(item.Priority);
            const resolution = mapCatalogStatusLabel(item.Status);

            return (
              <TableRow key={item.Id} columnsClassName={tableCols.closed} muted>
                <span
                  className={cn(ui.caseNumDim, "min-w-0 truncate")}
                  title={item.CaseNumber}
                >
                  {item.CaseNumber}
                </span>
                <div className="min-w-0">
                  <div className={cn(ui.caseTitle, "truncate")} title={title}>
                    {title}
                  </div>
                  <div
                    className={cn(ui.caseSub, "truncate")}
                    title={item.Priority}
                  >
                    Re: {item.Priority}
                  </div>
                </div>
                <div className="min-w-0">
                  <Pill>{type}</Pill>
                </div>
                <span
                  className="min-w-0 truncate text-[12.5px] text-text-3"
                  title={item.Priority}
                >
                  {item.Priority}
                </span>
                <div className="min-w-0 overflow-hidden">
                  <Badge tone="resolved">{resolution}</Badge>
                </div>
                <span className="whitespace-nowrap text-xs text-text-3">
                  {formatCaseDate(item.CreatedOn)}
                </span>
              </TableRow>
            );
          })}
        </TableCard>
      </PageBody>
    </div>
  );
}
