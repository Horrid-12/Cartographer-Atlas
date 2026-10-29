import { describe, it, expect, beforeEach } from "vitest";
import { loadProgress, saveProgress, resetProgress } from "./state";
import { PERSISTENCE_KEY, START_INK } from "../lib/game";

function makeStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  } as Storage;
}

describe("state", () => {
  beforeEach(() => {
    (globalThis as { localStorage: Storage }).localStorage = makeStorage();
  });

  it("returns default progress when storage is empty", () => {
    const p = loadProgress();
    expect(p).toEqual({ xp: 0, ink: START_INK, completed: [], activeMission: null });
  });

  it("saves and loads progress", () => {
    saveProgress({ xp: 120, ink: 3, completed: ["m1"], activeMission: "m1" });
    expect(loadProgress()).toEqual({ xp: 120, ink: 3, completed: ["m1"], activeMission: "m1" });
  });

  it("falls back to default on corrupt data", () => {
    localStorage.setItem(PERSISTENCE_KEY, "{not json");
    expect(loadProgress()).toEqual({ xp: 0, ink: START_INK, completed: [], activeMission: null });
  });

  it("falls back to default on invalid shape", () => {
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify({ xp: "x" }));
    expect(loadProgress()).toEqual({ xp: 0, ink: START_INK, completed: [], activeMission: null });
  });

  it("resetProgress clears storage and returns default", () => {
    saveProgress({ xp: 50, ink: 1, completed: ["m1"], activeMission: "m1" });
    const p = resetProgress();
    expect(p).toEqual({ xp: 0, ink: START_INK, completed: [], activeMission: null });
    expect(localStorage.getItem(PERSISTENCE_KEY)).toBeNull();
  });

  it("preserves ink at 0 without inflating back to START_INK", () => {
    saveProgress({ xp: 100, ink: 0, completed: ["1"], activeMission: "2" });
    const p = loadProgress();
    expect(p.ink).toBe(0);
  });

  it("loadProgress after resetProgress returns START_INK", () => {
    saveProgress({ xp: 50, ink: 0, completed: ["1"], activeMission: "2" });
    resetProgress();
    const p = loadProgress();
    expect(p).toEqual({ xp: 0, ink: START_INK, completed: [], activeMission: null });
  });
});
