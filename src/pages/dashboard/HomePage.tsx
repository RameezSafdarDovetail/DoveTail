import {
  // mapSla,
  mapPriority,
  getActiveCases,
  formatCaseDate,
  type ActiveCase,
  mapPriorityLabel,
  mapCatalogStatus,
  compareCreatedOnDesc,
  mapCatalogStatusLabel,
  // buildDashboardStats,
} from "../../apis/cases";
import { cn } from "../../libs/utils";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { tableCols, ui } from "../../libs/ui";
import { useModal } from "../../hooks/useModal";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "../../components/hero/Hero";
import { Badge } from "../../components/badges/Badge";
import { Button } from "../../components/buttons/Button";
import { PageBody } from "../../components/layout/PageBody";
import { TableRow } from "../../components/tables/TableCard";
// import { SlaChip } from "../../components/badges/SlaChip";
// import { StatCard } from "../../components/cards/StatCard";
import { QuickAccess } from "../../components/cards/QuickAccess";
import { PriorityBadge } from "../../components/badges/PriorityBadge";
import { PriorityFilter } from "../../components/buttons/PriorityFilter";
import { EscalateCaseModal } from "../../components/popups/EscalateCaseModal";
import { EscalateDetailsModal } from "../../components/popups/EscalateDetailsModal";

type CasePriority = "p1" | "p2" | "p3";

const PAGE_SIZE = 1000;

export function HomePage() {
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";
  const { openCaseComments, openCaseDetail } = useModal();
  const [priority, setPriority] = useState<CasePriority | "all">("all");
  const [page, setPage] = useState(1);
  const [escalateCase, setEscalateCase] = useState<ActiveCase | null>(null);
  const [escalateDetailsCase, setEscalateDetailsCase] =
    useState<ActiveCase | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["active-cases", contactId, page, PAGE_SIZE],
    queryFn: () => getActiveCases(contactId, page, PAGE_SIZE),
    enabled: Boolean(contactId),
  });

  const missingContactId = !contactId;
  const loading = !missingContactId && isLoading;
  const errorMessage = missingContactId
    ? "Missing contact id. Please sign in again."
    : isError
    ? error instanceof Error
      ? error.message
      : "Failed to load active cases"
    : "";

  const pageCases = data?.Data ?? [];
  const totalPages = data?.TotalPages ?? 0;
  const hasMore = data?.HasMore ?? false;
  const currentPage = data?.Page ?? page;
  const totalRecords = data?.TotalRecords ?? 0;

  const visibleCases = useMemo(() => {
    const filtered =
      priority === "all"
        ? pageCases
        : pageCases.filter((item) => mapPriority(item.Priority) === priority);
    return [...filtered].sort(compareCreatedOnDesc);
  }, [pageCases, priority]);

  // const dashboardStats = useMemo(
  //   () => buildDashboardStats(pageCases),
  //   [pageCases]
  // );

  const canGoPrevious = currentPage > 1 && !loading;
  const canGoNext =
    !loading && hasMore && (totalPages === 0 || currentPage < totalPages);

  return (
    <div className={ui.view}>
      <Hero />
      <QuickAccess />
      <PageBody>
        {/* <div className="mb-5 grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-2 max-[980px]:px-0 max-[640px]:grid-cols-1">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div> */}

        <div className="grid grid-cols-1 items-start gap-[18px]">
          <section className={cn(ui.glass, "overflow-hidden rounded-default")}>
            <div className="flex items-center justify-between border-b border-border-soft px-5 pt-3.5 pb-3">
              <span className="text-sm font-bold text-text-1">
                Active D365 Cases
              </span>
              <Button
                variant="secondary"
                compact
                onClick={() => openCaseComments()}
              >
                Case Comments
              </Button>
            </div>
            <div
              className="flex flex-wrap gap-2 border-b border-border-soft px-[18px] py-3"
              aria-label="Filter cases by priority"
            >
              <PriorityFilter
                active={priority === "all"}
                onClick={() => setPriority("all")}
              >
                All
              </PriorityFilter>
              <PriorityFilter
                active={priority === "p1"}
                onClick={() => setPriority("p1")}
              >
                P1
              </PriorityFilter>
              <PriorityFilter
                active={priority === "p2"}
                onClick={() => setPriority("p2")}
              >
                P2
              </PriorityFilter>
              <PriorityFilter
                active={priority === "p3"}
                onClick={() => setPriority("p3")}
              >
                P3
              </PriorityFilter>
            </div>
            <div className="max-[640px]:overflow-x-auto">
              <div
                className={cn(
                  "grid items-center border-b border-border bg-[#fafbfc] px-5 py-[11px] max-[640px]:min-w-[720px]",
                  tableCols.cases
                )}
              >
                {(
                  [
                    "Case #",
                    "Title ",
                    "Status",
                    "Priority",
                    "Created On",
                    "Actions",
                  ] as const
                ).map((header) => (
                  <span
                    key={header}
                    className={cn(
                      "text-[11px] font-bold tracking-[0.06em] text-text-3 uppercase",
                      header === "Actions" && "justify-self-center text-center"
                    )}
                  >
                    {header}
                  </span>
                ))}
              </div>
              <div
                className={cn(ui.tableScrollBody, "max-[640px]:min-w-[720px]")}
              >
                {loading ? (
                  <div className="px-5 py-4 text-[12.5px] text-text-3">
                    Loading active cases…
                  </div>
                ) : null}
                {errorMessage ? (
                  <div className="px-5 py-4 text-[12.5px] text-red">
                    {errorMessage}
                  </div>
                ) : null}
                {!loading && !errorMessage && visibleCases.length === 0 ? (
                  <div className="px-5 py-4 text-[12.5px] text-text-3">
                    No active cases found.
                  </div>
                ) : null}
                {!loading &&
                  visibleCases.map((item) => {
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
                          <div
                            className={cn(ui.caseTitle, "truncate")}
                            title={title}
                          >
                            {title}
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
                        <span className="whitespace-nowrap text-xs text-text-3">
                          {formatCaseDate(item.CreatedOn, true)}
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
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-soft px-[18px] py-3">
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
          </section>
        </div>
        <EscalateCaseModal
          caseItem={escalateCase}
          onClose={() => setEscalateCase(null)}
        />
        <EscalateDetailsModal
          caseItem={escalateDetailsCase}
          onClose={() => setEscalateDetailsCase(null)}
        />
      </PageBody>
    </div>
  );
}
