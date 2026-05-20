const BASE = '/api'

type ApiOptions = {
  token?: string | null
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

function authHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiGet<T>(path: string, options?: ApiOptions): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(options?.token),
  })
  return handleResponse<T>(res)
}

export async function apiPost<TReq, TRes>(
  path: string,
  body: TReq,
  options?: ApiOptions,
): Promise<TRes> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(options?.token),
    },
    body: JSON.stringify(body),
  })
  return handleResponse<TRes>(res)
}

export async function apiDelete(path: string, options?: ApiOptions): Promise<void> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: authHeaders(options?.token),
  })
  if (!res.ok) {
    throw new Error(`DELETE ${path} → HTTP ${res.status}`)
  }
}
