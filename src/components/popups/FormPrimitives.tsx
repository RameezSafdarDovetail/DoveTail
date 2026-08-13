import type { ReactNode } from 'react';
import { cn } from '../../libs/utils';
import { ui } from '../../libs/ui';

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className={ui.formGrid}>{children}</div>;
}

export function FormSection({ children }: { children: ReactNode }) {
  return <div className={ui.formSection}>{children}</div>;
}

export function FormField({ full, className, children }: { full?: boolean; className?: string; children: ReactNode }) {
  return <div className={cn('flex flex-col gap-1.5', full && 'col-span-full', className)}>{children}</div>;
}

export function FormLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={ui.fieldLabel}>
      {children}
      {required ? <span className="text-red"> *</span> : null}
    </label>
  );
}

export function FormHelp({ locked, children }: { locked?: boolean; children: ReactNode }) {
  return (
    <div className={ui.fieldHelp}>
      {locked ? <span className="text-[11px]">Lock </span> : null}
      {children}
    </div>
  );
}

export function FormNote({ children }: { children: ReactNode }) {
  return <div className={ui.formNote}>{children}</div>;
}

export function FormAttach({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={ui.attach}>
      <span className="text-lg text-accent">+</span>
      {children}
    </label>
  );
}
