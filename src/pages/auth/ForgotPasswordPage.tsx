import {
  FormHelp,
  FormLabel,
  FormField,
} from "../../components/popups/FormPrimitives";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { paths } from "../../routes/paths";
import { useState, type FormEvent } from "react";
import { checkEmailExists } from "../../apis/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/buttons/Button";
import { AuthLayout } from "../../components/layout/AuthLayout";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();

    if (!trimmed) {
      setError("Email is required.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const result = await checkEmailExists({ Email: trimmed });
      if (!result.Exists) {
        setError("No account found for this email. Please contact support.");
        return;
      }

      navigate(paths.updatePassword, {
        replace: true,
        state: { email: trimmed },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify email");
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
            Forgot password
          </div>
        </div>

        <div className={ui.formBody}>
          <p className="mb-4 text-[13.5px] leading-normal text-text-2">
            Enter the email associated with your account and we&apos;ll take you
            to reset your password.
          </p>

          <FormField>
            <FormLabel htmlFor="forgot-email" required>
              Email
            </FormLabel>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              aria-invalid={Boolean(error)}
              className={cn(
                ui.fieldControl,
                error &&
                  "border-red focus:border-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
              )}
            />
            {error ? (
              <FormHelp>
                <span className="text-red">{error}</span>
              </FormHelp>
            ) : null}
          </FormField>
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
            {submitting ? "Checking…" : "Submit"}
          </Button>
        </div>

        <div className="px-5 pb-5 text-center text-[13px] text-text-2">
          Remembered your password?{" "}
          <Link
            to={paths.login}
            className="font-semibold text-accent no-underline hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
