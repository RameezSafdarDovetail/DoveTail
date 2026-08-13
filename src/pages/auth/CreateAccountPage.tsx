import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/buttons/Button";
import {
  FormField,
  FormGrid,
  FormHelp,
  FormLabel,
} from "../../components/popups/FormPrimitives";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { checkEmailExists, loginContact, registerContact } from "../../apis/auth";
import { PasswordField } from "../../components/form/PasswordField";
import { useAuth } from "../../hooks/useAuth";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { paths } from "../../routes/paths";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function CreateAccountPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  function validate() {
    const next = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      retypePassword: "",
    };
    const trimmedEmail = email.trim();

    if (!firstName.trim()) {
      next.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      next.lastName = "Last name is required.";
    }

    if (!trimmedEmail) {
      next.email = "Email is required.";
    } else if (!isValidEmail(trimmedEmail)) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    if (!retypePassword) {
      next.retypePassword = "Retype your password.";
    } else if (retypePassword !== password) {
      next.retypePassword = "Passwords do not match.";
    }

    setFieldErrors(next);
    return Object.values(next).every((value) => !value);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setStatus("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const trimmedEmail = email.trim();
      const existing = await checkEmailExists({ Email: trimmedEmail });
      if (existing.Exists) {
        setFieldErrors((current) => ({
          ...current,
          email: "An account with this email already exists.",
        }));
        return;
      }

      await registerContact({
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        Email: trimmedEmail,
        Password: password,
      });
      const session = await loginContact({
        Email: trimmedEmail,
        Password: password,
      });
      login(session);
      navigate(paths.home, { replace: true });
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5 text-base font-extrabold text-text-1">
            <span className="flex size-7 items-center justify-center rounded-lg bg-accent">
              <svg className="size-3.5" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#fff" strokeWidth="1.8" />
                <path
                  d="M4.5 7h5M7 4.5v5"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Create New Account
          </div>
        </div>

        <div className={ui.formBody}>
          <p className="mb-4 text-[13.5px] leading-normal text-text-2">
            Register for Client Portal access.
          </p>

          <div className="flex flex-col gap-3.5">
            <FormGrid>
              <FormField>
                <FormLabel htmlFor="register-first-name" required>
                  First name
                </FormLabel>
                <input
                  id="register-first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  aria-invalid={Boolean(fieldErrors.firstName)}
                  className={cn(
                    ui.fieldControl,
                    fieldErrors.firstName &&
                      "border-red focus:border-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                  )}
                />
                {fieldErrors.firstName ? (
                  <FormHelp>
                    <span className="text-red">{fieldErrors.firstName}</span>
                  </FormHelp>
                ) : null}
              </FormField>

              <FormField>
                <FormLabel htmlFor="register-last-name" required>
                  Last name
                </FormLabel>
                <input
                  id="register-last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  aria-invalid={Boolean(fieldErrors.lastName)}
                  className={cn(
                    ui.fieldControl,
                    fieldErrors.lastName &&
                      "border-red focus:border-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                  )}
                />
                {fieldErrors.lastName ? (
                  <FormHelp>
                    <span className="text-red">{fieldErrors.lastName}</span>
                  </FormHelp>
                ) : null}
              </FormField>
            </FormGrid>

            <FormField>
              <FormLabel htmlFor="register-email" required>
                Email
              </FormLabel>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                aria-invalid={Boolean(fieldErrors.email)}
                className={cn(
                  ui.fieldControl,
                  fieldErrors.email &&
                    "border-red focus:border-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                )}
              />
              {fieldErrors.email ? (
                <FormHelp>
                  <span className="text-red">{fieldErrors.email}</span>
                </FormHelp>
              ) : null}
            </FormField>

            <FormField>
              <FormLabel htmlFor="register-password" required>
                Password
              </FormLabel>
              <PasswordField
                id="register-password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                aria-invalid={Boolean(fieldErrors.password)}
                invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password ? (
                <FormHelp>
                  <span className="text-red">{fieldErrors.password}</span>
                </FormHelp>
              ) : null}
            </FormField>

            <FormField>
              <FormLabel htmlFor="register-retype-password" required>
                Retype password
              </FormLabel>
              <PasswordField
                id="register-retype-password"
                name="retypePassword"
                autoComplete="new-password"
                value={retypePassword}
                onChange={(event) => setRetypePassword(event.target.value)}
                placeholder="Retype your password"
                aria-invalid={Boolean(fieldErrors.retypePassword)}
                invalid={Boolean(fieldErrors.retypePassword)}
              />
              {fieldErrors.retypePassword ? (
                <FormHelp>
                  <span className="text-red">{fieldErrors.retypePassword}</span>
                </FormHelp>
              ) : null}
            </FormField>
          </div>
          {status ? (
            <div className="mt-3 text-[13px] font-bold text-red">{status}</div>
          ) : null}
        </div>

        <div className={ui.formActions}>
          <Button
            variant="primary"
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full flex-1",
              submitting && "cursor-not-allowed opacity-60"
            )}
          >
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </div>

        <div className="px-5 pb-5 text-center text-[13px] text-text-2">
          Already have an account?{" "}
          <Link
            to={paths.login}
            className="font-semibold text-accent no-underline hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
