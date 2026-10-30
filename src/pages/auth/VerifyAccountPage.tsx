import {
  FormField,
  FormHelp,
  FormLabel,
} from "../../components/popups/FormPrimitives";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ui } from "../../libs/ui";
import { cn } from "../../libs/utils";
import { paths } from "../../routes/paths";
import { verifyAccessCode } from "../../apis/auth";
import { Button } from "../../components/buttons/Button";
import { ApiError, readApiStatusBody } from "../../apis";
import { useState, type FormEvent } from "react";
import { AuthLayout } from "../../components/layout/AuthLayout";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function valueFromLocation(
  searchValue: string | null,
  state: unknown,
  key: string
) {
  if (searchValue?.trim()) return searchValue.trim();
  if (
    state &&
    typeof state === "object" &&
    key in state &&
    typeof (state as Record<string, unknown>)[key] === "string"
  ) {
    return ((state as Record<string, unknown>)[key] as string).trim();
  }
  return "";
}

export function VerifyAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(() =>
    valueFromLocation(params.get("email"), location.state, "email")
  );
  const [code, setCode] = useState(() =>
    valueFromLocation(
      params.get("code") || params.get("accessCode"),
      location.state,
      "code"
    )
  );
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    code: "",
  });

  function validate() {
    const next = { email: "", code: "" };
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      next.email = "Email is required.";
    } else if (!isValidEmail(trimmedEmail)) {
      next.email = "Enter a valid email address.";
    }

    if (!code.trim()) {
      next.code = "Access code is required.";
    }

    setFieldErrors(next);
    return !next.email && !next.code;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setStatus("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await verifyAccessCode({
        email: email.trim(),
        code: code.trim(),
      });
      navigate(paths.login, { replace: true, state: { activated: true } });
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 400 || error.status === 429)
      ) {
        const body = readApiStatusBody(error.body);
        setStatus(body?.Message || "Unable to verify the access code.");
        return;
      }
      setStatus(
        error instanceof Error ? error.message : "Failed to verify access code"
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
            Verify account
          </div>
        </div>

        <div className={ui.formBody}>
          <p className="mb-4 text-[13.5px] leading-normal text-text-2">
            Enter the access code from your activation email. You only need this
            code once.
          </p>

          <div className="flex flex-col gap-3.5">
            <FormField>
              <FormLabel htmlFor="verify-email" required>
                Email
              </FormLabel>
              <input
                id="verify-email"
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
              <FormLabel htmlFor="verify-code" required>
                Access code
              </FormLabel>
              <input
                id="verify-code"
                name="code"
                type="text"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter your access code"
                aria-invalid={Boolean(fieldErrors.code)}
                className={cn(
                  ui.fieldControl,
                  fieldErrors.code &&
                    "border-red focus:border-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                )}
              />
              {fieldErrors.code ? (
                <FormHelp>
                  <span className="text-red">{fieldErrors.code}</span>
                </FormHelp>
              ) : null}
            </FormField>
          </div>
          {status ? (
            <div className="mt-3 text-[13px] leading-normal font-bold text-red">
              {status}
            </div>
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
            {submitting ? "Verifying…" : "Verify account"}
          </Button>
        </div>

        <div className="px-5 pb-5 text-center text-[13px] text-text-2">
          Already activated?{" "}
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
