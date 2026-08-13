import {
  FormNote,
  FormGrid,
  FormField,
  FormLabel,
  FormAttach,
  FormSection,
} from "./FormPrimitives";
import {
  updateCaseComment,
  getCaseChangeRequestInfo,
  type CaseChangeRequestInfo,
} from "../../apis/getActiveCases";
import { ui } from "../../libs/ui";
import { Button } from "../buttons/Button";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { Modal, ModalActions, ModalHead, ModalStatus } from "./Modal";
import { cn, formatStamp, normalizeCaseNumber } from "../../libs/utils";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

export function CaseCommentsModal() {
  const { user } = useAuth();
  const userEmail = user?.Email ?? "";
  const { modal, closeModal } = useModal();
  const open = modal.name === "case-comments";
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [linkedCase, setLinkedCase] = useState("");
  const [status, setStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cases, setCases] = useState<CaseChangeRequestInfo[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);

  const filteredCases = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return cases;
    return cases.filter(
      (item) =>
        item.CaseNumber.toLowerCase().includes(term) ||
        (item.LinkedCaseDetails ?? "").toLowerCase().includes(term) ||
        (item.Account ?? "").toLowerCase().includes(term)
    );
  }, [cases, search]);

  const selectedCase = useMemo(
    () => cases.find((item) => item.CaseNumber === linkedCase) ?? null,
    [cases, linkedCase]
  );

  useEffect(() => {
    if (!open) return;
    setStatus("");
    setSearch("");
    setSubject("");
    setDetail("");
    setLinkedCase("");
    setCases([]);
    setSubmitting(false);

    let cancelled = false;

    async function loadCases() {
      setCasesLoading(true);
      try {
        const data = await getCaseChangeRequestInfo();
        if (cancelled) return;
        setCases(data);
        const initial = modal.caseNumber
          ? normalizeCaseNumber(modal.caseNumber)
          : "";
        const match = data.find(
          (item) =>
            item.CaseNumber === initial ||
            item.CaseNumber.includes(modal.caseNumber ?? "") ||
            item.CaseId === modal.caseNumber
        );
        setLinkedCase(match?.CaseNumber ?? "");
      } catch (error) {
        if (!cancelled) {
          setCases([]);
          setStatus(
            error instanceof Error ? error.message : "Failed to load cases"
          );
        }
      } finally {
        if (!cancelled) setCasesLoading(false);
      }
    }

    void loadCases();

    const timer = window.setTimeout(() => searchRef.current?.focus(), 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [modal.caseNumber, open]);

  const createdOnStamp = useMemo(() => {
    if (!selectedCase?.CreatedOn) return "";
    const date = new Date(selectedCase.CreatedOn);
    if (Number.isNaN(date.getTime())) return "";
    return formatStamp(date);
  }, [selectedCase?.CreatedOn]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !selectedCase) return;

    setSubmitting(true);
    try {
      await updateCaseComment({
        CaseId: selectedCase.CaseId,
        UserEmail: userEmail,
        CommentSubject: subject,
        CommentDetail: detail,
      });
      setStatus("Comment added successfully");
      setSubject("");
      setDetail("");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Failed to add comment"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} labelledBy="case-comments-title" onClose={closeModal}>
      <form onSubmit={onSubmit}>
        <ModalHead
          titleId="case-comments-title"
          title="Case Comments"
          onClose={closeModal}
          closeLabel="Close Case Comments form"
        />
        <div className={ui.formBody}>
          <FormGrid>
            <FormSection>Find Existing Case</FormSection>
            <FormField full>
              <FormLabel htmlFor="comment-case-search">Search case</FormLabel>
              <input
                ref={searchRef}
                id="comment-case-search"
                type="search"
                placeholder="Search by case number, client reference or keywords"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel htmlFor="comment-linked-case" required>
                Case number
              </FormLabel>
              <select
                id="comment-linked-case"
                required
                disabled={casesLoading || filteredCases.length === 0}
                value={linkedCase}
                onChange={(event) => setLinkedCase(event.target.value)}
                className={cn(ui.fieldControl, "cursor-pointer")}
              >
                <option value="">
                  {casesLoading ? "Loading cases…" : "-- Select case number --"}
                </option>
                {filteredCases.map((item) => (
                  <option key={item.CaseId} value={item.CaseNumber}>
                    {item.CaseNumber}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField full>
              <FormLabel htmlFor="comment-case-details">Case details</FormLabel>
              <textarea
                id="comment-case-details"
                readOnly
                value={selectedCase?.LinkedCaseDetails ?? ""}
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>

            <FormSection>Add Comment</FormSection>
            <FormNote>
              <strong>Use Case Comments for:</strong> additional information,
              questions, clarifications and attachments. If the comment changes
              requirements, scope, development or billing, support should direct
              the client to a Change Request.
            </FormNote>
            <FormField>
              <FormLabel htmlFor="comment-user-email">User email</FormLabel>
              <input
                id="comment-user-email"
                type="email"
                value={userEmail}
                readOnly
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="comment-timestamp">Date/time stamp</FormLabel>
              <input
                id="comment-timestamp"
                type="text"
                value={createdOnStamp}
                readOnly
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel htmlFor="comment-subject" required>
                Comment subject
              </FormLabel>
              <input
                id="comment-subject"
                type="text"
                placeholder="Short comment subject"
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel htmlFor="comment-detail" required>
                Comment detail
              </FormLabel>
              <textarea
                id="comment-detail"
                placeholder="Add the clarification, update or question for this case."
                required
                value={detail}
                onChange={(event) => setDetail(event.target.value)}
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>
            <FormField full>
              <FormAttach htmlFor="comment-attachments">
                Add comment attachments
              </FormAttach>
              <input
                id="comment-attachments"
                type="file"
                multiple
                className={ui.fieldControl}
              />
            </FormField>
            {/* <div className="col-span-full grid gap-2.5 rounded-lg border border-border-soft bg-[#f8fafc] p-3">
              {comments.map((comment) => (
                <div
                  className="border-b border-border-soft pb-2.5 last:border-b-0 last:pb-0"
                  key={comment.id}
                >
                  <div className="mb-1 text-[11.5px] text-text-3">
                    {comment.email} | {comment.stamp}
                  </div>
                  <strong>{comment.subject}</strong>
                  <div>{comment.detail}</div>
                </div>
              ))}
            </div> */}
          </FormGrid>
        </div>
        <ModalActions>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={submitting || casesLoading}
            className={submitting ? "cursor-not-allowed opacity-60" : undefined}
          >
            {submitting ? "Submitting…" : "Add comment"}
          </Button>
        </ModalActions>
        <ModalStatus>{status}</ModalStatus>
      </form>
    </Modal>
  );
}
