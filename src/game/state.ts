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
    typeof v.ink === "number" &&
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
    return {
      xp: parsed.xp,
      ink: parsed.ink,
      completed: [...parsed.completed],
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
    s.setItem(PERSISTENCE_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage failures
  }
}

export function resetProgress(): Progress {
  const s = storage();
  if (s) {
    try {
      s.removeItem(PERSISTENCE_KEY);
    } catch {
      // ignore
    }
  }
  return { ...DEFAULT_PROGRESS };
}
