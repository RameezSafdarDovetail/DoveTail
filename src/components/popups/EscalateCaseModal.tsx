import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { Button } from "../buttons/Button";
import { useAuth } from "../../hooks/useAuth";
import { escalateCase } from "../../apis/cases";
import type { ActiveCase } from "../../apis/cases";
import { FormField, FormLabel } from "./FormPrimitives";
import { Modal, ModalActions, ModalHead, ModalStatus } from "./Modal";
import { useEffect, useState, type FormEvent } from "react";

interface EscalateCaseModalProps {
  caseItem: ActiveCase | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EscalateCaseModal({
  caseItem,
  onClose,
  onSuccess,
}: EscalateCaseModalProps) {
  const { user } = useAuth();
  const userEmail = user?.Email ?? "";
  const contactId = user?.ContactId ?? "";
  const [personResponsible, setPersonResponsible] = useState(userEmail);
  const [escalateReason, setEscalateReason] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!caseItem) return;
    setPersonResponsible(userEmail);
    setEscalateReason("");
    setStatus("");
    setSubmitting(false);
  }, [caseItem, userEmail]);

  function closeModal() {
    setPersonResponsible(userEmail);
    setEscalateReason("");
    setStatus("");
    setSubmitting(false);
    onClose();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!caseItem || submitting) return;

    if (!contactId) {
      setStatus("Missing contact id. Please sign in again.");
      return;
    }

    const reason = escalateReason.trim();
    if (!reason) {
      setStatus("Please enter an escalation reason.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      await escalateCase({
        CaseId: caseItem.Id,
        Reason: reason,
        EscalatedByContactId: contactId,
      });
      setStatus("Case escalated successfully.");
      onSuccess?.();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Failed to escalate case"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={Boolean(caseItem)}
      labelledBy="escalate-case-title"
      onClose={closeModal}
    >
      <form onSubmit={onSubmit}>
        <ModalHead
          titleId="escalate-case-title"
          title="Escalate case"
          onClose={closeModal}
          closeLabel="Close escalate case modal"
        />
        <div className={ui.formBody}>
          <div className="grid gap-3">
            <FormField>
              <FormLabel htmlFor="escalate-case-number">Case number</FormLabel>
              <input
                id="escalate-case-number"
                type="text"
                readOnly
                value={caseItem?.CaseNumber ?? ""}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="escalate-person-responsible">
                Person responsible
              </FormLabel>
              <input
                id="escalate-person-responsible"
                type="email"
                readOnly
                value={personResponsible}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="escalate-reason" required>
                Escalate Reason
              </FormLabel>
              <textarea
                id="escalate-reason"
                required
                value={escalateReason}
                onChange={(event) => setEscalateReason(event.target.value)}
                placeholder="Explain why this case should be escalated"
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>
          </div>
        </div>
        <ModalStatus>{status}</ModalStatus>
        <ModalActions>
          <Button variant="secondary" onClick={closeModal} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Escalating..." : "Escalate"}
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}
