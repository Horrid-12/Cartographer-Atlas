import { PERSISTENCE_KEY, START_INK, type Progress } from "../lib/game";

const DEFAULT_PROGRESS: Progress = {
  xp: 0,
  ink: START_INK,
  completed: [],
  activeMission: null,
};

function isProgress(value: unknown): value is Progress {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.xp === "number" &&
    Number.isFinite(v.xp) &&
    v.xp >= 0 &&
    typeof v.ink === "number" &&
    Number.isFinite(v.ink) &&
    v.ink >= 0 &&
    Array.isArray(v.completed) &&
    v.completed.every((item) => typeof item === "string") &&
    (v.activeMission === null || typeof v.activeMission === "string")
  );
}

function storage(): Storage | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

export function loadProgress(): Progress {
  const s = storage();
  try {
    if (!s) return { ...DEFAULT_PROGRESS };
    const raw = s.getItem(PERSISTENCE_KEY);
    if (raw === null) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as unknown;
    if (!isProgress(parsed)) return { ...DEFAULT_PROGRESS };
    // Deduplicate completed array for safety
    const uniqueCompleted = Array.from(new Set(parsed.completed));
    return {
      xp: Math.max(0, Math.floor(parsed.xp)),
      ink: Math.max(0, Math.floor(parsed.ink)),
      completed: uniqueCompleted,
      activeMission: parsed.activeMission,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: Progress): void {
  const s = storage();
  if (!s) return;
  try {
    const cleanProgress: Progress = {
      ...progress,
      xp: Math.max(0, Math.round(progress.xp)),
      ink: Math.max(0, Math.round(progress.ink)),
    };
    s.setItem(PERSISTENCE_KEY, JSON.stringify(cleanProgress));
  } catch {
    return;
  }
}

export function resetProgress(): Progress {
  const s = storage();
  if (s) {
    try {
      s.removeItem(PERSISTENCE_KEY);
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  }
  return { ...DEFAULT_PROGRESS };
}
