import {
  formatCaseDate,
  mapPriorityType,
  mapCatalogStatus,
  matchesCaseSearch,
  mapCatalogStatusLabel,
  matchesCreatedOnRange,
} from "../../apis/cases";
import { useMemo, useState } from "react";
import { tableCols, ui } from "../../libs/ui";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { cn, pluralize } from "../../libs/utils";
import { useSearchParams } from "react-router-dom";
import { Pill } from "../../components/badges/Pill";
import { Badge } from "../../components/badges/Badge";
import { Button } from "../../components/buttons/Button";
import { useCasesQuery } from "../../hooks/useCasesQuery";
import { TabPill } from "../../components/buttons/TabPill";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchInput } from "../../components/layout/SearchInput";
import { TableCard, TableRow } from "../../components/tables/TableCard";
import { DateRangeFilter } from "../../components/layout/DateRangeFilter";

type CaseStatus = "open" | "pending" | "closed";

const tabs: Array<{ id: CaseStatus | "all"; label: string }> = [
  { id: "all", label: "All My Cases" },
  { id: "open", label: "Open" },
  { id: "pending", label: "Pending" },
  { id: "closed", label: "Closed" },
];

export function AllCasesPage() {
  const { user } = useAuth();
  const { openCaseDetail } = useModal();
  const contactId = user?.ContactId ?? "";
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") as CaseStatus | "all" | null) ?? "all";
  const query = params.get("q") ?? "";
  const searchBy = params.get("by");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const { data: cases = [], isLoading, isError, error } = useCasesQuery();

  const missingContactId = !contactId;
  const loading = !missingContactId && isLoading;
  const errorMessage = missingContactId
    ? "Missing contact id. Please sign in again."
    : isError
    ? error instanceof Error
      ? error.message
      : "Failed to load cases"
    : "";

  const visible = useMemo(() => {
    return cases.filter((item) => {
      const catalogStatus = mapCatalogStatus(item.Status);
      const matchesStatus = status === "all" || catalogStatus === status;
      return (
        matchesStatus &&
        matchesCaseSearch(item, query, searchBy) &&
        matchesCreatedOnRange(item.CreatedOn, startDateTime, endDateTime)
      );
    });
  }, [cases, query, searchBy, status, startDateTime, endDateTime]);

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
            </>
          }
        />

        <div className={ui.controlsBar}>
          <SearchInput
            value={query}
            onChange={(value) => updateParam("q", value)}
            placeholder="Search all cases…"
          />
          <DateRangeFilter
            start={startDateTime}
            end={endDateTime}
            onStartChange={setStartDateTime}
            onEndChange={setEndDateTime}
            onClear={() => {
              setStartDateTime("");
              setEndDateTime("");
            }}
            disabled={loading}
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
          {errorMessage ? (
            <div className="px-5 py-4 text-[12.5px] text-red">
              {errorMessage}
            </div>
          ) : null}
          {!loading && !errorMessage && visible.length === 0 ? (
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
                onClick={() => openCaseDetail(item.Id)}
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
