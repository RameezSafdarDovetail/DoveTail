import {
  FormHelp,
  FormGrid,
  FormNote,
  FormField,
  FormLabel,
  FormAttach,
  FormSection,
} from "./FormPrimitives";
import {
  createChangeRequest,
  getCaseChangeRequestInfo,
  type CaseChangeRequestInfo,
} from "../../apis/changeRequests";
import { ui } from "../../libs/ui";
import { Button } from "../buttons/Button";
import { useModal } from "../../hooks/useModal";
import { refreshCaseLists } from "../../libs/queryClient";
import { cn, normalizeCaseNumber } from "../../libs/utils";
import { Modal, ModalActions, ModalHead, ModalStatus } from "./Modal";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

// const SUPPORTING_DOC_OPTIONS = [
//   { value: 1, label: "Screenshot of the required change" },
//   { value: 2, label: "Client report example" },
//   { value: 3, label: "Excel report example / mock-up" },
//   { value: 4, label: "Other" },
// ] as const;

export function ChangeRequestModal() {
  const { modal, closeModal } = useModal();
  const open = modal.name === "change-request";
  const caseMenuRef = useRef<HTMLDivElement>(null);
  const caseSelectRef = useRef<HTMLInputElement>(null);
  const [linkedCase, setLinkedCase] = useState("");
  const [caseQuery, setCaseQuery] = useState("");
  const [caseMenuOpen, setCaseMenuOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(0);
  // const [approvedAt, setApprovedAt] = useState("Not approved yet");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cases, setCases] = useState<CaseChangeRequestInfo[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);

  const selectedCase = useMemo(
    () => cases.find((item) => item.CaseNumber === linkedCase) ?? null,
    [cases, linkedCase]
  );

  const filteredCases = useMemo(() => {
    const term = caseQuery.trim().toLowerCase();
    if (!term) return cases;
    return cases.filter((item) => item.CaseNumber.toLowerCase().includes(term));
  }, [cases, caseQuery]);

  useEffect(() => {
    if (!open) return;
    setStatus("");
    setSubmitting(false);
    // setApprovedAt("Not approved yet");
    setLinkedCase("");
    setCaseQuery("");
    setCaseMenuOpen(false);
    setActiveOption(0);
    setCases([]);

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
        setCaseQuery(match?.CaseNumber ?? "");
      } catch (error) {
        if (!cancelled) {
          setCases([]);
          setStatus(
            error instanceof Error
              ? error.message
              : "Failed to load change request info"
          );
        }
      } finally {
        if (!cancelled) setCasesLoading(false);
      }
    }

    void loadCases();

    const timer = window.setTimeout(() => caseSelectRef.current?.focus(), 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [modal.caseNumber, open]);

  useEffect(() => {
    if (!caseMenuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!caseMenuRef.current?.contains(event.target as Node)) {
        setCaseMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [caseMenuOpen]);

  function selectCase(caseNumber: string) {
    setLinkedCase(caseNumber);
    setCaseQuery(caseNumber);
    setCaseMenuOpen(false);
    setActiveOption(0);
  }

  function onCaseQueryChange(value: string) {
    setCaseQuery(value);
    setCaseMenuOpen(true);
    setActiveOption(0);
    const match = cases.find(
      (item) => item.CaseNumber.toLowerCase() === value.trim().toLowerCase()
    );
    setLinkedCase(match?.CaseNumber ?? "");
  }

  // function approveChangeRequest() {
  //   const approver = document.getElementById(
  //     "cr-approved-by"
  //   ) as HTMLInputElement | null;
  //   if (!approver?.value) {
  //     approver?.focus();
  //     return;
  //   }
  //   setApprovedAt(formatStamp());
  // }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const attachment = form.get("attachments");

    if (!selectedCase?.CaseId) {
      setStatus("Please select a case.");
      return;
    }

    const payload = new FormData();
    payload.append("CaseId", selectedCase.CaseId);
    payload.append("linkedCase", selectedCase.CaseNumber);
    payload.append("changeTitle", String(form.get("changeTitle") ?? ""));
    payload.append("details", String(form.get("details") ?? ""));
    payload.append("ImpactedAreas", String(form.get("impacted") ?? ""));
    payload.append("currentProcess", String(form.get("currentProcess") ?? ""));
    payload.append("justification", String(form.get("justification") ?? ""));

    form
      .getAll("supportingDocs")
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0)
      .forEach((value) => {
        payload.append("SupportingDocumentOptionValues", String(value));
      });

    if (attachment instanceof File && attachment.size > 0) {
      payload.append("attachments", attachment);
    }

    setSubmitting(true);
    try {
      await createChangeRequest(payload);
      setStatus("Change request submitted successfully");
      void refreshCaseLists();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Failed to submit change request"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} labelledBy="change-request-title" onClose={closeModal}>
      <form onSubmit={onSubmit}>
        <ModalHead
          titleId="change-request-title"
          title="Change Request"
          onClose={closeModal}
          closeLabel="Close Change Request form"
        />
        <div className={ui.formBody}>
          <FormGrid>
            <FormSection>Linked Case Information</FormSection>
            <FormField className={caseMenuOpen ? "relative z-30" : undefined}>
              <FormLabel htmlFor="cr-linked-case" required>
                Linked case number
              </FormLabel>
              <div ref={caseMenuRef} className="relative">
                <input
                  ref={caseSelectRef}
                  id="cr-linked-case"
                  name="linkedCase"
                  type="text"
                  role="combobox"
                  aria-expanded={caseMenuOpen}
                  aria-controls="cr-linked-case-list"
                  aria-autocomplete="list"
                  autoComplete="off"
                  required
                  disabled={casesLoading || cases.length === 0}
                  placeholder={
                    casesLoading
                      ? "Loading cases…"
                      : cases.length === 0
                      ? "No cases available"
                      : "Type a case number"
                  }
                  value={caseQuery}
                  onChange={(event) => onCaseQueryChange(event.target.value)}
                  onFocus={(event) => {
                    event.currentTarget.select();
                    if (!casesLoading && cases.length > 0)
                      setCaseMenuOpen(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setCaseMenuOpen(true);
                      setActiveOption((current) =>
                        filteredCases.length === 0
                          ? 0
                          : (current + 1) % filteredCases.length
                      );
                      return;
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setCaseMenuOpen(true);
                      setActiveOption((current) =>
                        filteredCases.length === 0
                          ? 0
                          : (current - 1 + filteredCases.length) %
                            filteredCases.length
                      );
                      return;
                    }
                    if (
                      event.key === "Enter" &&
                      caseMenuOpen &&
                      filteredCases[activeOption]
                    ) {
                      event.preventDefault();
                      selectCase(filteredCases[activeOption].CaseNumber);
                      return;
                    }
                    if (event.key === "Escape") {
                      setCaseMenuOpen(false);
                    }
                  }}
                  className={cn(
                    ui.fieldControl,
                    "cursor-text !border-[rgba(26,86,219,0.35)] !bg-[#f8fbff]"
                  )}
                />
                {caseMenuOpen && !casesLoading && cases.length > 0 ? (
                  <ul
                    id="cr-linked-case-list"
                    role="listbox"
                    className="absolute top-[calc(100%+6px)] right-0 left-0 z-30 max-h-48 overflow-y-auto rounded-[9px] border border-white/56 bg-white py-1 shadow-card"
                  >
                    {filteredCases.length === 0 ? (
                      <li className="px-3.5 py-2 text-[13px] text-text-3">
                        No matching case numbers
                      </li>
                    ) : (
                      filteredCases.map((item, index) => (
                        <li key={item.CaseId} role="presentation">
                          <button
                            type="button"
                            role="option"
                            aria-selected={item.CaseNumber === linkedCase}
                            className={cn(
                              "flex w-full cursor-pointer items-center px-3.5 py-2 text-left font-sans text-[13px] font-medium text-text-2 hover:bg-accent-soft hover:text-accent",
                              (item.CaseNumber === linkedCase ||
                                index === activeOption) &&
                                "bg-accent-soft text-accent"
                            )}
                            onMouseDown={(event) => event.preventDefault()}
                            onMouseEnter={() => setActiveOption(index)}
                            onClick={() => selectCase(item.CaseNumber)}
                          >
                            {item.CaseNumber}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}
              </div>
              <FormHelp>Type a case number to narrow the list.</FormHelp>
            </FormField>
            <FormField>
              <FormLabel htmlFor="cr-number">Change Request Number</FormLabel>
              <input
                id="cr-number"
                name="changeRequestNumber"
                type="text"
                value={selectedCase?.ChangeRequestNumberPreview ?? ""}
                readOnly
                className={ui.fieldControl}
              />
            </FormField>
            {/* <FormField full>
              <FormLabel htmlFor="cr-case-info">Linked case details</FormLabel>
              <textarea
                id="cr-case-info"
                name="linkedCaseInfo"
                readOnly
                value={selectedCase?.LinkedCaseDetails ?? ""}
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
              <FormHelp locked>
                Greyed out because this comes from the linked CRM case.
              </FormHelp>
            </FormField> */}
            <FormField>
              <FormLabel htmlFor="cr-requester-email">
                Requester email
              </FormLabel>
              <input
                id="cr-requester-email"
                name="requesterEmail"
                type="email"
                value={selectedCase?.RequesterEmail ?? ""}
                readOnly
                className={ui.fieldControl}
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="cr-linked-account">Account</FormLabel>
              <input
                id="cr-linked-account"
                name="linkedAccount"
                type="text"
                value={selectedCase?.Account ?? ""}
                readOnly
                className={ui.fieldControl}
              />
            </FormField>

            <FormSection>Change Request Details</FormSection>
            <FormNote>
              <strong>Use Change Request for:</strong> requirement changes,
              development changes, billable modifications and scope changes. Use
              Case Comments for additional information, questions,
              clarifications and attachments.
            </FormNote>
            <FormField full>
              <FormLabel htmlFor="cr-change-title" required>
                Change title
              </FormLabel>
              <input
                id="cr-change-title"
                name="changeTitle"
                type="text"
                placeholder="Short title for the requested change"
                required
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel htmlFor="cr-details" required>
                Detailed description of the change required
              </FormLabel>
              <textarea
                id="cr-details"
                name="details"
                placeholder="Provide complete details of the required change."
                required
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>
            {/* <FormField full>
              <FormLabel htmlFor="cr-impacted" required>
                Other areas impacted by the change
              </FormLabel>
              <textarea
                id="cr-impacted"
                name="impacted"
                placeholder="List reports, screens, functions, integrations, users or processes affected."
                required
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField> */}
            {/* <FormField full>
              <FormLabel required>Supporting documents</FormLabel>
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-2 py-2 max-[640px]:grid-cols-1">
                {SUPPORTING_DOC_OPTIONS.map((option, index) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-[13px] text-text-1"
                  >
                    <input
                      type="checkbox"
                      name="supportingDocs"
                      value={option.value}
                      required={index === 0}
                      className="size-4"
                    />{" "}
                    {option.label}
                  </label>
                ))}
              </div>
            </FormField> */}
            {/* <FormField full>
              <FormLabel htmlFor="cr-other-docs">
                If Other, please specify
              </FormLabel>
              <input
                id="cr-other-docs"
                name="otherDocs"
                type="text"
                placeholder="Describe other supporting documents"
                className={ui.fieldControl}
              />
            </FormField> */}
            <FormField full>
              <FormAttach htmlFor="cr-attachments">Add attachment</FormAttach>
              <input
                id="cr-attachments"
                name="attachments"
                type="file"
                className={ui.fileInput}
              />
              <FormHelp>
                Any file type, such as PDF, Excel, or other documents.
              </FormHelp>
            </FormField>
            {/* <FormField full>
              <FormLabel htmlFor="cr-current-process" required>
                Current process used to handle the requested change
              </FormLabel>
              <textarea
                id="cr-current-process"
                name="currentProcess"
                placeholder="Describe how this is currently handled before the requested change."
                required
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField> */}
            <FormField full>
              <FormLabel htmlFor="cr-justification" required>
                Justification for change request
              </FormLabel>
              <textarea
                id="cr-justification"
                name="justification"
                placeholder="Explain why this change is required and the business benefit."
                required
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>

            {/* <FormSection>Approval Workflow</FormSection>
            <FormNote>
              Change Requests can be submitted before approval. Approval is
              captured as a separate workflow step using email address and
              timestamp.
            </FormNote>
            <div className="col-span-full rounded-lg border border-border-soft bg-[#f8fafc] p-3">
              <div className="grid grid-cols-[1fr_auto] items-end gap-2.5 max-[640px]:grid-cols-1">
                <FormField>
                  <FormLabel htmlFor="cr-approved-by">
                    Approved by (email address)
                  </FormLabel>
                  <input
                    id="cr-approved-by"
                    name="approvedBy"
                    type="email"
                    placeholder="approver@company.com"
                    className={ui.fieldControl}
                  />
                </FormField>
                <Button variant="secondary" onClick={approveChangeRequest}>
                  Approve
                </Button>
              </div>
              <FormField className="mt-2.5">
                <FormLabel htmlFor="cr-approved-at">
                  Approval date/time stamp
                </FormLabel>
                <input
                  id="cr-approved-at"
                  name="approvedAt"
                  type="text"
                  value={approvedAt}
                  readOnly
                  className={ui.fieldControl}
                />
              </FormField>
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
            disabled={submitting}
            className={submitting ? "cursor-not-allowed opacity-60" : undefined}
          >
            {submitting ? "Submitting…" : "Submit change request"}
          </Button>
        </ModalActions>
        <ModalStatus>{status}</ModalStatus>
      </form>
    </Modal>
  );
}
