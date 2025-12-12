import { authClient } from "@/lib/auth-client";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Récupère les cookies de session Better Auth
 * (contenu sécurisé stocké par le plugin Expo)
 */
async function getSessionCookies(): Promise<string | null> {
  try {
    const cookies = authClient.getCookie();
    return cookies || null;
  } catch (e) {
    console.warn("Failed to get Better Auth cookies:", e);
    return null;
  }
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: any,
  params?: Record<string, any>
): Promise<T> {
  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const cookies = await getSessionCookies();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(cookies ? { Cookie: cookies } : {}),
  };

  // On omet credentials: 'include' car on gère le Cookie manuellement
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API Error ${res.status} (${res.statusText}): ${text || "Unknown"}`
    );
  }

  if (res.status === 204) return null as T;

  return (await res.json()) as T;
}

// Export helpers
export const api = {
  get: <T>(url: string, params?: any) =>
  request<T>("GET", url, undefined, params),
  post: <T>(url: string, body?: any) => request<T>("POST", url, body),
  put: <T>(url: string, body?: any) => request<T>("PUT", url, body),
  delete: <T>(url: string) => request<T>("DELETE", url),
};
