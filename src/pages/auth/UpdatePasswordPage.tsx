import {
  FormField,
  FormHelp,
  FormLabel,
} from "../../components/popups/FormPrimitives";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { paths } from "../../routes/paths";
import { resetPassword } from "../../apis/auth";
import { Button } from "../../components/buttons/Button";
import { useEffect, useState, type FormEvent } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PasswordField } from "../../components/form/PasswordField";

export function UpdatePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    typeof location.state?.email === "string" ? location.state.email : "";
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    retypePassword: "",
  });

  useEffect(() => {
    if (!email) {
      navigate(paths.forgotPassword, { replace: true });
    }
  }, [email, navigate]);

  function validate() {
    const next = { password: "", retypePassword: "" };

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
    return !next.password && !next.retypePassword;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !email) return;
    setStatus("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await resetPassword({
        Email: email,
        NewPassword: password,
      });
      navigate(paths.login, { replace: true });
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Failed to update password"
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
            Update password
          </div>
        </div>

        <div className={ui.formBody}>
          <p className="mb-4 text-[13.5px] leading-normal text-text-2">
            Choose a new password for your Client Portal account.
          </p>

          <div className="flex flex-col gap-3.5">
            <FormField>
              <FormLabel htmlFor="update-password" required>
                Password
              </FormLabel>
              <PasswordField
                id="update-password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a new password"
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
              <FormLabel htmlFor="update-retype-password" required>
                Retype password
              </FormLabel>
              <PasswordField
                id="update-retype-password"
                name="retypePassword"
                autoComplete="new-password"
                value={retypePassword}
                onChange={(event) => setRetypePassword(event.target.value)}
                placeholder="Retype your new password"
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
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </div>

        <div className="px-5 pb-5 text-center text-[13px] text-text-2">
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
