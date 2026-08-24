import {
  FormField,
  FormGrid,
  FormLabel,
  FormSection,
} from "./FormPrimitives";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { Button } from "../buttons/Button";
import { useModal } from "../../hooks/useModal";
import { Modal, ModalActions, ModalHead } from "./Modal";
import { useEffect, useState } from "react";
import {
  getCaseDetailByID,
  mapCategoryCodeLabel,
  mapPriorityCodeLabel,
  type CaseDetail,
} from "../../apis/cases";

function displayValue(value: string | number | null | undefined) {
  if (value == null) return "—";
  const text = String(value).trim();
  return text || "—";
}

function guessMimeType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "png") return "image/png";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "gif") return "image/gif";
  if (extension === "webp") return "image/webp";
  if (extension === "pdf") return "application/pdf";
  return "application/octet-stream";
}

function isImageFile(fileName: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileName);
}

function toDataUrl(fileName: string, body: string) {
  const trimmed = body.trim();
  if (trimmed.startsWith("data:")) return trimmed;
  return `data:${guessMimeType(fileName)};base64,${trimmed}`;
}

export function CaseDetailModal() {
  const { modal, closeModal } = useModal();
  const open = modal.name === "case-detail";
  const caseId = modal.caseId ?? "";
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !caseId) {
      setDetail(null);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    setDetail(null);

    void getCaseDetailByID(caseId)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load case details"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, caseId]);

  const attachments = detail?.Attachments?.filter(
    (item) => item.DocumentBody || item.FileName
  ) ?? [];

  return (
    <Modal open={open} labelledBy="case-detail-title" onClose={closeModal}>
      <ModalHead
        titleId="case-detail-title"
        title="Case details"
        onClose={closeModal}
        closeLabel="Close case details"
      />
      <div className={ui.formBody}>
        {loading ? (
          <div className="py-6 text-[13px] text-text-3">Loading case details…</div>
        ) : null}
        {error ? (
          <div className="py-6 text-[13px] font-semibold text-red">{error}</div>
        ) : null}
        {!loading && !error && detail ? (
          <FormGrid>
            <FormSection>User and Account</FormSection>
            <FormField>
              <FormLabel>Person responsible</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.PersonResponsible)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel>Account</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.Account?.Name)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel>Client reference / Freshdesk reference</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.CustomerReference)}
                className={ui.fieldControl}
              />
            </FormField>

            <FormSection>Product, Environment and Category</FormSection>
            <FormField>
              <FormLabel>Product</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.Product?.Name)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel>Type</FormLabel>
              <input
                type="text"
                readOnly
                value={mapCategoryCodeLabel(detail.CategoryCode)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel>Subcategory</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.SubCategory?.Name)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel>Priority</FormLabel>
              <input
                type="text"
                readOnly
                value={mapPriorityCodeLabel(detail.PriorityCode)}
                className={ui.fieldControl}
              />
            </FormField>

            <FormSection>Case Detail</FormSection>
            <FormField full>
              <FormLabel>Subject</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.Title)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel>Details</FormLabel>
              <textarea
                readOnly
                value={displayValue(detail.Description)}
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>
            <FormField full>
              <FormLabel>Attachment</FormLabel>
              {attachments.length === 0 ? (
                <input
                  type="text"
                  readOnly
                  value="—"
                  className={ui.fieldControl}
                />
              ) : (
                <div className="grid gap-2.5">
                  {attachments.map((attachment, index) => {
                    const fileName = attachment.FileName?.trim() || `Attachment ${index + 1}`;
                    const body = attachment.DocumentBody?.trim() ?? "";
                    const href = body ? toDataUrl(fileName, body) : "";

                    return (
                      <div
                        key={`${fileName}-${index}`}
                        className="rounded-lg border border-[#d7deea] bg-[#f3f6fb] px-3.5 py-3"
                      >
                        {href ? (
                          <a
                            href={href}
                            download={fileName}
                            className="text-[13.5px] font-semibold text-accent underline-offset-2 hover:underline"
                          >
                            {fileName}
                          </a>
                        ) : (
                          <span className="text-[13.5px] font-semibold text-text-1">
                            {fileName}
                          </span>
                        )}
                        {href && isImageFile(fileName) ? (
                          <img
                            src={href}
                            alt={fileName}
                            className="mt-2.5 max-h-52 max-w-full rounded-md border border-border object-contain"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </FormField>
          </FormGrid>
        ) : null}
      </div>
      <ModalActions>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </ModalActions>
    </Modal>
  );
}
