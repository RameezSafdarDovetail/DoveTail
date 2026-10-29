// import { getAuthToken } from "../libs/authSession";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function apiUrl(path = "") {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return normalizedPath ? `${base}/${normalizedPath}` : base;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // const token = getAuthToken();
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return parseApiResponse<T>(response);
}

export async function apiFormRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      // ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return parseApiResponse<T>(response);
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(body || `API request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/** JSON `{ Code, Message }` bodies. Call only after checking the status. */
export function readApiStatusBody(body: string): {
  Code?: string;
  Message?: string;
} | null {
  try {
    const value = JSON.parse(body) as unknown;
    if (!value || typeof value !== "object") return null;
    const record = value as { Code?: unknown; Message?: unknown };
    return {
      Code: typeof record.Code === "string" ? record.Code : undefined,
      Message: typeof record.Message === "string" ? record.Message : undefined,
    };
  } catch {
    return null;
  }
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, text);
  }

  if (response.status === 204 || !text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
