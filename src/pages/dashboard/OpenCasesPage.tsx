import {
  mapSla,
  mapPriority,
  getActiveCases,
  type ActiveCase,
  mapCatalogStatus,
  mapPriorityLabel,
  matchesCaseSearch,
  mapCatalogStatusLabel,
  matchesCreatedOnRange,
} from "../../apis/cases";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { tableCols, ui } from "../../libs/ui";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { cn, pluralize } from "../../libs/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../../components/badges/Badge";
import { Button } from "../../components/buttons/Button";
import { SlaChip } from "../../components/badges/SlaChip";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchInput } from "../../components/layout/SearchInput";
import { PriorityBadge } from "../../components/badges/PriorityBadge";
import { TableCard, TableRow } from "../../components/tables/TableCard";
import { PriorityFilter } from "../../components/buttons/PriorityFilter";
import { DateRangeFilter } from "../../components/layout/DateRangeFilter";
import { EscalateCaseModal } from "../../components/popups/EscalateCaseModal";
import { EscalateDetailsModal } from "../../components/popups/EscalateDetailsModal";

type CasePriority = "p1" | "p2" | "p3";

const PAGE_SIZE = 1000;

const priorities: Array<{
  id: CasePriority | "all";
  label: string;
}> = [
  { id: "all", label: "All Priorities" },
  { id: "p1", label: "P1 Critical" },
  { id: "p2", label: "P2 High" },
  { id: "p3", label: "P3 Standard" },
];

