import {
  currentUser,
  mockCaseDetails,
  commentCaseOptions,
} from "../../data/cases";
import {
  FormNote,
  FormGrid,
  FormField,
  FormLabel,
  FormAttach,
  FormSection,
} from "./FormPrimitives";
import { ui } from "../../libs/ui";
import { Button } from "../buttons/Button";
import { useModal } from "../../hooks/useModal";
import { initialComments } from "../../data/comments";
import type { CaseComment } from "../../data/comments";
import { Modal, ModalActions, ModalHead, ModalStatus } from "./Modal";
import { cn, formatStamp, normalizeCaseNumber } from "../../libs/utils";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

export function CaseCommentsModal() {
  const { modal, closeModal } = useModal();
  const open = modal.name === "case-comments";
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [linkedCase, setLinkedCase] = useState("C496");
  const [timestamp, setTimestamp] = useState(formatStamp());
  const [comments, setComments] = useState<CaseComment[]>(initialComments);
  const [status, setStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");

  const filteredOptions = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return commentCaseOptions;
    return commentCaseOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        option.value.toLowerCase().includes(term)
    );
  }, [search]);

  useEffect(() => {
    if (!open) return;
    setStatus("");
    setSearch("");
    setSubject("");
    setDetail("");
    const initial = modal.caseNumber
      ? normalizeCaseNumber(modal.caseNumber)
      : "C496";
    const match = commentCaseOptions.find(
      (option) =>
        option.value === initial ||
        option.label.includes(modal.caseNumber ?? "")
    );
    setLinkedCase(match?.value ?? "C496");
    setTimestamp(formatStamp());
    const timer = window.setTimeout(() => searchRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [modal.caseNumber, open]);

  useEffect(() => {
    if (open) setTimestamp(formatStamp());
  }, [linkedCase, open]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(subject, detail);
    const comment: CaseComment = {
      id: `c-${Date.now()}`,
      email: currentUser.email,
      stamp: formatStamp(),
      subject,
      detail,
    };
    setComments((current) => [comment, ...current]);
    setStatus(
      "Comment added in this mockup. In D365 this would submit to the case comments queue."
    );
    setSubject("");
    setDetail("");
    setTimestamp(formatStamp());
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
                value={linkedCase}
                onChange={(event) => setLinkedCase(event.target.value)}
                className={cn(ui.fieldControl, "cursor-pointer")}
              >
                {filteredOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField full>
              <FormLabel htmlFor="comment-case-details">Case details</FormLabel>
              <textarea
                id="comment-case-details"
                readOnly
                value={mockCaseDetails[linkedCase] ?? ""}
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
                value={currentUser.email}
                readOnly
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="comment-timestamp">Date/time stamp</FormLabel>
              <input
                id="comment-timestamp"
                type="text"
                value={timestamp}
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
            <div className="col-span-full grid gap-2.5 rounded-lg border border-border-soft bg-[#f8fafc] p-3">
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
            </div>
          </FormGrid>
        </div>
        <ModalActions>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add comment
          </Button>
        </ModalActions>
        <ModalStatus>{status}</ModalStatus>
      </form>
    </Modal>
  );
}
