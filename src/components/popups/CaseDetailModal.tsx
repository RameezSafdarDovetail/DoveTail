import {
  getCaseDetailByID,
  mapCategoryCodeLabel,
  mapPriorityCodeLabel,
  type CaseDetail,
} from "../../apis/cases";
import { ui } from "../../libs/ui";
import { cn, formatStamp } from "../../libs/utils";
import { Button } from "../buttons/Button";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal, ModalActions, ModalHead } from "./Modal";
import { getPortalComments, type PortalComment } from "../../apis/comments";
import { FormField, FormGrid, FormLabel, FormSection } from "./FormPrimitives";

const COMMENTS_PAGE_SIZE = 10;

const remarkNavButton =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-accent bg-accent-soft text-xl leading-none font-semibold text-accent shadow-[0_0_0_3px_rgba(26,86,219,0.10)] transition-[background-color,box-shadow] duration-150 hover:bg-[#e4ecfb] hover:shadow-[0_0_0_3px_rgba(26,86,219,0.18)] disabled:cursor-not-allowed disabled:border-border disabled:bg-[#f3f6fb] disabled:text-text-3 disabled:shadow-none";

function commentTitle(comment: PortalComment) {
  return comment.Title ?? comment.Subject ?? comment.CommentSubject ?? "";
}

function commentDescription(comment: PortalComment) {
  return (
    comment.Description ?? comment.CommentDetail ?? comment.Detail ?? ""
  );
}

function commentCreatedOn(comment: PortalComment) {
  const value = comment.CreatedOn?.trim();
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return formatStamp(date);
}

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
  const { user } = useAuth();
  const contactId = user?.ContactId ?? "";
  const { modal, closeModal } = useModal();
  const open = modal.name === "case-detail";
  const caseId = modal.caseId ?? "";
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<PortalComment[]>([]);
  const [commentIndex, setCommentIndex] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [commentsHasMore, setCommentsHasMore] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsLoadingMore, setCommentsLoadingMore] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const commentsRequestRef = useRef(0);

  useEffect(() => {
    if (!open || !caseId) {
      setDetail(null);
      setLoading(false);
      setError("");
      setComments([]);
      setCommentIndex(0);
      setCommentsPage(1);
      setCommentsTotal(0);
      setCommentsHasMore(false);
      setCommentsLoading(false);
      setCommentsLoadingMore(false);
      setCommentsError("");
      return;
    }

    const requestId = ++commentsRequestRef.current;
    let cancelled = false;
    setLoading(true);
    setError("");
    setDetail(null);
    setComments([]);
    setCommentIndex(0);
    setCommentsPage(1);
    setCommentsTotal(0);
    setCommentsHasMore(false);
    setCommentsError("");

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

    if (!contactId) {
      setCommentsLoading(false);
      setCommentsError("Missing contact id. Please sign in again.");
    } else {
      setCommentsLoading(true);
      void getPortalComments(caseId, contactId, 1, COMMENTS_PAGE_SIZE)
        .then((page) => {
          if (cancelled || commentsRequestRef.current !== requestId) return;
          setComments(page.Data ?? []);
          setCommentsPage(page.Page || 1);
          setCommentsTotal(page.TotalRecords ?? page.Data?.length ?? 0);
          setCommentsHasMore(Boolean(page.HasMore));
        })
        .catch((err) => {
          if (!cancelled && commentsRequestRef.current === requestId) {
            setCommentsError(
              err instanceof Error ? err.message : "Failed to load remarks"
            );
          }
        })
        .finally(() => {
          if (!cancelled && commentsRequestRef.current === requestId) {
            setCommentsLoading(false);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [open, caseId, contactId]);

  async function showNextRemark() {
    if (commentIndex < comments.length - 1) {
      setCommentIndex((current) => current + 1);
      return;
    }
    if (!commentsHasMore || commentsLoadingMore || !contactId || !caseId) return;

    const requestId = commentsRequestRef.current;
    const nextPage = commentsPage + 1;
    const loadedCount = comments.length;
    setCommentsLoadingMore(true);
    setCommentsError("");
    try {
      const page = await getPortalComments(
        caseId,
        contactId,
        nextPage,
        COMMENTS_PAGE_SIZE
      );
      if (commentsRequestRef.current !== requestId) return;
      const nextComments = page.Data ?? [];
      setComments((current) => [...current, ...nextComments]);
      setCommentsPage(page.Page || nextPage);
      setCommentsTotal(page.TotalRecords ?? commentsTotal);
      setCommentsHasMore(Boolean(page.HasMore));
      if (nextComments.length > 0) {
        setCommentIndex(loadedCount);
      }
    } catch (err) {
      if (commentsRequestRef.current !== requestId) return;
      setCommentsError(
        err instanceof Error ? err.message : "Failed to load remarks"
      );
    } finally {
      setCommentsLoadingMore(false);
    }
  }

  const currentComment = comments[commentIndex] ?? null;
  const canShowPrevious = commentIndex > 0;
  const canShowNext =
    commentIndex < comments.length - 1 ||
    (commentsHasMore && !commentsLoadingMore);

  const attachments =
    detail?.Attachments?.filter((item) => item.DocumentBody || item.FileName) ??
    [];

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
          <div className="py-6 text-[13px] text-text-3">
            Loading case details…
          </div>
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
              <FormLabel>Category</FormLabel>
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
              <FormLabel>Status</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.Status)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel>Title</FormLabel>
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
                    const fileName =
                      attachment.FileName?.trim() || `Attachment ${index + 1}`;
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

            <FormSection>Comment</FormSection>
            <FormField full>
              <FormLabel>Comment subject</FormLabel>
              <input
                type="text"
                readOnly
                value={displayValue(detail.CommentSubject)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel>Comment detail</FormLabel>
              <textarea
                readOnly
                value={displayValue(detail.CommentDetail)}
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>

            <FormSection>Remarks by Support</FormSection>
            <FormField full>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[12.5px] text-text-3">
                  {commentsTotal > 0
                    ? `${commentIndex + 1} of ${commentsTotal}`
                    : ""}
                </span>
                {commentsTotal > 1 || commentsHasMore ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!canShowPrevious}
                      onClick={() =>
                        setCommentIndex((current) => Math.max(0, current - 1))
                      }
                      aria-label="Previous remark"
                      className={remarkNavButton}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      disabled={!canShowNext}
                      onClick={() => void showNextRemark()}
                      aria-label="Next remark"
                      className={remarkNavButton}
                    >
                      ›
                    </button>
                  </div>
                ) : null}
              </div>
              {commentsLoading ? (
                <div className="py-2 text-[13px] text-text-3">
                  Loading remarks…
                </div>
              ) : null}
              {commentsError ? (
                <div className="py-2 text-[13px] font-semibold text-red">
                  {commentsError}
                </div>
              ) : null}
              {!commentsLoading && !commentsError && !currentComment ? (
                <div className="py-2 text-[13px] text-text-3">
                  No remarks from support.
                </div>
              ) : null}
              {currentComment ? (
                <div className="grid gap-3">
                  <div>
                    <FormLabel>Title</FormLabel>
                    <input
                      type="text"
                      readOnly
                      value={displayValue(commentTitle(currentComment))}
                      className={ui.fieldControl}
                    />
                  </div>
                  <div>
                    <FormLabel>Description</FormLabel>
                    <textarea
                      readOnly
                      value={displayValue(commentDescription(currentComment))}
                      className={cn(ui.fieldControl, ui.fieldTextarea)}
                    />
                  </div>
                  <div>
                    <FormLabel>Created on</FormLabel>
                    <input
                      type="text"
                      readOnly
                      value={commentCreatedOn(currentComment)}
                      className={ui.fieldControl}
                    />
                  </div>
                </div>
              ) : null}
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