export function OpenCasesPage() {
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";
  const { openLogCase, openCaseDetail } = useModal();
  const [params, setParams] = useSearchParams();
  const priority =
    (params.get("priority") as CasePriority | "all" | null) ?? "all";
  const query = params.get("q") ?? "";
  const searchBy = params.get("by");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [page, setPage] = useState(1);
  const [escalateCase, setEscalateCase] = useState<ActiveCase | null>(null);
  const [escalateDetailsCase, setEscalateDetailsCase] =
    useState<ActiveCase | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["active-cases", contactId, page, PAGE_SIZE],
    queryFn: () => getActiveCases(contactId, page, PAGE_SIZE),
    enabled: Boolean(contactId),
  });

  const missingContactId = !contactId;
  const loading = !missingContactId && (isLoading || isFetching);
  const errorMessage = missingContactId
    ? "Missing contact id. Please sign in again."
    : isError
    ? error instanceof Error
      ? error.message
      : "Failed to load open cases"
    : "";

  const pageCases = loading ? [] : data?.Data ?? [];
  const totalPages = data?.TotalPages ?? 0;
  const hasMore = data?.HasMore ?? false;
  const currentPage = data?.Page ?? page;
  const totalRecords = data?.TotalRecords ?? 0;

  const visible = useMemo(() => {
    return pageCases.filter((item) => {
      const casePriority = mapPriority(item.Priority);
      const matchesPriority = priority === "all" || casePriority === priority;
      return (
        matchesPriority &&
        matchesCaseSearch(item, query, searchBy) &&
        matchesCreatedOnRange(item.CreatedOn, startDateTime, endDateTime)
      );
    });
  }, [pageCases, priority, query, searchBy, startDateTime, endDateTime]);

  const canGoPrevious = currentPage > 1 && !loading;
  const canGoNext =
    !loading && hasMore && (totalPages === 0 || currentPage < totalPages);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    if (key === "q" && !value) next.delete("q");
    setParams(next, { replace: true });
  }

  return (
    <div className={ui.view}>
      <PageBody>
        <PageHeader
          title="Open Cases"
          subtitle="Filter by P1 / P2 / P3, monitor status, and see age/TAT visibility."
          actions={
            <>
              <Button
                variant="secondary"
                disabled={loading || visible.length === 0}
                onClick={() =>
                  exportPortalReport("Dovetail-Open-Cases", {
                    title: "Open Cases",
                    headers: [
                      "Case #",
                      "Title & Description",
                      "Status",
                      "Priority",
                      "Age / TAT",
                      "SLA",
                    ],
                    rows: visible.map((item) => [
                      item.CaseNumber,
                      `${item.Title || "Untitled case"} ${item.Priority}`,
                      mapCatalogStatusLabel(item.Status),
                      mapPriorityLabel(mapPriority(item.Priority)),
                      item.CaseAge ?? "—",
                      item.Sla,
                    ]),
                  })
                }
              >
                ↓ Export Excel
              </Button>
              <Button variant="primary" onClick={openLogCase}>
                <Plus size={12} strokeWidth={2} />
                Log Case
              </Button>
            </>
          }
        />

        <div className={ui.controlsBar}>
          <SearchInput
            value={query}
            onChange={(value) => updateParam("q", value)}
            placeholder="Search open cases..."
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
          {priorities.map((item) => (
            <PriorityFilter
              key={item.id}
              active={priority === item.id}
              onClick={() => updateParam("priority", item.id)}
            >
              {item.label}
            </PriorityFilter>
          ))}
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
          columnsClassName={tableCols.cases}
          headers={[
            "Case #",
            "Title & Description",
            "Status",
            "Priority",
            "Age / TAT",
            "SLA",
            "Actions",
          ]}
        >
          {loading ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              Loading open cases…
            </div>
          ) : null}
          {errorMessage ? (
            <div className="px-5 py-4 text-[12.5px] text-red">
              {errorMessage}
            </div>
          ) : null}
          {!loading && !errorMessage && visible.length === 0 ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              No open cases found.
            </div>
          ) : null}
          {!loading &&
            visible.map((item) => {
              const casePriority = mapPriority(item.Priority);
              const catalogStatus = mapCatalogStatus(item.Status);
              const statusLabel = mapCatalogStatusLabel(item.Status);
              const title = item.Title || "Untitled case";

              return (
                <TableRow
                  key={item.Id}
                  columnsClassName={tableCols.cases}
                  onClick={() => openCaseDetail(item.Id)}
                >
                  <span
                    className={cn(ui.caseNum, "min-w-0 truncate")}
                    title={item.CaseNumber}
                  >
                    {item.CaseNumber}
                  </span>
                  <div className="min-w-0">
                    <div className={cn(ui.caseTitle, "truncate")} title={title}>
                      {title}
                    </div>
                    <div
                      className={cn(ui.caseDesc, "truncate")}
                      title={item.Priority}
                    >
                      {item.Priority}
                    </div>
                  </div>
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
                  <div className="min-w-0">
                    <PriorityBadge priority={casePriority}>
                      {mapPriorityLabel(casePriority)}
                    </PriorityBadge>
                  </div>
                  <span className={cn(ui.tat, "whitespace-nowrap")}>
                    {item.CaseAge ?? "—"}
                  </span>
                  <span className="min-w-0 overflow-hidden">
                    <SlaChip tone={mapSla(item.Sla)}>{item.Sla}</SlaChip>
                  </span>
                  <div className="flex items-center justify-center">
                    {item.IsEscalated ? (
                      <button
                        type="button"
                        className="cursor-pointer rounded-md border border-accent-mid bg-accent-soft px-2.5 py-1 text-[11.5px] font-semibold text-accent transition-[background-color,border-color,opacity] duration-150 hover:border-accent hover:bg-[#e4ecfb]"
                        onClick={(event) => {
                          event.stopPropagation();
                          setEscalateDetailsCase(item);
                        }}
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="cursor-pointer rounded-md border border-accent-mid bg-accent px-2.5 py-1 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90"
                        onClick={(event) => {
                          event.stopPropagation();
                          setEscalateCase(item);
                        }}
                      >
                        Escalate
                      </button>
                    )}
                  </div>
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

        <EscalateCaseModal
          caseItem={escalateCase}
          onClose={() => setEscalateCase(null)}
          onSuccess={() => {
            void refetch();
          }}
        />
        <EscalateDetailsModal
          caseItem={escalateDetailsCase}
          onClose={() => setEscalateDetailsCase(null)}
        />
      </PageBody>
    </div>
  );
}
