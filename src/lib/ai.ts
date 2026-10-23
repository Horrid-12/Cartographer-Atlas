/**
 * The Cartographer's Atlas — AI Hint Hook
 *
 * Provides progressive hint clues for missions.
 * The final clue reveals the exact number of shifts needed to decode the cipher.
 */

import type { Mission } from "./game";

/**
 * Returns the hint stored at `hintIndex` for the given mission.
 * Provides the exact number of shifts needed as the decisive hint.
 */
export function getClue(mission: Mission, hintIndex: number): string {
  if (hintIndex >= mission.hints.length - 1) {
    return `Archival Cipher Record: Exactly ${mission.shift} shifts are needed to decode this message.`;
  }
  return mission.hints[hintIndex] ?? `Number of shifts needed: ${mission.shift}.`;
}
