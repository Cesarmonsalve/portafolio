/**
 * Helper to load data from DB (via /api/data) with localStorage fallback.
 * This solves the cross-device sync issue: every admin component
 * should use this instead of reading localStorage directly.
 */
export async function loadFromDB<T>(key: string, fallback: T): Promise<T> {
  // 1. Try the server/DB first
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data[key] !== undefined) {
        // Also update localStorage so it stays in sync
        localStorage.setItem(key, JSON.stringify(json.data[key]));
        return json.data[key] as T;
      }
    }
  } catch (e) {
    console.warn(`[loadFromDB] Could not fetch from API for key "${key}", falling back to local.`);
  }

  // 2. Fallback to localStorage
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      // For arrays, only return if non-empty
      if (Array.isArray(parsed)) {
        return (parsed.length > 0 ? parsed : fallback) as T;
      }
      return parsed as T;
    }
  } catch { /* ignore parse errors */ }

  // 3. Return fallback
  return fallback;
}
