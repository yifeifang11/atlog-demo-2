export const isBrowser = typeof window !== "undefined";

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage key ${key}`, error);
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function updateJSON<T>(
  key: string,
  updater: (current: T) => T,
  fallback: T
): T {
  const nextValue = updater(readJSON<T>(key, fallback));
  writeJSON(key, nextValue);
  return nextValue;
}
