import {
  getClosedCases,
  formatCaseDate,
  mapPriorityType,
  mapCatalogStatusLabel,
  matchesCreatedOnRange,
} from "../../apis/cases";
import { useMemo, useState } from "react";
import { tableCols, ui } from "../../libs/ui";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { cn, pluralize } from "../../libs/utils";
import { useQuery } from "@tanstack/react-query";
import { Pill } from "../../components/badges/Pill";
import { Badge } from "../../components/badges/Badge";
import { Button } from "../../components/buttons/Button";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { FilterPill } from "../../components/buttons/FilterPill";
import { SearchInput } from "../../components/layout/SearchInput";
import { TableCard, TableRow } from "../../components/tables/TableCard";
import { DateRangeFilter } from "../../components/layout/DateRangeFilter";

const PAGE_SIZE = 1000;

export function ClosedCasesPage() {
  const { user } = useAuth();
  const { openCaseDetail } = useModal();
  const contactId = user?.ContactId ?? "";
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["closed-cases", contactId, page, PAGE_SIZE],
    queryFn: () => getClosedCases(contactId, page, PAGE_SIZE),
    enabled: Boolean(contactId),
  });

  const missingContactId = !contactId;
  const loading = !missingContactId && (isLoading || isFetching);
  const errorMessage = missingContactId
    ? "Missing contact id. Please sign in again."
    : isError
    ? error instanceof Error
      ? error.message
      : "Failed to load closed cases"
    : "";

  const pageCases = loading ? [] : data?.Data ?? [];
  const totalPages = data?.TotalPages ?? 0;
  const hasMore = data?.HasMore ?? false;
  const currentPage = data?.Page ?? page;
  const totalRecords = data?.TotalRecords ?? 0;

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return pageCases.filter((item) => {
      if (!matchesCreatedOnRange(item.CreatedOn, startDateTime, endDateTime)) {
        return false;
      }
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
  }, [pageCases, query, startDateTime, endDateTime]);

  const canGoPrevious = currentPage > 1 && !loading;
  const canGoNext =
    !loading && hasMore && (totalPages === 0 || currentPage < totalPages);

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
            {loading
              ? "Loading…"
              : totalRecords > 0
              ? `${pluralize(
                  visible.length,
                  "case"
                )} on this page · ${totalRecords} total`
              : pluralize(visible.length, "case")}
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
          {errorMessage ? (
            <div className="px-5 py-4 text-[12.5px] text-red">
              {errorMessage}
            </div>
          ) : null}
          {!loading && !errorMessage && visible.length === 0 ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              No closed cases found.
            </div>
          ) : null}
          {!loading &&
            visible.map((item) => {
              const title = item.Title || "Untitled case";
              const type = mapPriorityType(item.Priority);
              const resolution = mapCatalogStatusLabel(item.Status);

              return (
                <TableRow
                  key={item.Id}
                  columnsClassName={tableCols.closed}
                  muted
                  onClick={() => openCaseDetail(item.Id)}
                >
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

        <div
          className={cn(
            ui.glass,
            "mt-3 flex flex-wrap items-center justify-between gap-3 rounded-default px-5 py-3"
          )}
        >
          <span className="text-[12.5px] text-text-3">
            {totalRecords > 0
              ? `Page ${currentPage} of ${
                  totalPages || "—"
                } · ${totalRecords} total`
              : "No pages"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              compact
              disabled={!canGoPrevious}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              compact
              disabled={!canGoNext}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </PageBody>
    </div>
  );
}
