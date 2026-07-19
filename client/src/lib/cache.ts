type CacheEnvelope<T> = {
  storedAt: number;
  value: T;
};

export function readCache<T>(key: string, maxAgeMs: number): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (!parsed || typeof parsed.storedAt !== "number") return null;

    const ageMs = Date.now() - parsed.storedAt;
    if (ageMs > maxAgeMs) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T) {
  try {
    const envelope: CacheEnvelope<T> = { storedAt: Date.now(), value };
    window.localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Ignore quota/JSON errors; caching is best-effort.
  }
}
