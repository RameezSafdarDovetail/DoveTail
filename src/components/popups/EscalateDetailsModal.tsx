import { useEffect, useState } from "react";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { Button } from "../buttons/Button";
import type { ActiveCase, EscalationDetails } from "../../apis/cases";
import {
  formatEscalationDateTime,
  getEscalationClientResponseLabel,
  getEscalationProgressSteps,
  getEscalationReviewerLabel,
  getEscalationDetails,
} from "../../apis/cases";
import { Modal, ModalHead } from "./Modal";

interface EscalateDetailsModalProps {
  caseItem: ActiveCase | null;
  onClose: () => void;
}

function displayValue(value: string | null | undefined) {
  const text = value?.trim();
  return text || "—";
}

function EscalationProgressStepper({
  status,
  escalatedOn,
}: {
  status: string;
  escalatedOn: string;
}) {
  const steps = getEscalationProgressSteps(status);
  const completedCount = steps.filter(
    (step) => step.state === "complete"
  ).length;
  const progressPercent =
    steps.length > 1 ? ((completedCount - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="mt-5">
      <div className="relative">
        <div className="absolute left-[12px] right-[12px] top-[11px] h-px bg-[#d7deea]">
          <div
            className="absolute left-0 top-0 h-px bg-[#c9a227] transition-[width] duration-300"
            style={{ width: `${Math.max(progressPercent, 0)}%` }}
          />
        </div>
        <ol className="relative grid grid-cols-4 gap-2">
          {steps.map((step) => {
            const subtext =
              step.state === "complete"
                ? formatEscalationDateTime(escalatedOn)
                : step.pendingSubtext || "Pending";

            return (
              <li
                key={step.label}
                className="flex flex-col items-center text-center"
              >
                <span
                  className={cn(
                    "relative z-[1] size-[22px] rounded-full border-2",
                    step.state === "complete"
                      ? "border-[#c9a227] bg-[#c9a227]"
                      : "border-[#b8c4d9] bg-white"
                  )}
                  aria-hidden="true"
                />
                <p className="mt-2.5 text-[12.5px] font-bold leading-tight text-text-1">
                  {step.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-text-3">
                  {subtext}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function EscalationDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)] gap-4 border-b border-border-soft px-4 py-3.5 last:border-b-0">
      <div className="text-[13px] font-bold text-text-1">{label}</div>
      <div className="text-[13px] leading-[1.45] text-text-2">{value}</div>
    </div>
  );
}

export function EscalateDetailsModal({
  caseItem,
  onClose,
}: EscalateDetailsModalProps) {
  const [detail, setDetail] = useState<EscalationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!caseItem) {
      setDetail(null);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    setDetail(null);

    void getEscalationDetails(caseItem.Id)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load escalation details"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [caseItem]);

  const caseNumber = detail?.CaseNumber ?? caseItem?.CaseNumber ?? "";

  return (
    <Modal
      open={Boolean(caseItem)}
      labelledBy="escalate-details-title"
      onClose={onClose}
    >
      <ModalHead
        titleId="escalate-details-title"
        title={`Escalation Progress – ${caseNumber}`}
        onClose={onClose}
        closeLabel="Close escalation details modal"
      />
      <div className={ui.formBody}>
        {loading ? (
          <div className="py-6 text-[13px] text-text-3">
            Loading escalation details…
          </div>
        ) : null}

        {error ? (
          <div className="py-6 text-[13px] font-semibold text-red">{error}</div>
        ) : null}

        {!loading && !error && detail ? (
          <div className="grid gap-5">
            <EscalationProgressStepper
              status={detail.EscalationStatus}
              escalatedOn={detail.EscalatedOn}
            />

            {/* <div className="rounded-md border border-[#dbeafe] border-l-4 border-l-[#021b55] bg-[#f8fbff] px-4 py-3 text-[12.5px] leading-[1.5] text-text-2">
              Auto-acknowledgement sent to client on escalation. Internal action
              email to be added by ZN for staff review step.
            </div> */}

            <div>
              <h3 className="text-[15px] font-extrabold text-text-1">
                Escalation Detail
              </h3>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <EscalationDetailRow
                  label="Reason for escalation"
                  value={displayValue(detail.EscalationReason)}
                />
                <EscalationDetailRow
                  label="Escalated by"
                  value={displayValue(detail.EscalatedBy)}
                />
                <EscalationDetailRow
                  label="Assigned reviewer"
                  value={getEscalationReviewerLabel(detail.EscalationStatus)}
                />
                <EscalationDetailRow
                  label="Client response"
                  value={getEscalationClientResponseLabel(
                    detail.EscalationStatus
                  )}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className={cn(ui.formActions, "justify-center")}>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
