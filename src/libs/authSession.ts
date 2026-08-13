export interface AuthUser {
  Token: string;
  ContactId: string;
  Email: string;
  Name: string;
}

const AUTH_STORAGE_KEY = "dovetail.auth.session";

function isTokenValid(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as {
      exp?: number;
    };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const session = value as AuthUser;
  return Boolean(
    session.Token &&
      session.ContactId &&
      session.Email &&
      session.Name &&
      isTokenValid(session.Token)
  );
}

export function readAuthSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isAuthUser(parsed)) {
      clearAuthSession();
      return null;
    }
    return parsed;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function writeAuthSession(user: AuthUser) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthToken() {
  return readAuthSession()?.Token ?? null;
}
