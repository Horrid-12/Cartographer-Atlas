import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { getClue } from "../lib/ai";
import { MISSIONS } from "../lib/game";
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
    it("reveals the exact number of shifts needed on the decisive hint", () => {
      const mission1 = MISSIONS[0]; // shift: 7
      const hint = getClue(mission1, 2);
      expect(hint).toContain("Archival Cipher Record");
      expect(hint).toContain(`Exactly ${mission1.shift} shifts`);
    });

    it("reveals the exact number of shifts needed for mission 2 and 3", () => {
      const mission2 = MISSIONS[1]; // shift: 13
      const mission3 = MISSIONS[2]; // shift: 3

      expect(getClue(mission2, 2)).toContain("13 shifts");
      expect(getClue(mission3, 2)).toContain("3 shifts");
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

  describe("MissionPanel hint rendering", () => {
    it("renders Archival Clue Locked initially", () => {
      const mission1 = MISSIONS[0];
      const html = renderToString(
        <MissionPanel
          mission={mission1}
          ink={1}
          onSolve={vi.fn()}
          onUseHint={() => true}
        />
      );
      expect(html).toContain("Archival Clue Locked");
    });
  });
});
