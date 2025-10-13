/**
 * Lightweight HTTP client for the frontend.
 *
 * Reads the base URL from Vite env variable `VITE_API_BASE_URL` and exposes a
 * generic `apiFetch` helper that returns a typed, discriminated response.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Shape of an API response returned by {@link apiFetch}.
 */
export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: { message: string };
}

/**
 * Extra fetch options for {@link apiFetch}.
 *
 * The `json` field, when provided, is serialized as the request body and the
 * `Content-Type` header is set to `application/json` automatically.
 */
export interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  method?: HttpMethod;
  json?: unknown;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * Gets and normalizes the API base URL.
 * @throws If `VITE_API_BASE_URL` is not defined.
 */
function getBaseUrl(): string {
  if (!BASE_URL) {
    // Fail fast with clear guidance
    throw new Error('Missing VITE_API_BASE_URL env variable');
  }
  return BASE_URL.replace(/\/$/, '');
}

/**
 * Performs an HTTP request against the backend API.
 *
 * @typeParam T - Expected JSON-decoded response body shape.
 * @param path - API path, can start with `/` or not.
 * @param options - Fetch options and JSON body convenience.
 * @returns A discriminated {@link ApiResponse} with `ok` and `status` fields.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: HeadersInit = {
    'Accept': 'application/json',
    ...options.headers,
  };

  const init: RequestInit = {
    ...options,
    method: options.method ?? 'GET',
    headers,
  };

  if (options.json !== undefined) {
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
    init.body = JSON.stringify(options.json);
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: { message: err instanceof Error ? err.message : 'Network error' },
    };
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = (isJson ? await response.json().catch(() => undefined) : undefined) as T | undefined;

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: { message: (data as unknown as { message?: string })?.message ?? response.statusText },
      data,
    };
  }

  return { ok: true, status: response.status, data };
}


