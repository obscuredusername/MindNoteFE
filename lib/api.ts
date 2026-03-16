/**
 * Centralised API client.
 *
 * Every module imports from here — base URL is defined once.
 *
 *   import { api } from '@/lib/api'
 *   const res = await api.post('/users/signin', body)
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

type RequestOptions = {
  headers?: Record<string, string>
  signal?: AbortSignal
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('auth-store') || '{}')?.state?.token
      : null

  const headers: Record<string, string> = {
    ...options.headers,
  }

  const isFormData = body instanceof FormData

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData ? (body as any) : body ? JSON.stringify(body) : undefined,
    signal: options.signal,
  })

  // For 204 No Content
  if (res.status === 204) return undefined as T

  const data = await res.json()

  if (!res.ok) {
    const message = data?.detail || `Request failed with status ${res.status}`
    throw new ApiError(message, res.status, data)
  }

  return data as T
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const api = {
  get: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>('GET', path, undefined, opts),

  post: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('POST', path, body, opts),

  patch: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PATCH', path, body, opts),

  put: <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PUT', path, body, opts),

  delete: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>('DELETE', path, undefined, opts),
}
