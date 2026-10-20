import { HetznerError } from '@/types/hetzner';

export { HetznerError };

export interface HcloudClient {
  get: <T>(path: string) => Promise<T>;
  post: <T>(path: string, body?: unknown) => Promise<T>;
  put: <T>(path: string, body?: unknown) => Promise<T>;
  delete: <T>(path: string) => Promise<T>;
}

export function createClient(token: string, fetchImpl: typeof fetch = fetch): HcloudClient {
  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetchImpl(`https://api.hetzner.cloud/v1${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      const err: HetznerError = Object.assign(new Error(data?.error?.message ?? res.statusText), {
        status: res.status,
        code: data?.error?.code ?? 'unknown',
        details: data?.error?.details,
      }) as HetznerError;
      throw err;
    }
    return data as T;
  }
  return {
    get: <T>(p: string) => request<T>('GET', p),
    post: <T>(p: string, b?: unknown) => request<T>('POST', p, b),
    put: <T>(p: string, b?: unknown) => request<T>('PUT', p, b),
    delete: <T>(p: string) => request<T>('DELETE', p),
  };
}

export function isHetznerError(e: unknown): e is HetznerError {
  return !!e && typeof e === 'object' && 'status' in (e as any) && 'code' in (e as any);
}
