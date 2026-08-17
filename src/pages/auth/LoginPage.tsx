import {
  FormField,
  FormHelp,
  FormLabel,
} from "../../components/popups/FormPrimitives";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { paths } from "../../routes/paths";
import { useAuth } from "../../hooks/useAuth";
import { loginContact } from "../../apis/auth";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/buttons/Button";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { PasswordField } from "../../components/form/PasswordField";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  function validate() {
    const next = { email: "", password: "" };
    const trimmed = email.trim();

    if (!trimmed) {
      next.email = "Email is required.";
    } else if (!isValidEmail(trimmed)) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(next);
    return !next.email && !next.password;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setStatus("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const session = await loginContact({
        Email: email.trim(),
        Password: password,
      });
      login(session);
      navigate(paths.home, { replace: true });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to sign in");
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
            Sign in to Dovetail
          </div>
        </div>

        <div className={ui.formBody}>
          <p className="mb-4 text-[13.5px] leading-normal text-text-2">
            Client Portal access for D365 support cases, quotes and change
            requests.
          </p>

          <div className="flex flex-col gap-3.5">
            <FormField>
              <FormLabel htmlFor="login-email" required>
                Email
              </FormLabel>
              <input
                id="login-email"
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
              <FormLabel htmlFor="login-password" required>
                Password
              </FormLabel>
              <PasswordField
                id="login-password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                aria-invalid={Boolean(fieldErrors.password)}
                invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password ? (
                <FormHelp>
                  <span className="text-red">{fieldErrors.password}</span>
                </FormHelp>
              ) : null}
              <div className="text-right">
                <Link
                  to={paths.forgotPassword}
                  className="text-[12.5px] font-semibold text-accent no-underline hover:underline"
                >
                  Forgot password
                </Link>
              </div>
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
            {submitting ? "Signing in…" : "Login"}
          </Button>
        </div>

        <div className="px-5 pb-5 text-center text-[13px] text-text-2">
          Don&apos;t have an account?{" "}
          <Link
            to={paths.register}
            className="font-semibold text-accent no-underline hover:underline"
          >
            Create New Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
