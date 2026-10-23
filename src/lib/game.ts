/**
 * The Cartographer's Atlas — Core Game Engine
 *
 * Pure TypeScript domain logic. No React, no DOM, no I/O.
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

export const START_INK = 5;
export const INK_REWARD = 2;
export const HINT_INK_COST = 1;
export const HINT_SCORE_COST = 15;
export const SPEED_BONUS_CAP_SEC = 60;
export const SPEED_PER_SEC = 2;
export const ATTEMPT_PENALTY = 10;
export const PERSISTENCE_KEY = "atlas-progress-v1";

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
      "The key is a number from 1 to 25. Try turning the wheel both ways.",
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
      "The key is a number from 1 to 25. Try turning the wheel both ways.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "The key sits almost exactly halfway through the alphabet — turn the wheel 13 steps.",
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
      "The key is a number from 1 to 25. Try turning the wheel both ways.",
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
      "The key is a number from 1 to 25. Try turning the wheel both ways.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "Count the fingers on one hand — that small number is your key.",
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
      "The key is a number from 1 to 25. Try turning the wheel both ways.",
      "In English, the letter 'E' shows up the most. Find the most common letter in the scrambled message — it's probably 'E'.",
      "The key is a single digit just under ten — one less than the number of fingers you have.",
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
      "The key is a number from 1 to 25. Try turning the wheel both ways.",
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
 * first, minus 15 pts per hint used. The result is clamped so a score can
 * never drop below 0.
 */
export function scoreMission(
  mission: Mission,
  attempts: number,
  hintsUsed: number,
  timeSec: number,
): number {
  const time = Number.isFinite(timeSec) ? timeSec : Infinity;
  const speedBonus = Math.max(0, SPEED_BONUS_CAP_SEC - time) * SPEED_PER_SEC;
  const attemptPenalty = (attempts - 1) * ATTEMPT_PENALTY;
  const hintPenalty = hintsUsed * HINT_SCORE_COST;

  return Math.max(0, mission.xp + speedBonus - attemptPenalty - hintPenalty);
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
