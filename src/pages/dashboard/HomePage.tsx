import {
  mapSla,
  mapStatus,
  mapPriority,
  getActiveCases,
  type ActiveCase,
  mapPriorityLabel,
  buildDashboardStats,
} from "../../apis/cases";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { Hero } from "../../components/hero/Hero";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/buttons/Button";
import { SlaChip } from "../../components/badges/SlaChip";
import { StatCard } from "../../components/cards/StatCard";
import { PageBody } from "../../components/layout/PageBody";
import { StatusChip } from "../../components/badges/StatusChip";
import { QuickAccess } from "../../components/cards/QuickAccess";
import { PriorityBadge } from "../../components/badges/PriorityBadge";
import { PriorityFilter } from "../../components/buttons/PriorityFilter";

type CasePriority = "p1" | "p2" | "p3";

export function HomePage() {
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";
  const { openCaseComments } = useModal();
  const [priority, setPriority] = useState<CasePriority | "all">("all");
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
        const data = await getActiveCases(contactId);
        if (!cancelled) setCases(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load active cases"
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

  const visibleCases = useMemo(() => {
    if (priority === "all") return cases;
    return cases.filter((item) => mapPriority(item.Priority) === priority);
  }, [cases, priority]);

  const dashboardStats = useMemo(() => buildDashboardStats(cases), [cases]);

  return (
    <div className={ui.view}>
      <Hero />
      <QuickAccess />
      <PageBody>
        <div className="mb-5 grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-2 max-[980px]:px-0 max-[640px]:grid-cols-1">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

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
            <div className="p-0 max-[980px]:overflow-x-auto">
              <div className="grid grid-cols-[92px_minmax(220px,1fr)_112px_70px_92px] items-center gap-3 bg-[#f8fafc] px-[18px] py-[13px] text-[11px] font-extrabold tracking-[0.06em] text-text-3 uppercase max-[980px]:min-w-[680px] max-[980px]:grid-cols-[86px_minmax(180px,1fr)_104px_60px_86px]">
                <span>Priority</span>
                <span>Case</span>
                <span>Status</span>
                <span>Age</span>
                <span>SLA</span>
              </div>
              <div
                className={cn(ui.tableScrollBody, "max-[980px]:min-w-[680px]")}
              >
                {loading ? (
                  <div className="px-[18px] py-4 text-[12.5px] text-text-3">
                    Loading active cases…
                  </div>
                ) : null}
                {error ? (
                  <div className="px-[18px] py-4 text-[12.5px] text-red">
                    {error}
                  </div>
                ) : null}
                {!loading && !error && visibleCases.length === 0 ? (
                  <div className="px-[18px] py-4 text-[12.5px] text-text-3">
                    No active cases found.
                  </div>
                ) : null}
                {visibleCases.map((item) => {
                  const casePriority = mapPriority(item.Priority);
                  const status = mapStatus(item.Status);
                  const slaTone = mapSla(item.Sla);

                  return (
                    <div
                      key={item.Id}
                      className="grid grid-cols-[92px_minmax(220px,1fr)_112px_70px_92px] items-center gap-3 border-b border-border-soft px-[18px] py-[13px] text-[12.5px] last:border-b-0 max-[980px]:min-w-[680px] max-[980px]:grid-cols-[86px_minmax(180px,1fr)_104px_60px_86px]"
                    >
                      <span>
                        <PriorityBadge priority={casePriority}>
                          {mapPriorityLabel(casePriority)}
                        </PriorityBadge>
                      </span>
                      <div>
                        <strong>{item.CaseNumber}</strong>
                        <small className="mt-0.5 block text-text-3">
                          {item.Title || "Untitled case"}
                        </small>
                      </div>
                      <span>
                        <StatusChip tone={status.tone}>
                          {status.label}
                        </StatusChip>
                      </span>
                      <span>{item.CaseAge}</span>
                      <span>
                        <SlaChip tone={slaTone}>{item.Sla}</SlaChip>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </PageBody>
    </div>
  );
}
