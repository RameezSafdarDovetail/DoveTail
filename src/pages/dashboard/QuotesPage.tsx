import { formatCaseDate } from "../../apis/cases";
import {
  getQuotes,
  type QuoteItem,
  mapQuoteStatusTone,
} from "../../apis/quotes";
import {
  QuoteActionModal,
  type QuoteActionState,
} from "../../components/popups/QuoteActionModal";
import { ui } from "../../libs/ui";
import { useAuth } from "../../hooks/useAuth";
import { cn, pluralize } from "../../libs/utils";
import { Pill } from "../../components/badges/Pill";
import { Badge } from "../../components/badges/Badge";
import { Button } from "../../components/buttons/Button";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { FilterPill } from "../../components/buttons/FilterPill";
import { SearchInput } from "../../components/layout/SearchInput";
import { TableCard, TableRow } from "../../components/tables/TableCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const quoteStatusOptions = [
  { id: "quoting-in-progress", label: "Quoting In Progress" },
  { id: "awaiting-customer", label: "Awaiting Customer Response" },
  { id: "quote-accepted", label: "Quote Accepted" },
  { id: "quote-rejected", label: "Quote Rejected" },
] as const;

type QuoteStatusFilter = (typeof quoteStatusOptions)[number]["id"] | "all";

const quoteTableCols =
  "grid-cols-[124px_minmax(0,1.15fr)_86px_minmax(180px,220px)_minmax(0,0.55fr)_64px_minmax(158px,184px)] gap-x-2 max-[640px]:min-w-[1080px]";

function matchesQuoteStatus(status: string, filter: QuoteStatusFilter) {
  if (filter === "all") return true;
  const value = status.toLowerCase();
  const selected = quoteStatusOptions.find((option) => option.id === filter);
  if (!selected) return true;
  return value.includes(selected.label.toLowerCase());
}

function shouldHideQuoteActions(status: string) {
  const value = status.trim().toLowerCase();
  return (
    value === "quote accepted" ||
    value === "qoute accepted" ||
    value === "quote rejected" ||
    value === "qoute rejected" ||
    value === "quote cancelled" ||
    value === "quote canceled" ||
    value === "qoute cancelled" ||
    value === "qoute canceled"
  );
}

