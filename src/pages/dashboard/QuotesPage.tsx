import {
  getQuotes,
  formatCaseDate,
  type QuoteItem,
  mapQuoteStatusTone,
} from "../../apis/getActiveCases";
import { tableCols, ui } from "../../libs/ui";
import { cn, pluralize } from "../../libs/utils";
import { Pill } from "../../components/badges/Pill";
import { Badge } from "../../components/badges/Badge";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/buttons/Button";
import { PageBody } from "../../components/layout/PageBody";
import { exportPortalReport } from "../../libs/exportReport";
import { PageHeader } from "../../components/layout/PageHeader";
import { FilterPill } from "../../components/buttons/FilterPill";
import { SearchInput } from "../../components/layout/SearchInput";
import { TableCard, TableRow } from "../../components/tables/TableCard";

export function QuotesPage() {
  const { user } = useAuth();
  const contactId = user?.ContactId;
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadQuotes() {
      if (!contactId) {
        setQuotes([]);
        setError("Missing contact id. Please sign in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await getQuotes(contactId);
        if (!cancelled) setQuotes(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load quotes"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadQuotes();
    return () => {
      cancelled = true;
    };
  }, [contactId]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return quotes.filter((item) => {
      if (!term) return true;
      const title = item.Title ?? "";
      const product = item.Product ?? "";
      const subject = item.Subject ?? "";
      return (
        item.QuoteNumber.toLowerCase().includes(term) ||
        title.toLowerCase().includes(term) ||
        product.toLowerCase().includes(term) ||
        subject.toLowerCase().includes(term) ||
        item.Status.toLowerCase().includes(term)
      );
    });
  }, [query, quotes]);

  return (
    <div className={ui.view}>
      <PageBody>
        <PageHeader
          title="My Quotes"
          subtitle="View and manage your pending quotes"
          actions={
            <Button
              variant="secondary"
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
          <FilterPill
            active={scope === "mine"}
            showDot
            onClick={() => setScope("mine")}
          >
            My Quotes <span>▾</span>
          </FilterPill>
          <FilterPill active={scope === "all"} onClick={() => setScope("all")}>
            All Quotes
          </FilterPill>
          <span className={ui.controlsMeta}>
            {loading ? "Loading…" : pluralize(visible.length, "quote")}
          </span>
        </div>

        <TableCard
          columnsClassName={tableCols.quotes}
          headers={["Quote #", "Title", "Product", "Subject", "Status", "Date"]}
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

            return (
              <TableRow key={item.Id} columnsClassName={tableCols.quotes}>
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
                <span
                  className="min-w-0 truncate text-[12.5px] text-text-2"
                  title={subject}
                >
                  {subject}
                </span>
                <div className="min-w-0 overflow-hidden">
                  <Badge tone={mapQuoteStatusTone(item.Status)}>
                    {item.Status}
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
