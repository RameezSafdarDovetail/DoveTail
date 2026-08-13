import type { ReactNode } from 'react';

interface PageHeaderProps {
  breadcrumb?: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageHeader({ breadcrumb = 'Home › My Support', title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 grid min-h-[130px] grid-cols-[minmax(0,1fr)] justify-items-start gap-3.5 pr-[clamp(220px,34vw,460px)] max-[640px]:min-h-0 max-[640px]:pr-0">
      <div className="max-w-[620px]">
        <div className="mb-1.5 flex items-center gap-[5px] text-xs text-page-muted">{breadcrumb}</div>
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.4px] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.22)]">
          {title}
        </h1>
        <p className="mt-[3px] text-[13.5px] text-page-muted">{subtitle}</p>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center justify-start gap-2 max-[640px]:w-full max-[640px]:[&_button]:flex-1 max-[640px]:[&_button]:basis-[150px] max-[640px]:[&_button]:justify-center">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
