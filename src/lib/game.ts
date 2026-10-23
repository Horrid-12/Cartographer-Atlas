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
