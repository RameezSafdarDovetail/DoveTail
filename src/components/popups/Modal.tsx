import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { ui } from "../../libs/ui";

interface ModalProps {
  open: boolean;
  labelledBy: string;
  onClose: () => void;
  closeOnBackdrop?: boolean;
  children: ReactNode;
}

export function Modal({
  open,
  labelledBy,
  onClose,
  closeOnBackdrop = false,
  children,
}: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] grid place-items-center bg-[rgba(1,12,42,0.58)] p-6 backdrop-blur-[10px] max-[640px]:items-start max-[640px]:p-3"
      aria-hidden="false"
      onClick={(event) => {
        if (!closeOnBackdrop) return;
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[min(720px,calc(100vh-48px))] w-[min(760px,100%)] overflow-auto rounded-lg border border-white/75 bg-white/98 shadow-modal max-[640px]:max-h-[calc(100vh-24px)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface ModalHeadProps {
  titleId: string;
  title: string;
  onClose: () => void;
  closeLabel: string;
}

export function ModalHead({
  titleId,
  title,
  onClose,
  closeLabel,
}: ModalHeadProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
      <div
        className="flex items-center gap-2.5 text-base font-extrabold text-text-1"
        id={titleId}
      >
        <span className="inline-flex size-[18px] items-center justify-center rounded-full border-[1.7px] border-accent text-sm leading-none text-accent">
          +
        </span>{" "}
        {title}
      </div>
      <button
        className="size-[34px] cursor-pointer rounded-lg border border-border bg-white text-lg text-text-2"
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
      >
        x
      </button>
    </div>
  );
}

export function ModalActions({ children }: { children: ReactNode }) {
  return <div className={ui.formActions}>{children}</div>;
}

export function ModalStatus({ children }: { children: ReactNode }) {
  return (
    <div className={ui.formStatus} aria-live="polite">
      {children}
    </div>
  );
}
