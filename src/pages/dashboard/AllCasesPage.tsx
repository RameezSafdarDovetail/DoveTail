import {
  getAllCases,
  formatCaseDate,
  mapPriorityType,
  mapCatalogStatus,
  type ActiveCase,
  matchesCaseSearch,
  mapCatalogStatusLabel,
} from "../../apis/getActiveCases";
import { useAuth } from "../../hooks/useAuth";
import { tableCols, ui } from "../../libs/ui";
import { useModal } from "../../hooks/useModal";
import { cn, pluralize } from "../../libs/utils";
import { useSearchParams } from "react-router-dom";
import { Pill } from "../../components/badges/Pill";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../../components/badges/Badge";
import { Button } from "../../components/buttons/Button";
import { TabPill } from "../../components/buttons/TabPill";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchInput } from "../../components/layout/SearchInput";
import { TableCard, TableRow } from "../../components/tables/TableCard";

type CaseStatus = "open" | "pending" | "closed";

const tabs: Array<{ id: CaseStatus | "all"; label: string }> = [
  { id: "all", label: "All My Cases" },
  { id: "open", label: "Open" },
  { id: "pending", label: "Pending" },
  { id: "closed", label: "Closed" },
];

export function AllCasesPage() {
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";
  const { openLogCase } = useModal();
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") as CaseStatus | "all" | null) ?? "all";
  const query = params.get("q") ?? "";
  const searchBy = params.get("by");
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
        if (!cancelled) setCases(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load cases");
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
    return cases.filter((item) => {
      const catalogStatus = mapCatalogStatus(item.Status);
      const matchesStatus = status === "all" || catalogStatus === status;
      return matchesStatus && matchesCaseSearch(item, query, searchBy);
    });
  }, [cases, query, searchBy, status]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  return (
    <div className={ui.view}>
      <PageBody>
        <PageHeader
          title="All My Cases"
          subtitle="Every case across all statuses"
          actions={
            <>
              <Button
                variant="secondary"
                disabled={loading || visible.length === 0}
                onClick={() =>
                  exportPortalReport("Dovetail-All-Cases", {
                    title: "All My Cases",
                    headers: [
                      "Case #",
                      "Title",
                      "Type",
                      "Subject",
                      "Status",
                      "Date",
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
              <Button variant="primary" onClick={openLogCase}>
                + New Case
              </Button>
            </>
          }
        />

        <div className={ui.controlsBar}>
          <SearchInput
            value={query}
            onChange={(value) => updateParam("q", value)}
            placeholder="Search all cases…"
          />
          {tabs.map((tab) => (
            <TabPill
              key={tab.id}
              active={status === tab.id}
              onClick={() => updateParam("status", tab.id)}
            >
              {tab.label}
            </TabPill>
          ))}
          <span className={ui.controlsMeta}>
            {loading ? "Loading…" : pluralize(visible.length, "case")}
          </span>
        </div>

        <TableCard
          columnsClassName={tableCols.casesAll}
          headers={["Case #", "Title", "Type", "Subject", "Status", "Date"]}
        >
          {loading ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              Loading cases…
            </div>
          ) : null}
          {error ? (
            <div className="px-5 py-4 text-[12.5px] text-red">{error}</div>
          ) : null}
          {!loading && !error && visible.length === 0 ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              No cases found.
            </div>
          ) : null}
          {visible.map((item) => {
            const catalogStatus = mapCatalogStatus(item.Status);
            const muted = catalogStatus === "closed";
            const title = item.Title || "Untitled case";
            const type = mapPriorityType(item.Priority);
            const statusLabel = mapCatalogStatusLabel(item.Status);

            return (
              <TableRow
                key={item.Id}
                columnsClassName={tableCols.casesAll}
                muted={muted}
              >
                <span
                  className={cn(
                    "min-w-0 truncate",
                    muted ? ui.caseNumDim : ui.caseNum
                  )}
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
                  className={cn(
                    "min-w-0 truncate text-[12.5px]",
                    muted ? "text-text-3" : "text-text-2"
                  )}
                  title={item.Priority}
                >
                  {item.Priority}
                </span>
                <div className="min-w-0 overflow-hidden">
                  <Badge
                    tone={
                      catalogStatus === "open"
                        ? "open"
                        : catalogStatus === "pending"
                        ? "pending"
                        : "closed"
                    }
                    withDot
                  >
                    {statusLabel}
                  </Badge>
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
