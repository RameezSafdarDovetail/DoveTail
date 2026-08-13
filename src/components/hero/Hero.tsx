import { paths } from "../../routes/paths";
import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";

export function Hero() {
  const navigate = useNavigate();
  const [searchBy, setSearchBy] = useState("Case Number");
  const [term, setTerm] = useState("");
  const [scope, setScope] = useState<"open" | "all">("open");

  function runPortalSearch(event?: FormEvent) {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (term.trim()) params.set("q", term.trim());
    params.set("by", searchBy);
    const target = scope === "all" ? paths.all : paths.open;
    const query = params.toString();
    navigate(query ? `${target}?${query}` : target);
  }

  const controlClass =
    "w-full rounded-lg border border-white/38 bg-white/94 px-2.5 py-[9px] font-sans text-[12.5px] font-bold text-[#0f172a] outline-none";

  return (
    <div className="relative flex min-h-[336px] items-center justify-start overflow-hidden bg-[linear-gradient(90deg,rgba(2,14,54,0.78),rgba(7,68,172,0.3)_42%,rgba(255,255,255,0)_72%)] px-12 py-[46px] pr-[clamp(280px,35vw,520px)] text-left max-[1130px]:pr-[clamp(120px,18vw,280px)] max-[980px]:min-h-[300px] max-[980px]:px-[22px] max-[980px]:pt-[38px] max-[980px]:pb-16 max-[980px]:pr-[22px] max-[640px]:min-h-[300px] max-[640px]:justify-center max-[640px]:px-[18px] max-[640px]:py-[38px] max-[640px]:pb-[34px] max-[640px]:text-center">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(2,16,58,0.6),rgba(8,75,182,0.14)_48%,rgba(255,255,255,0)_76%)]" />
      <div className="relative z-[1] m-0 w-full min-w-0 max-w-[820px] max-[640px]:mx-auto">
        <div className="mb-1.5 text-[13px] font-bold tracking-[0.08em] text-white/82 uppercase">
          D365 Client Support
        </div>
        <h1 className="mb-[22px] max-w-[650px] font-display text-[clamp(34px,4.4vw,52px)] leading-[1.15] font-extrabold tracking-normal text-white max-[640px]:text-[34px]">
          Client Portal Dashboard
        </h1>
        <form
          className="grid w-full min-w-0 max-w-[780px] min-h-16 grid-cols-[minmax(230px,auto)_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-white/36 bg-white/18 px-3 py-2.5 pr-3 pl-[18px] text-left shadow-hero backdrop-blur-[8px] transition-[background-color,border-color] duration-200 max-[1130px]:grid-cols-[minmax(210px,auto)_minmax(0,1fr)_auto] max-[640px]:mx-auto max-[640px]:grid-cols-1 max-[640px]:p-3.5"
          onSubmit={runPortalSearch}
        >
          <select
            id="portal-search-by"
            aria-label="Search by"
            value={searchBy}
            onChange={(event) => setSearchBy(event.target.value)}
            className={`${controlClass} min-w-[230px] max-[640px]:min-w-0`}
          >
            <option>Case Number</option>
            <option>Client Reference Number</option>
            <option>Keywords</option>
          </select>
          <input
            id="portal-search-term"
            type="search"
            placeholder="Enter case number, reference or keywords"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className={`${controlClass} min-w-0`}
          />
          <button
            className="ml-auto min-h-[38px] shrink-0 cursor-pointer rounded-lg border-0 bg-white px-[18px] py-2 font-sans text-[12.5px] font-semibold text-accent transition-opacity duration-150 hover:opacity-88 max-[640px]:col-span-1 max-[640px]:ml-0 max-[640px]:w-full max-[640px]:justify-center"
            type="submit"
          >
            Search
          </button>
          <div
            className="col-span-3 flex min-w-0 flex-wrap gap-2 max-[640px]:col-span-1"
            aria-label="Search filters"
          >
            <label className="rounded-pill border border-white/40 px-2.5 py-[5px] text-xs font-bold text-white/82">
              <input
                type="radio"
                name="portal-search-scope"
                value="open"
                checked={scope === "open"}
                onChange={() => setScope("open")}
                className="mr-[5px] w-auto accent-accent"
              />{" "}
              Open Cases Only
            </label>
            <label className="rounded-pill border border-white/40 px-2.5 py-[5px] text-xs font-bold text-white/82">
              <input
                type="radio"
                name="portal-search-scope"
                value="all"
                checked={scope === "all"}
                onChange={() => setScope("all")}
                className="mr-[5px] w-auto accent-accent"
              />{" "}
              All Cases
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
