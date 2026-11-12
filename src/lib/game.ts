/**
 * The Cartographer's Atlas — Core Game Engine
 *
 * Pure TypeScript domain logic + a single localStorage persistence seam.
 * No React, no DOM beyond the guarded storage calls.
 */

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface Mission {
  id: string;
  title: string;
  place: string;
  shift: number;
  plaintext: string;
  xp: number;
  hints: string[];
}

export interface Progress {
  xp: number;
  ink: number;
  completed: string[];
  activeMission: string | null;
}

/* -------------------------------------------------------------------------- */
/*                                 Constants                                  */
/* -------------------------------------------------------------------------- */

export const START_INK = 1;
export const INK_REWARD = 2;
export const SPEED_BONUS_CAP_SEC = 60;
export const SPEED_PER_SEC = 2;
export const ATTEMPT_PENALTY = 10;
export const PERSISTENCE_KEY = "atlas-progress-v1";

/**
 * The graduated hint ladder: three sequential tiers per mission.
 * Higher tiers cost more Ink and carry a steeper score penalty, and each
 * tier must be purchased in order — tier 2 requires tier 1, tier 3 requires
 * tier 2. Tier 3 (the final tier) is the only tier that reveals the exact
 * shift via `getClue`.
 */
export const HINT_TIERS = [
  { ink: 1, score: 10 },
  { ink: 2, score: 20 },
  { ink: 3, score: 35 },
] as const;

/** Ink cost to purchase hint `tier` (0-based). Clamped into the ladder. */
export function hintInkCost(tier: number): number {
  const index = clampTier(tier);
  return HINT_TIERS[index].ink;
}

/** Score penalty for hint `tier` (0-based). Clamped into the ladder. */
export function hintScoreCost(tier: number): number {
  const index = clampTier(tier);
  return HINT_TIERS[index].score;
}

/**
 * Total score penalty for having revealed `revealedCount` tiers
 * (i.e. the sum of every tier purchased so far).
 */
export function hintScorePenaltyFor(revealedCount: number): number {
  const count = Math.max(0, Math.min(HINT_TIERS.length, Math.floor(revealedCount)));
  let total = 0;
  for (let tier = 0; tier < count; tier += 1) {
    total += HINT_TIERS[tier].score;
  }
  return total;
}

/** Ink needed to buy every tier of one mission's ladder (6). */
export function totalHintInk(): number {
  return HINT_TIERS.reduce((sum, tier) => sum + tier.ink, 0);
}

/** Score penalty for buying every tier of one mission's ladder (65). */
export function totalHintScore(): number {
  return HINT_TIERS.reduce((sum, tier) => sum + tier.score, 0);
}

export type HintPurchaseState = {
  /** Current ink reserves. */
  ink: number;
  /** Tiers already purchased for this mission. */
  revealedCount: number;
  /** True while a previous purchase has not committed yet (SUS-014). */
  inFlight: boolean;
};

export type HintPurchaseResult =
  | { ok: true; ink: number; revealedCount: number }
  | { ok: false; reason: "out-of-order" | "already-complete" | "in-flight" | "insufficient-ink" };

/**
 * Sequential purchase decision for the graduated hint ladder.
 *
 * Tiers must be bought in order (tier N requires N tiers already revealed),
 * the ladder has exactly `HINT_TIERS.length` rungs, an in-flight purchase
 * never double-charges (SUS-014), and the tier's Ink cost must be affordable.
 * On success the caller receives the updated `ink` and `revealedCount`.
 */
export function purchaseHintTier(state: HintPurchaseState, tier: number): HintPurchaseResult {
  if (state.inFlight) return { ok: false, reason: "in-flight" };
  if (tier !== state.revealedCount) return { ok: false, reason: "out-of-order" };
  if (tier >= HINT_TIERS.length) return { ok: false, reason: "already-complete" };

  const cost = hintInkCost(tier);
  if (state.ink < cost) return { ok: false, reason: "insufficient-ink" };

  return {
    ok: true,
    ink: state.ink - cost,
    revealedCount: state.revealedCount + 1,
  };
}

