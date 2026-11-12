import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { getClue } from "../lib/ai";
import {
  MISSIONS,
  HINT_TIERS,
  hintInkCost,
  hintScoreCost,
  hintScorePenaltyFor,
  totalHintInk,
  totalHintScore,
  purchaseHintTier,
} from "../lib/game";
import {
  isAudioMuted,
  setAudioMuted,
  toggleAudioMute,
  playClick,
  playHintSound,
  playErrorSound,
  playVictoryMusic,
  stopVictoryMusic,
  startBackgroundMusic,
  stopBackgroundMusic,
} from "../lib/audio";
import { VictoryOverlay } from "./VictoryOverlay";
import { MissionPanel } from "./MissionPanel";

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

describe("Audio Engine & Progressive Shift Hints", () => {
  beforeEach(() => {
    (globalThis as unknown as { localStorage: Storage }).localStorage = makeStorage();
    setAudioMuted(false);
  });

  describe("Hint system revealing number of shifts", () => {
    it("reveals the exact number of shifts needed on the decisive final rung", () => {
      const mission1 = MISSIONS[0]; // shift: 7
      const finalIndex = mission1.hints.length - 1;
      const hint = getClue(mission1, finalIndex);
      expect(hint).toContain("Archival Cipher Record");
      expect(hint).toContain(`Exactly ${mission1.shift} shifts`);
    });

    it("reveals the exact number of shifts needed for mission 2 and 3", () => {
      const mission2 = MISSIONS[1]; // shift: 13
      const mission3 = MISSIONS[2]; // shift: 3
      const finalIndex = mission2.hints.length - 1;

      expect(getClue(mission2, finalIndex)).toContain("13 shifts");
      expect(getClue(mission3, finalIndex)).toContain("3 shifts");
    });

    it("does not leak the shift on mid-tier rungs", () => {
      for (const mission of MISSIONS) {
        const finalIndex = mission.hints.length - 1;
        for (let tier = 0; tier < finalIndex; tier += 1) {
          const clue = getClue(mission, tier);
          expect(clue).not.toContain("Archival Cipher Record");
          expect(clue).not.toContain(`Exactly ${mission.shift} shifts`);
          expect(clue).not.toContain(`${mission.shift} steps`);
        }
      }
    });

    it("returns a neutral fallback for out-of-range rungs without leaking the shift", () => {
      const mission1 = MISSIONS[0];
      expect(getClue(mission1, -1)).toBe("These archives hold no further clues.");
      expect(getClue(mission1, 99)).toBe("These archives hold no further clues.");
      expect(getClue(mission1, -1)).not.toContain(`${mission1.shift}`);
    });
  });

  describe("Graduated hint ladder economy", () => {
    it("prices the three rungs at 1/2/3 Ink and 10/20/35 Score XP", () => {
      expect(HINT_TIERS).toEqual([
        { ink: 1, score: 10 },
        { ink: 2, score: 20 },
        { ink: 3, score: 35 },
      ]);
      expect(hintInkCost(0)).toBe(1);
      expect(hintInkCost(1)).toBe(2);
      expect(hintInkCost(2)).toBe(3);
      expect(hintScoreCost(0)).toBe(10);
      expect(hintScoreCost(1)).toBe(20);
      expect(hintScoreCost(2)).toBe(35);
    });

    it("accumulates the score penalty per revealed rung", () => {
      expect(hintScorePenaltyFor(0)).toBe(0);
      expect(hintScorePenaltyFor(1)).toBe(10);
      expect(hintScorePenaltyFor(2)).toBe(30);
      expect(hintScorePenaltyFor(3)).toBe(65);
      // Out-of-range counts clamp to the full ladder
      expect(hintScorePenaltyFor(99)).toBe(65);
      expect(hintScorePenaltyFor(-1)).toBe(0);
    });

    it("makes the full ladder across one mission cost 6 Ink / 65 Score XP", () => {
      expect(totalHintInk()).toBe(6);
      expect(totalHintScore()).toBe(65);
    });
  });

  describe("Audio Mute Control & Playback Safety", () => {
    it("toggles and persists mute state in localStorage", () => {
      expect(isAudioMuted()).toBe(false);
      const muted = toggleAudioMute();
      expect(muted).toBe(true);
      expect(isAudioMuted()).toBe(true);
      expect(localStorage.getItem("atlas-audio-muted-v1")).toBe("true");

      const unmuted = toggleAudioMute();
      expect(unmuted).toBe(false);
      expect(isAudioMuted()).toBe(false);
      expect(localStorage.getItem("atlas-audio-muted-v1")).toBe("false");
    });

    it("safely handles audio calls in headless/DOM environment without throwing", () => {
      expect(() => {
        startBackgroundMusic();
        stopBackgroundMusic();
        playClick();
        playHintSound();
        playErrorSound();
        playVictoryMusic();
        stopVictoryMusic();
      }).not.toThrow();
    });
  });

  describe("Victory Overlay 'All Seals Broken' verification", () => {
    it("displays 'All Seals Broken' prominently when all missions are complete", () => {
      const mission3 = MISSIONS[2];
      const html = renderToString(
        <VictoryOverlay
          mission={mission3}
          isFirstCompletion={true}
          isAllThreeComplete={true}
          onReturnToMap={vi.fn()}
        />
      );

      expect(html).toContain("All Seals Broken");
      expect(html).toContain("All Royal Seals Restored");
    });
  });

  describe("MissionPanel hint ladder rendering", () => {
    function renderPanel(revealedCount: number, ink = 6) {
      return renderToString(
        <MissionPanel
          mission={MISSIONS[0]}
          ink={ink}
          revealedCount={revealedCount}
          onSolve={vi.fn()}
          onUseHint={() => true}
        />
      );
    }

    it("renders Archival Clue Locked initially", () => {
      const html = renderPanel(0);
      expect(html).toContain("Archival Clue Locked");
      // First rung is offered at its own price; later rungs are locked
      expect(html).toContain("Consult Rung 1 (1 Ink)");
      expect(html).toContain("Locked — purchase Rung 1 first.");
      expect(html).toContain("Locked — purchase Rung 2 first.");
      // Nothing revealed yet: no exact shift anywhere
      expect(html).not.toContain(`Exactly ${MISSIONS[0].shift} shifts`);
      // Manual shift controller stays hidden
      expect(html).not.toContain("Clue: Manual Cipher Shift Controller");
    });

    it("reveals mid-tier clue text without leaking the shift", () => {
      const html = renderPanel(1);
      expect(html).toContain(MISSIONS[0].hints[0]);
      expect(html).toContain("Consult Rung 2 (2 Ink)");
      expect(html).toContain("Archival Hint Ladder");
      expect(html).not.toContain(`Exactly ${MISSIONS[0].shift} shifts`);
      expect(html).not.toContain("Clue: Manual Cipher Shift Controller");
    });

    it("unlocks the Manual Shift Controller only after the final rung", () => {
      const html = renderPanel(3);
      expect(html).toContain("Manual Cipher Shift Controller");
      expect(html).toContain("Archival Cipher Record");
      expect(html).toContain(`Exactly ${MISSIONS[0].shift} shifts`);
      expect(html).toContain("Clue Active (Shift Controller)");
      expect(html).not.toContain("Consult Rung");
    });

    it("disables the next purchase when ink is short of the tier cost", () => {
      const html = renderPanel(1, 1); // Rung 2 costs 2 Ink
      expect(html).toContain("Consult Rung 2 (2 Ink)");
      const buttons = html.match(/<button[\s\S]*?<\/button>/g) ?? [];
      const rungTwo = buttons.find((button) => button.includes("Consult Rung 2"));
      expect(rungTwo).toBeDefined();
      expect(rungTwo).toContain('disabled=""');
    });
  });

  describe("Sequential hint purchase guard", () => {
    it("escalates cost per rung: 1, 2, 3 Ink", () => {
      let state = { ink: 6, revealedCount: 0, inFlight: false };

      const first = purchaseHintTier(state, 0);
      expect(first.ok).toBe(true);
      if (first.ok) state = { ...state, ...first };

      const second = purchaseHintTier(state, 1);
      expect(second.ok).toBe(true);
      if (second.ok) state = { ...state, ...second };

      const third = purchaseHintTier(state, 2);
      expect(third.ok).toBe(true);
      if (third.ok) state = { ...state, ...third };

      // 6 Ink spent in total, ladder exhausted
      expect(state.ink).toBe(0);
      expect(state.revealedCount).toBe(3);

      const afterExhausted = purchaseHintTier(state, 3);
      expect(afterExhausted).toEqual({ ok: false, reason: "already-complete" });
    });

    it("rejects out-of-order tiers without charging", () => {
      const state = { ink: 6, revealedCount: 0, inFlight: false };

      expect(purchaseHintTier(state, 1)).toEqual({ ok: false, reason: "out-of-order" });
      expect(purchaseHintTier(state, 2)).toEqual({ ok: false, reason: "out-of-order" });
      expect(state.ink).toBe(6);
      expect(state.revealedCount).toBe(0);

      const afterFirst = purchaseHintTier(state, 0);
      expect(afterFirst.ok).toBe(true);
      const revealed = afterFirst.ok
        ? { ...state, ink: afterFirst.ink, revealedCount: afterFirst.revealedCount }
        : state;

      // Cannot re-buy rung 1 or skip to rung 3
      expect(purchaseHintTier(revealed, 0)).toEqual({ ok: false, reason: "out-of-order" });
      expect(purchaseHintTier(revealed, 2)).toEqual({ ok: false, reason: "out-of-order" });
    });

    it("charges once on a rapid double-click while a purchase is in flight", () => {
      const state = { ink: 3, revealedCount: 0, inFlight: false };

      const firstClick = purchaseHintTier(state, 0);
      expect(firstClick.ok).toBe(true);

      // App raises the in-flight flag the moment the first charge commits;
      // a second click landing before React re-renders must not charge again.
      const inFlight = purchaseHintTier({ ...state, inFlight: true }, 0);
      expect(inFlight).toEqual({ ok: false, reason: "in-flight" });
      expect(state.ink).toBe(3);

      // After the commit clears the flag, the stale tier is out-of-order —
      // the ladder has already advanced past it, so still no second charge.
      const afterCommit = firstClick.ok
        ? purchaseHintTier({ ...state, ...firstClick, inFlight: false }, 0)
        : null;
      expect(afterCommit).toEqual({ ok: false, reason: "out-of-order" });
    });

    it("rejects when ink is insufficient for the tier", () => {
      const state = { ink: 1, revealedCount: 1, inFlight: false };
      expect(purchaseHintTier(state, 1)).toEqual({ ok: false, reason: "insufficient-ink" });
      expect(state.ink).toBe(1);
    });
  });
});
