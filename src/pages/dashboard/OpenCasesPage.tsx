import {
  mapSla,
  mapPriority,
  getActiveCases,
  type ActiveCase,
  mapCatalogStatus,
  mapPriorityLabel,
  mapCatalogStatusLabel,
} from "../../apis/getActiveCases";
import { Plus } from "lucide-react";
import { tableCols, ui } from "../../libs/ui";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { cn, pluralize } from "../../libs/utils";
import { useSearchParams } from "react-router-dom";
import { Badge } from "../../components/badges/Badge";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/buttons/Button";
import { SlaChip } from "../../components/badges/SlaChip";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchInput } from "../../components/layout/SearchInput";
import { PriorityBadge } from "../../components/badges/PriorityBadge";
import { TableCard, TableRow } from "../../components/tables/TableCard";
import { PriorityFilter } from "../../components/buttons/PriorityFilter";

type CasePriority = "p1" | "p2" | "p3";

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
  const { openLogCase } = useModal();
  const [params, setParams] = useSearchParams();
  const priority =
    (params.get("priority") as CasePriority | "all" | null) ?? "all";
  const query = params.get("q") ?? "";
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
            err instanceof Error ? err.message : "Failed to load open cases"
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
      const casePriority = mapPriority(item.Priority);
      const title = item.Title ?? "";
      const statusLabel = mapCatalogStatusLabel(item.Status);
      const matchesPriority = priority === "all" || casePriority === priority;
      const matchesQuery =
        !term ||
        item.CaseNumber.toLowerCase().includes(term) ||
        title.toLowerCase().includes(term) ||
        statusLabel.toLowerCase().includes(term) ||
        item.Priority.toLowerCase().includes(term) ||
        item.Sla.toLowerCase().includes(term);
      return matchesPriority && matchesQuery;
    });
  }, [cases, priority, query]);

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
                onClick={() => exportPortalReport("open")}
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
            {loading ? "Loading…" : pluralize(visible.length, "case")}
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
          ]}
        >
          {loading ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              Loading open cases…
            </div>
          ) : null}
          {error ? (
            <div className="px-5 py-4 text-[12.5px] text-red">{error}</div>
          ) : null}
          {!loading && !error && visible.length === 0 ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              No open cases found.
            </div>
          ) : null}
          {visible.map((item) => {
            const casePriority = mapPriority(item.Priority);
            const catalogStatus = mapCatalogStatus(item.Status);
            const statusLabel = mapCatalogStatusLabel(item.Status);
            const title = item.Title || "Untitled case";

            return (
              <TableRow key={item.Id} columnsClassName={tableCols.cases}>
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
                  {item.CaseAge}
                </span>
                <span className="min-w-0 overflow-hidden">
                  <SlaChip tone={mapSla(item.Sla)}>{item.Sla}</SlaChip>
                </span>
              </TableRow>
            );
          })}
        </TableCard>
      </PageBody>
    </div>
  );
}