function clampTier(tier: number): number {
  if (!Number.isFinite(tier)) return 0;
  const index = Math.floor(tier);
  if (index < 0) return 0;
  if (index >= HINT_TIERS.length) return HINT_TIERS.length - 1;
  return index;
}

/* -------------------------------------------------------------------------- */
/*                               Mission Data                                 */
/* -------------------------------------------------------------------------- */

/**
 * The campaign. Always ordered — unlock checks compare a mission's index
 * against the immediately preceding mission's ID.
 */
export const MISSIONS: Mission[] = [
  {
    id: "1",
    title: "The Old Bridge",
    place: "Cistern",
    shift: 7,
    plaintext: "THE LANTERN BURNS BENEATH THE BRIDGE",
    xp: 100,
    hints: [
      "The key is a number from 1 to 25. Try the shift in both directions — wrapping past Z loops back to A.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "Start near the middle of the first half of the alphabet — halfway between 5 and 10.",
    ],
  },
  {
    id: "2",
    title: "The Sun Clock",
    place: "Meridian",
    shift: 13,
    plaintext: "MEASURE THE SHADOW AT HIGH NOON",
    xp: 150,
    hints: [
      "The key is a number from 1 to 25. Try the shift in both directions — wrapping past Z loops back to A.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "The key sits almost exactly halfway through the alphabet — nearer the middle than either end.",
    ],
  },
  {
    id: "3",
    title: "The Watchtower",
    place: "Tower",
    shift: 3,
    plaintext: "LIGHT THE BEACON WHEN STARS ALIGN",
    xp: 150,
    hints: [
      "The key is a number from 1 to 25. Try the shift in both directions — wrapping past Z loops back to A.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "The key is the smallest you have seen — the very start of the alphabet, what you would try first.",
    ],
  },
  {
    id: "4",
    title: "The River Bank",
    place: "River",
    shift: 5,
    plaintext: "THE KEY IS BURIED NEAR THE RIVER",
    xp: 200,
    hints: [
      "The key is a number from 1 to 25. Try the shift in both directions — wrapping past Z loops back to A.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "The key is smaller than the number of fingers on one hand.",
    ],
  },
  {
    id: "5",
    title: "The North Cave",
    place: "Cave",
    shift: 9,
    plaintext: "FOLLOW THE NORTH STAR TO THE CAVE",
    xp: 200,
    hints: [
      "The key is a number from 1 to 25. Try the shift in both directions — wrapping past Z loops back to A.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "The key is a single digit just under ten.",
    ],
  },
  {
    id: "6",
    title: "The Sand Dunes",
    place: "Desert",
    shift: 11,
    plaintext: "THE TREASURE SLEEPS UNDER THE SAND",
    xp: 250,
    hints: [
      "The key is a number from 1 to 25. Try the shift in both directions — wrapping past Z loops back to A.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "Just past ten — a little over halfway through the first half of the alphabet.",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                               Cipher Engine                                */
/* -------------------------------------------------------------------------- */

const ALPHABET_SIZE = 26;
const UPPERCASE_A = 65; // "A"
const LOWERCASE_A = 97; // "a"

/**
 * Normalises any integer shift into the range [0, 25].
 * Guards against NaN/Infinity so a bad mission record can never corrupt output.
 */
function normalizeShift(shift: number): number {
  if (!Number.isFinite(shift)) return 0;
  return ((Math.trunc(shift) % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
}

/**
 * Applies a Caesar shift to the letters of `text`.
 *
 * - `forward: true`  → A becomes D for a shift of 3.
 * - `forward: false` → D becomes A for a shift of 3.
 *
 * Only ASCII letters are transformed. Case is preserved; spaces, punctuation,
 * digits and every other character pass through untouched. Shifts of any
 * magnitude (including negatives) are wrapped with modulo 26.
 */
export function caesar(text: string, shift: number, forward: boolean): string {
  const offset = forward ? normalizeShift(shift) : -normalizeShift(shift);

  return text.replace(/[a-z]/gi, (character) => {
    const base = character >= "a" ? LOWERCASE_A : UPPERCASE_A;
    const shifted =
      (((character.charCodeAt(0) - base + offset) % ALPHABET_SIZE) + ALPHABET_SIZE) %
        ALPHABET_SIZE +
      base;

    return String.fromCharCode(shifted);
  });
}

/** Encodes a mission's plaintext with its own shift value. */
export function computeCiphertext(mission: Mission): string {
  return caesar(mission.plaintext, mission.shift, true);
}

/** Decodes a ciphertext back to plaintext. */
export function decodeText(ciphertext: string, shift: number): string {
  return caesar(ciphertext, shift, false);
}

/* -------------------------------------------------------------------------- */
/*                             Scoring & Ranks                                */
/* -------------------------------------------------------------------------- */

/**
 * Final score for one solved mission.
 *
 * Base mission XP, plus a speed bonus for every second under the 60 s cap
 * (2 pts/sec, never negative), minus 10 pts for every attempt beyond the
 * first, minus `hintScorePenalty` — the summed score cost of every hint
 * tier purchased from the graduated ladder (10 + 20 + 35 across tiers).
 * The result is clamped so a score can never drop below 0.
 */
export function scoreMission(
  mission: Mission,
  attempts: number,
  hintScorePenalty: number,
  timeSec: number,
): number {
  const time = Number.isFinite(timeSec) ? Math.max(0, Math.floor(timeSec)) : Infinity;
  const speedBonus = Math.max(0, SPEED_BONUS_CAP_SEC - time) * SPEED_PER_SEC;
  const attemptPenalty = (attempts - 1) * ATTEMPT_PENALTY;
  const penalty = Number.isFinite(hintScorePenalty) ? Math.max(0, hintScorePenalty) : 0;

  return Math.round(Math.max(0, mission.xp + speedBonus - attemptPenalty - penalty));
}

/** Title earned at a given XP total. */
export function rankFor(xp: number): string {
  if (xp >= 500) return "Master Cartographer";
  if (xp >= 200) return "Journeyman Surveyor";
  return "Novice Wanderer";
}

/**
 * XP needed for the next rank, or 500 once the top rank is reached.
 */
export function nextRankThreshold(xp: number): number {
  if (xp < 200) return 200;
  return 500;
}

/* -------------------------------------------------------------------------- */
/*                             Level Unlocking                                */
/* -------------------------------------------------------------------------- */

/**
 * A mission is unlocked at index 0, or when the mission immediately before
 * it (by campaign order) has been completed.
 */
export function missionUnlocked(index: number, completed: string[]): boolean {
  if (index <= 0) return true;

  const previous = MISSIONS[index - 1];
  return previous !== undefined && completed.includes(previous.id);
}

/* -------------------------------------------------------------------------- */
/*                        Persistence (localStorage)                          */
/* -------------------------------------------------------------------------- */

/** Fresh state for a brand-new cartographer. */
export function startingProgress(): Progress {
  return { xp: 0, ink: START_INK, completed: [], activeMission: null };
}

/** True when `localStorage` is available in the current environment. */
function storageAvailable(): boolean {
  return typeof localStorage !== "undefined" && localStorage !== null;
}

/**
 * Reads saved progress from localStorage.
 *
 * Returns `startingProgress()` when there is no save, when the JSON is
 * corrupted, or when parsing throws for any reason — a bad save must never
 * crash the UI. A parsed object that is simply outdated (missing fields) is
 * merged over the starting defaults so every field is present.
 */
export function loadProgress(): Progress {
  try {
    if (!storageAvailable()) return startingProgress();

    const raw = localStorage.getItem(PERSISTENCE_KEY);
    if (raw === null) return startingProgress();

    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return startingProgress();
    }

    return { ...startingProgress(), ...(parsed as Partial<Progress>) };
  } catch {
    return startingProgress();
  }
}

/**
 * Writes progress to localStorage under PERSISTENCE_KEY.
 *
 * Silently ignores failures — private-browsing storage limits, quota errors
 * or a missing storage API must never break gameplay.
 */
export function saveProgress(progress: Progress): void {
  try {
    if (!storageAvailable()) return;

    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(progress));
  } catch {
    // Saving is best-effort; play continues without persistence.
  }
}
