import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { Button } from "../buttons/Button";
import { useState, type FormEvent } from "react";
import { refreshCaseLists } from "../../libs/queryClient";
import { useModalFeedback } from "../../hooks/useModalFeedback";
import { FormField, FormHelp, FormLabel } from "./FormPrimitives";
import { Modal, ModalActions, ModalHead, ModalStatus } from "./Modal";
import { acceptQuote, rejectQuote, type QuoteItem } from "../../apis/quotes";

type QuoteActionType = "accept" | "reject";

const rejectionReasons = [
  { value: 1, label: "Price is too high" },
  { value: 2, label: "Quote does not match requested scope" },
  { value: 3, label: "Budget was not approved" },
  { value: 4, label: "Other" },
] as const;

export interface QuoteActionState {
  type: QuoteActionType;
  quote: QuoteItem;
}

interface QuoteActionModalProps {
  action: QuoteActionState | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuoteActionModal({
  action,
  onClose,
  onSuccess,
}: QuoteActionModalProps) {
  const [poNumber, setPoNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComments, setRejectionComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    message: status,
    tone: statusTone,
    pendingClose,
    reset,
    showError,
    showSuccess,
  } = useModalFeedback(Boolean(action), closeModal);

  function closeModal() {
    reset();
    setPoNumber("");
    setRejectionReason("");
    setRejectionComments("");
    setSubmitting(false);
    onClose();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action || submitting || pendingClose) return;

    if (action.type === "accept") {
      const form = new FormData(event.currentTarget);
      const poDocument = form.get("poDocument");

      const payload = new FormData();
      payload.append("quoteId", action.quote.Id);
      payload.append("poNumber", poNumber.trim());

      if (poDocument instanceof File && poDocument.size > 0) {
        payload.append("poDocument", poDocument);
      }

      setSubmitting(true);
      reset();
      try {
        await acceptQuote(payload);
        showSuccess("Quote accepted successfully.");
        void refreshCaseLists();
        onSuccess?.();
      } catch (error) {
        showError(
          error instanceof Error ? error.message : "Failed to accept quote"
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const reasonValue = Number(rejectionReason);
    if (!Number.isFinite(reasonValue) || reasonValue < 1) {
      showError("Please select a rejection reason.");
      return;
    }

    setSubmitting(true);
    reset();
    try {
      await rejectQuote({
        QuoteId: action.quote.Id,
        RejectionReasonOptionValue: reasonValue,
        RejectionComments: rejectionComments.trim(),
      });
      showSuccess("Quote rejected successfully.");
      void refreshCaseLists();
      onSuccess?.();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to reject quote"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={Boolean(action)}
      labelledBy="quote-action-title"
      onClose={closeModal}
    >
      <form onSubmit={onSubmit}>
        <ModalHead
          titleId="quote-action-title"
          title={action?.type === "accept" ? "Accept Quote" : "Reject Quote"}
          onClose={closeModal}
          closeLabel="Close quote action modal"
        />
        <div className={ui.formBody}>
          <div className="mb-3 text-[12.5px] text-text-2">
            Quote:{" "}
            <strong className="text-text-1">
              {action?.quote.QuoteNumber ?? "—"}
            </strong>
          </div>
          {action?.type === "accept" ? (
            <div className="grid gap-3">
              <FormField>
                <FormLabel htmlFor="quote-po-number" required>
                  PO Number
                </FormLabel>
                <input
                  id="quote-po-number"
                  name="poNumber"
                  type="text"
                  required
                  value={poNumber}
                  onChange={(event) => setPoNumber(event.target.value)}
                  placeholder="Enter PO number"
                  className={ui.fieldControl}
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="quote-po-document">
                  Supporting PO Document
                </FormLabel>
                <input
                  id="quote-po-document"
                  name="poDocument"
                  type="file"
                  className={ui.fileInput}
                />
                <FormHelp>Optional upload.</FormHelp>
              </FormField>
            </div>
          ) : (
            <div className="grid gap-3">
              <FormField>
                <FormLabel htmlFor="quote-rejection-reason" required>
                  Rejection Reason
                </FormLabel>
                <select
                  id="quote-rejection-reason"
                  name="RejectionReason"
                  required
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  className={cn(ui.fieldControlWhite, "cursor-pointer")}
                >
                  <option value="">-- Select reason --</option>
                  {rejectionReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField>
                <FormLabel htmlFor="quote-rejection-comments">
                  Comments
                </FormLabel>
                <textarea
                  id="quote-rejection-comments"
                  name="RejectionComments"
                  value={rejectionComments}
                  onChange={(event) => setRejectionComments(event.target.value)}
                  placeholder="Optional comments"
                  className={cn(ui.fieldControl, ui.fieldTextarea)}
                />
              </FormField>
            </div>
          )}
        </div>
        <ModalActions>
          <Button
            variant="secondary"
            onClick={closeModal}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={submitting || pendingClose}
            className={
              submitting || pendingClose
                ? "cursor-not-allowed opacity-60"
                : undefined
            }
          >
            {submitting
              ? "Submitting…"
              : action?.type === "accept"
              ? "Confirm Accept"
              : "Confirm Reject"}
          </Button>
        </ModalActions>
        <ModalStatus tone={statusTone}>{status}</ModalStatus>
      </form>
    </Modal>
  );
}
