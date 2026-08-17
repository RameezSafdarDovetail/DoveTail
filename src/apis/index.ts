// import { getAuthToken } from "../libs/authSession";

export const API_BASE_URL =
  "https://dev-clientportalapi-fapp-hahgf6efb8cvhxfv.eastus-01.azurewebsites.net/api/";

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

async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || `API request failed (${response.status}): ${response.statusText}`
    );
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
