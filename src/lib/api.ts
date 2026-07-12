const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
const PUBLIC_GET_CACHE_TTL_MS = 60_000;

type CacheEntry = {
  expiresAt: number;
  data: unknown;
};

const requestCache = new Map<string, CacheEntry>();

type ApiOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const method = (requestOptions.method || "GET").toUpperCase();
  const canUsePublicCache = method === "GET" && !token;
  const cacheKey = `${method}:${path}`;

  if (canUsePublicCache) {
    const cached = requestCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  if (canUsePublicCache) {
    requestCache.set(cacheKey, {
      expiresAt: Date.now() + PUBLIC_GET_CACHE_TTL_MS,
      data,
    });
  }

  return data as T;
}
