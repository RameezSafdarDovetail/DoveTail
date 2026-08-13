import {
  products,
  categories,
  environments,
  categoryOptions,
  categoryOptionValues,
} from "../../data/cases";
import {
  FormHelp,
  FormGrid,
  FormLabel,
  FormField,
  FormSection,
} from "./FormPrimitives";
import {
  createCase,
  getActiveAccounts,
  type ActiveAccount,
} from "../../apis/getActiveCases";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { Button } from "../buttons/Button";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { Modal, ModalActions, ModalHead, ModalStatus } from "./Modal";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

export function LogCaseModal() {
  const { user } = useAuth();
  const { modal, closeModal } = useModal();
  const open = modal.name === "log-case";
  const userEmail = user?.Email ?? "";
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<ActiveAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [personResponsible, setPersonResponsible] = useState(userEmail);
  const responsibleRef = useRef<HTMLInputElement>(null);

  const subcategoryOptions = useMemo(
    () => (category ? categoryOptions[category] ?? [] : []),
    [category]
  );

  useEffect(() => {
    if (!open) return;
    setStatus("");
    setCategory("");
    setSubcategory("");
    setSubmitting(false);
    setSelectedAccount("");
    setPersonResponsible(userEmail);

    let cancelled = false;

    async function loadAccounts() {
      setAccountsLoading(true);
      try {
        const data = await getActiveAccounts();
        if (!cancelled) {
          setAccounts(data);
          setSelectedAccount(data[0]?.Id ?? "");
        }
      } catch (error) {
        if (!cancelled) {
          setAccounts([]);
          setSelectedAccount("");
          setStatus(
            error instanceof Error ? error.message : "Failed to load accounts"
          );
        }
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    }

    void loadAccounts();

    const timer = window.setTimeout(() => responsibleRef.current?.focus(), 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, userEmail]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const selectedCategory = String(form.get("category") ?? "");
    const payload = {
      Subject: String(form.get("subject") ?? ""),
      Details: String(form.get("details") ?? ""),
      AccountId: String(form.get("account") ?? ""),
      Product: String(form.get("product") ?? ""),
      CategoryOptionValue: categoryOptionValues[selectedCategory] ?? 0,
      SubCategory: String(form.get("subcategory") ?? ""),
      PersonResponsible: String(form.get("personResponsible") ?? ""),
      ClientReference: String(form.get("clientReference") ?? ""),
    };

    setSubmitting(true);
    try {
      await createCase(payload);
      setStatus("Case created successfully");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Failed to create case"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} labelledBy="log-case-title" onClose={closeModal}>
      <form onSubmit={onSubmit}>
        <ModalHead
          titleId="log-case-title"
          title="Submit a case"
          onClose={closeModal}
          closeLabel="Close Log Case form"
        />
        <div className={ui.formBody}>
          <FormGrid>
            <FormSection>User and Account</FormSection>
            <FormField>
              <FormLabel htmlFor="case-logged-by">Case logged by</FormLabel>
              <input
                id="case-logged-by"
                name="loggedBy"
                type="email"
                value={userEmail}
                readOnly
                className={ui.fieldControl}
              />
              <FormHelp locked>Auto-populated from logged-in user.</FormHelp>
            </FormField>
            <FormField>
              <FormLabel htmlFor="case-person-responsible">
                Person responsible
              </FormLabel>
              <input
                ref={responsibleRef}
                id="case-person-responsible"
                name="personResponsible"
                type="email"
                value={personResponsible}
                onChange={(event) => setPersonResponsible(event.target.value)}
                className={ui.fieldControl}
              />
              <FormHelp>
                Change this when logging on behalf of another user.
              </FormHelp>
            </FormField>
            <FormField>
              <FormLabel htmlFor="case-account" required>
                Account
              </FormLabel>
              <select
                id="case-account"
                name="account"
                required
                disabled={accountsLoading || accounts.length === 0}
                value={selectedAccount}
                onChange={(event) => setSelectedAccount(event.target.value)}
                className={cn(ui.fieldControlWhite, "cursor-pointer")}
              >
                {accountsLoading ? (
                  <option value="">Loading accounts…</option>
                ) : accounts.length === 0 ? (
                  <option value="">No accounts available</option>
                ) : (
                  accounts.map((account) => (
                    <option key={account.Id} value={account.Id}>
                      {account.Name}
                    </option>
                  ))
                )}
              </select>
              <FormHelp>CRM-authorized accounts only.</FormHelp>
            </FormField>
            <FormField>
              <FormLabel htmlFor="case-client-ref">
                Client reference / Freshdesk reference
              </FormLabel>
              <input
                id="case-client-ref"
                name="clientReference"
                type="text"
                placeholder="Optional reference number"
                className={ui.fieldControl}
              />
            </FormField>

            <FormSection>Product, Environment and Category</FormSection>
            <FormField>
              <FormLabel htmlFor="case-product" required>
                Product
              </FormLabel>
              <select
                id="case-product"
                name="product"
                required
                defaultValue=""
                className={cn(ui.fieldControlWhite, "cursor-pointer")}
              >
                <option value="">-- Select product from CRM --</option>
                {products.map((product) => (
                  <option key={product}>{product}</option>
                ))}
              </select>
              <FormHelp>Product list sourced from CRM.</FormHelp>
            </FormField>
            <FormField>
              <FormLabel htmlFor="case-environment" required>
                Environment affected
              </FormLabel>
              <select
                id="case-environment"
                name="environment"
                required
                defaultValue=""
                className={cn(ui.fieldControlWhite, "cursor-pointer")}
              >
                <option value="">-- Select environment --</option>
                {environments.map((environment) => (
                  <option key={environment}>{environment}</option>
                ))}
              </select>
            </FormField>
            <FormField>
              <FormLabel htmlFor="case-category" required>
                Category
              </FormLabel>
              <select
                id="case-category"
                name="category"
                required
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setSubcategory("");
                }}
                className={cn(ui.fieldControlWhite, "cursor-pointer")}
              >
                <option value="">-- Select category --</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField>
              <FormLabel htmlFor="case-subcategory" required>
                Subcategory
              </FormLabel>
              <select
                id="case-subcategory"
                name="subcategory"
                required
                disabled={!category}
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
                className={cn(ui.fieldControlWhite, "cursor-pointer")}
              >
                <option value="">
                  {category
                    ? "-- Select subcategory --"
                    : "Select a category first"}
                </option>
                {subcategoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FormHelp>Enabled after a category is selected.</FormHelp>
            </FormField>

            <FormSection>Case Detail</FormSection>
            <FormField full>
              <FormLabel htmlFor="case-subject" required>
                Subject
              </FormLabel>
              <input
                id="case-subject"
                name="subject"
                type="text"
                placeholder="Brief description of the issue"
                required
                className={ui.fieldControl}
              />
            </FormField>
            <FormField full>
              <FormLabel htmlFor="case-details" required>
                Details
              </FormLabel>
              <textarea
                id="case-details"
                name="details"
                placeholder="Describe the issue in detail, including steps to reproduce..."
                required
                className={cn(ui.fieldControl, ui.fieldTextarea)}
              />
            </FormField>
            <FormField full>
              <label
                htmlFor="case-attachments"
                className="flex w-fit cursor-pointer items-center gap-2.5 text-sm font-bold text-text-1"
              >
                <span className="text-lg text-text-1">+</span>
                Add attachments
              </label>
              <input
                id="case-attachments"
                name="attachments"
                type="file"
                multiple
                className={ui.fieldControlWhite}
              />
            </FormField>
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
            {submitting ? "Submitting…" : "Submit case"}
          </Button>
        </ModalActions>
        <ModalStatus>{status}</ModalStatus>
      </form>
    </Modal>
  );
}
