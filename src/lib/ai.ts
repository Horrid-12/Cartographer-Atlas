/**
 * The Cartographer's Atlas — AI Hint Hook
 *
 * Thin, side-effect-free accessor for mission hints. Kept in its own module
 * so it can later be swapped for an LLM-backed clue generator (or a
 * local/remote API) without touching the UI or the engine.
 */

import type { Mission } from "./game";

/**
 * Returns the hint stored at `hintIndex` for the given mission.
 *
 * Later this may call an LLM API instead; the signature is designed to stay
 * the same when that happens.
 */
export function getClue(mission: Mission, hintIndex: number): string {
  return mission.hints[hintIndex];
}
