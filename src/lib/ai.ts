/**
 * The Cartographer's Atlas — AI Hint Hook
 *
 * Provides the graduated hint ladder for missions.
 * Mid tiers narrow the search without giving the answer away; only the
 * final tier reveals the exact number of shifts needed to decode the cipher.
 */

import type { Mission } from "./game";

const NO_FURTHER_CLUES = "These archives hold no further clues.";

/**
 * Returns the clue for tier `hintIndex` of the mission's hint ladder.
 *
 * - Out-of-range indices (including negatives) return a neutral fallback that
 *   never leaks the shift value.
 * - The final tier (`hints.length - 1`) returns the authored hint plus the
 *   archival record stating the exact shift.
 * - Mid tiers return the authored hint only.
 */
export function getClue(mission: Mission, hintIndex: number): string {
  const lastIndex = mission.hints.length - 1;

  if (!Number.isInteger(hintIndex) || hintIndex < 0 || hintIndex > lastIndex) {
    return NO_FURTHER_CLUES;
  }

  const authored = mission.hints[hintIndex] ?? NO_FURTHER_CLUES;

  if (hintIndex === lastIndex) {
    return `${authored}\n\nArchival Cipher Record: Exactly ${mission.shift} shifts are needed to decode this message.`;
  }

  return authored;
}
