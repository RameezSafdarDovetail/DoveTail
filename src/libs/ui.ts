/** Shared Tailwind class fragments for repeated portal patterns. */
export const ui = {
  view: "block animate-fade-slide",
  glass:
    "bg-glass-card border border-glass-card-border shadow-card backdrop-blur-[16px]",
  pageBody:
    "max-w-[1180px] px-10 pb-[72px] pt-8 max-[980px]:px-[18px] max-[980px]:pb-14 max-[980px]:pt-[26px]",
  controlsBar:
    "mb-4 flex flex-wrap items-center gap-2 max-[640px]:items-stretch",
  controlsMeta: "ml-auto text-[12.5px] text-page-muted",
  caseNum: "font-mono text-xs font-medium text-accent",
  caseNumDim: "font-mono text-xs font-medium text-text-3",
  caseTitle: "text-[13.5px] font-semibold text-text-1",
  caseSub: "mt-0.5 text-xs text-text-3",
  caseDesc: "mt-[3px] text-xs leading-normal text-text-2",
  tat: "text-xs font-bold text-text-2",
  fieldLabel: "text-sm font-bold text-text-1",
  fieldHelp: "text-xs text-text-2",
  fieldControl:
    "w-full rounded-lg border border-[#d9dce3] bg-white px-3.5 py-[11px] font-sans text-[15px] font-medium text-[#050816] outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:shadow-[0_0_0_3px_rgba(26,86,219,0.10)] read-only:cursor-not-allowed read-only:border-[#d7deea] read-only:bg-[#f3f6fb] read-only:text-slate disabled:cursor-not-allowed disabled:border-[#d7deea] disabled:bg-[#f3f6fb] disabled:text-slate file:bg-white",
  fieldControlWhite:
    "w-full rounded-lg border border-[#d9dce3] bg-white px-3.5 py-[11px] font-sans text-[15px] font-medium text-[#050816] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#d9dce3] focus:shadow-none focus:bg-white accent-slate disabled:cursor-not-allowed disabled:border-[#d7deea] disabled:bg-[#f3f6fb] disabled:text-slate file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:font-semibold file:text-text-1",
  fieldTextarea: "min-h-[104px] resize-y leading-[1.45]",
  formGrid: "grid grid-cols-2 gap-x-3 gap-y-3.5 max-[640px]:grid-cols-1",
  formSection:
    "col-span-full mt-0.5 border-t border-border-soft pt-3 text-xs font-extrabold uppercase tracking-[0.06em] text-text-3",
  formNote:
    "col-span-full rounded-lg border border-[#dbeafe] bg-[#f8fbff] px-3 py-2.5 text-[12.5px] leading-[1.45] text-text-2 [&_strong]:text-text-1",
  formActions:
    "flex gap-2.5 px-5 pb-[18px] max-[640px]:flex-col-reverse [&_.btn-secondary]:min-w-[110px] max-[640px]:[&_.btn-secondary]:w-full [&_.btn-primary]:flex-1 [&_button]:justify-center",
  formStatus: "min-h-[18px] px-5 pb-4 text-[13px] font-bold text-green",
  formBody: "px-5 pb-4 pt-[18px]",
  attach:
    "flex w-fit cursor-pointer items-center gap-2.5 text-sm font-bold text-text-1",
  tableScrollBody: "max-h-[680px] overflow-y-auto",
} as const;

export const tableCols = {
  cases:
    "grid-cols-[118px_minmax(0,1.5fr)_minmax(118px,140px)_100px_92px_minmax(96px,120px)] gap-x-3 max-[640px]:min-w-[900px]",
  casesAll:
    "grid-cols-[118px_minmax(0,1.4fr)_48px_minmax(0,0.85fr)_minmax(132px,152px)_64px] gap-x-3 max-[640px]:min-w-[880px]",
  quotes:
    "grid-cols-[124px_minmax(0,1.4fr)_86px_minmax(0,0.8fr)_minmax(100px,118px)_64px] gap-x-3 max-[640px]:min-w-[860px]",
  closed:
    "grid-cols-[118px_minmax(0,1.4fr)_48px_minmax(0,0.85fr)_minmax(120px,140px)_64px] gap-x-3 max-[640px]:min-w-[880px]",
} as const;