export function QuotesPage() {
  const { user } = useAuth();
  const contactId = user?.ContactId;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>("all");
  const [statusOpen, setStatusOpen] = useState(false);
  const [actionModal, setActionModal] = useState<QuoteActionState | null>(null);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQuotes = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!contactId) {
        setQuotes([]);
        setError("Missing contact id. Please sign in again.");
        setLoading(false);
        return;
      }

      if (!options?.silent) {
        setLoading(true);
        setError("");
      }

      try {
        const data = await getQuotes(contactId);
        setQuotes(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quotes");
      } finally {
        setLoading(false);
      }
    },
    [contactId]
  );

  useEffect(() => {
    void loadQuotes();
  }, [loadQuotes]);

  useEffect(() => {
    if (!statusOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setStatusOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [statusOpen]);

  const statusFilterLabel = useMemo(() => {
    if (statusFilter === "all") return "My Quotes";
    return (
      quoteStatusOptions.find((option) => option.id === statusFilter)?.label ??
      "My Quotes"
    );
  }, [statusFilter]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return quotes.filter((item) => {
      const statusText = item.Status ?? "";
      const matchesStatus =
        scope === "all" || matchesQuoteStatus(statusText, statusFilter);
      if (!matchesStatus) return false;
      if (!term) return true;
      const title = item.Title ?? "";
      const product = item.Product ?? "";
      const subject = item.Subject ?? "";
      return (
        item.QuoteNumber.toLowerCase().includes(term) ||
        title.toLowerCase().includes(term) ||
        product.toLowerCase().includes(term) ||
        subject.toLowerCase().includes(term) ||
        statusText.toLowerCase().includes(term)
      );
    });
  }, [query, quotes, scope, statusFilter]);

  function openActionModal(type: QuoteActionState["type"], quote: QuoteItem) {
    setActionModal({ type, quote });
  }

  function closeActionModal() {
    setActionModal(null);
  }

  return (
    <div className={ui.view}>
      <PageBody>
        <PageHeader
          title="My Quotes"
          subtitle="View and manage your pending quotes"
          actions={
            <Button
              variant="secondary"
              disabled={loading || visible.length === 0}
              onClick={() =>
                exportPortalReport("Dovetail-Quotes", {
                  title: "My Quotes",
                  headers: [
                    "Quote #",
                    "Title",
                    "Product",
                    "Subject",
                    "Status",
                    "Date",
                  ],
                  rows: visible.map((item) => [
                    item.QuoteNumber,
                    item.Title || "Untitled quote",
                    item.Product || "—",
                    item.Subject || "—",
                    item.Status,
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
            placeholder="Search quotes…"
          />
          <div className="relative" ref={dropdownRef}>
            <FilterPill
              active={scope === "mine"}
              showDot
              aria-expanded={statusOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setScope("mine");
                setStatusOpen((open) => !open);
              }}
            >
              {statusFilterLabel} <span>▾</span>
            </FilterPill>
            {statusOpen ? (
              <div
                role="listbox"
                className="absolute top-[calc(100%+6px)] left-0 z-20 min-w-[210px] overflow-hidden rounded-[9px] border border-white/56 bg-white py-1 shadow-card"
              >
                {quoteStatusOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={statusFilter === option.id}
                    className={cn(
                      "flex w-full cursor-pointer items-center px-3.5 py-2 text-left font-sans text-[13px] font-medium text-text-2 hover:bg-accent-soft hover:text-accent",
                      statusFilter === option.id && "bg-accent-soft text-accent"
                    )}
                    onClick={() => {
                      setScope("mine");
                      setStatusFilter(option.id);
                      setStatusOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <FilterPill
            active={scope === "all"}
            onClick={() => {
              setScope("all");
              setStatusFilter("all");
              setStatusOpen(false);
            }}
          >
            All Quotes
          </FilterPill>
          <span className={ui.controlsMeta}>
            {loading ? "Loading…" : pluralize(visible.length, "quote")}
          </span>
        </div>

        <TableCard
          columnsClassName={quoteTableCols}
          headers={[
            "Quote #",
            "Title",
            "Product",
            "Status",
            "Subject",
            "Date",
            "Actions",
          ]}
        >
          {loading ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              Loading quotes…
            </div>
          ) : null}
          {error ? (
            <div className="px-5 py-4 text-[12.5px] text-red">{error}</div>
          ) : null}
          {!loading && !error && visible.length === 0 ? (
            <div className="px-5 py-4 text-[12.5px] text-text-3">
              No quotes found.
            </div>
          ) : null}
          {visible.map((item) => {
            const title = item.Title || "Untitled quote";
            const product = item.Product || "—";
            const subject = item.Subject || "—";
            const statusText = item.Status ?? "";
            const showActions = !shouldHideQuoteActions(statusText);

            return (
              <TableRow key={item.Id} columnsClassName={quoteTableCols}>
                <span
                  className={cn(ui.caseNum, "min-w-0 truncate")}
                  title={item.QuoteNumber}
                >
                  {item.QuoteNumber}
                </span>
                <div className="min-w-0">
                  <div className={cn(ui.caseTitle, "truncate")} title={title}>
                    {title}
                  </div>
                  <div className={cn(ui.caseSub, "truncate")} title={subject}>
                    Re: {subject}
                  </div>
                </div>
                <div className="min-w-0">
                  <Pill>{product}</Pill>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <Badge tone={mapQuoteStatusTone(statusText)}>
                    {statusText || "—"}
                  </Badge>
                </div>
                <span
                  className="min-w-0 truncate text-[12.5px] text-text-2"
                  title={subject}
                >
                  {subject}
                </span>
                <span className="whitespace-nowrap text-xs text-text-3">
                  {formatCaseDate(item.CreatedOn)}
                </span>
                <div className="flex items-center justify-end gap-1.5">
                  {showActions ? (
                    <>
                      <button
                        type="button"
                        className="cursor-pointer rounded-md border border-[#2f7b32] bg-[#34a853] px-2.5 py-1 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90"
                        onClick={() => openActionModal("accept", item)}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer rounded-md border border-[#b3261e] bg-[#d93025] px-2.5 py-1 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90"
                        onClick={() => openActionModal("reject", item)}
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </TableRow>
            );
          })}
        </TableCard>

        <QuoteActionModal
          action={actionModal}
          onClose={closeActionModal}
          onSuccess={() => {
            void loadQuotes({ silent: true });
          }}
        />
      </PageBody>
    </div>
  );
}
