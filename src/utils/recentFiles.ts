import { Store } from "@tauri-apps/plugin-store";

const STORE_FILE = "anydoc-recent.json";
const RECENT_KEY = "recentFiles";
const RECENT_MAX = 10;

export type Recent = { name: string; path: string; ts: number };

async function getStore(): Promise<Store> {
  return Store.load(STORE_FILE);
}

export async function loadRecent(): Promise<Recent[]> {
  try {
    const store = await getStore();
    const raw = (await store.get<any[]>(RECENT_KEY)) ?? [];
    return raw.filter((r): r is Recent => typeof r?.path === "string" && typeof r?.name === "string");
  } catch (e) {
    console.error("Failed to load recent files:", e);
    return [];
  }
}

export async function pushRecent(name: string, path: string): Promise<void> {
  try {
    const store = await getStore();
    const current = (await store.get<Recent[]>(RECENT_KEY)) ?? [];
    const next = [{ name, path, ts: Date.now() }, ...current.filter((r) => r.path !== path)].slice(0, RECENT_MAX);
    await store.set(RECENT_KEY, next);
    await store.save();
  } catch (e) {
    console.error("Failed to save recent files:", e);
  }
}
