import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import {
  VictoryOverlay,
  computeScoreBreakdown,
  type ScoreBreakdown,
} from "./VictoryOverlay";
import {
  MISSIONS,
  scoreMission,
  rankFor,
  nextRankThreshold,
  missionUnlocked,
  hintScorePenaltyFor,
  START_INK,
  INK_REWARD,
  type Progress,
} from "../lib/game";

describe("VictoryOverlay & Phase 5 Game Integration", () => {
  const mission1 = MISSIONS[0];
  const mission2 = MISSIONS[1];
  const mission3 = MISSIONS[2];

  describe("Scoring formula & breakdown", () => {
    it("computes exact score matching scoreMission without modification", () => {
      const attempts = 2;
      const hintScorePenalty = 10; // Tier 1 of the graduated hint ladder
      const timeSec = 25;

      const engineScore = scoreMission(mission1, attempts, hintScorePenalty, timeSec);
      const breakdown = computeScoreBreakdown(mission1, attempts, hintScorePenalty, timeSec);

      // Formula: mission.xp + Math.max(0, 60 - timeSec) * 2 - (attempts - 1) * 10 - hintScorePenalty
      // 100 + (35 * 2) - (1 * 10) - 10 = 100 + 70 - 10 - 10 = 150
      expect(breakdown.baseXp).toBe(100);
      expect(breakdown.speedBonus).toBe(70);
      expect(breakdown.attemptPenalty).toBe(10);
      expect(breakdown.hintPenalty).toBe(10);
      expect(breakdown.finalXp).toBe(150);
      expect(breakdown.finalXp).toBe(engineScore);
    });

    it("sums the graduated ladder penalty across revealed tiers", () => {
      const attempts = 1;
      const timeSec = 25;
      // Tiers 1 + 2 + 3 purchased: 10 + 20 + 35 = 65
      const hintScorePenalty = hintScorePenaltyFor(3);

      expect(hintScorePenalty).toBe(65);

      const breakdown = computeScoreBreakdown(mission1, attempts, hintScorePenalty, timeSec);
      // 100 + (35 * 2) - 0 - 65 = 105
      expect(breakdown.hintPenalty).toBe(65);
      expect(breakdown.finalXp).toBe(105);
      expect(breakdown.finalXp).toBe(
        scoreMission(mission1, attempts, hintScorePenalty, timeSec)
      );
    });

    it("clamps score at zero when penalties exceed base and speed bonus", () => {
      const breakdown = computeScoreBreakdown(mission1, 15, 5, 120);
      expect(breakdown.finalXp).toBe(0);
      expect(scoreMission(mission1, 15, 5, 120)).toBe(0);
    });

    it("normalizes fractional timeSec to whole integer XP without decimals", () => {
      // Millisecond timestamp elapsed time: 27.101 seconds
      const attempts = 1;
      const hintScorePenalty = 10;
      const timeSec = 27.101;

      const engineScore = scoreMission(mission1, attempts, hintScorePenalty, timeSec);
      const breakdown = computeScoreBreakdown(mission1, attempts, hintScorePenalty, timeSec);

      // Math.floor(27.101) = 27s; (60 - 27) * 2 = 66 speed bonus; 100 + 66 - 10 = 156
      expect(Number.isInteger(breakdown.speedBonus)).toBe(true);
      expect(Number.isInteger(breakdown.finalXp)).toBe(true);
      expect(Number.isInteger(engineScore)).toBe(true);
      expect(breakdown.timeSec).toBe(27);
      expect(breakdown.speedBonus).toBe(66);
      expect(breakdown.finalXp).toBe(156);
      expect(engineScore).toBe(156);
    });
  });

  describe("VictoryOverlay Component rendering", () => {
    it("renders mission-complete heading, plaintext reveal, and wax seal", () => {
      const breakdown: ScoreBreakdown = computeScoreBreakdown(mission1, 1, 0, 30);
      const html = renderToString(
        <VictoryOverlay
          mission={mission1}
          breakdown={breakdown}
          isFirstCompletion={true}
          inkAwarded={2}
          xpAwarded={breakdown.finalXp}
          previousRank="Novice Wanderer"
          newRank="Novice Wanderer"
          isRankUp={false}
          isAllThreeComplete={false}
          hasNextMission={true}
          onContinue={vi.fn()}
          onReturnToMap={vi.fn()}
        />
      );

      // Wax seal / checkmark
      expect(html).toContain("Engraved checkmark");
      expect(html).toContain("wax-seal-shadow");

      // Heading
      expect(html).toContain("Mission Accomplished!");
      expect(html).toContain(mission1.title);

      // Decrypted Plaintext
      expect(html).toContain(mission1.plaintext);
      expect(html).toContain(`Key +${mission1.shift}`);

      // Score breakdown
      expect(html).toContain(`+${breakdown.baseXp} XP`);
      expect(html).toContain(`+${breakdown.speedBonus} XP`);
      expect(html).toContain("Final Calculated Score:");

      // Ink reward
      expect(html).toContain("+2");
      expect(html).toContain("+2 Imperial Ink Flasks Awarded");

      // Navigation buttons
      expect(html).toContain("Return to Map");
      expect(html).toContain("Continue to Next Mission");
    });

    it("clearly distinguishes a replay from a first completion", () => {
      const breakdown: ScoreBreakdown = computeScoreBreakdown(mission1, 1, 0, 40);
      const html = renderToString(
        <VictoryOverlay
          mission={mission1}
          breakdown={breakdown}
          isFirstCompletion={false}
          inkAwarded={0}
          xpAwarded={0}
          previousRank="Journeyman Surveyor"
          newRank="Journeyman Surveyor"
          isRankUp={false}
          isAllThreeComplete={false}
          hasNextMission={true}
          onContinue={vi.fn()}
          onReturnToMap={vi.fn()}
        />
      );

      expect(html).toContain("Archival Replay Complete");
      expect(html).toContain("Mission Replayed");
      expect(html).toContain("First bounty already claimed");
      expect(html).toContain("Dossier XP and Ink remain preserved");
    });

    it("displays a special rank-up celebration moment when rank threshold is crossed", () => {
      const breakdown = computeScoreBreakdown(mission1, 1, 0, 20);
      const html = renderToString(
        <VictoryOverlay
          mission={mission1}
          breakdown={breakdown}
          isFirstCompletion={true}
          inkAwarded={2}
          xpAwarded={breakdown.finalXp}
          previousRank="Novice Wanderer"
          newRank="Journeyman Surveyor"
          isRankUp={true}
          isAllThreeComplete={false}
          hasNextMission={true}
          onContinue={vi.fn()}
          onReturnToMap={vi.fn()}
        />
      );

      expect(html).toContain("Cartographic Promotion Bestowed!");
      expect(html).toContain("Journeyman Surveyor");
      expect(html).toContain("Advanced from Novice Wanderer");
    });

    it("displays the all-seals-complete celebration state after the third mission", () => {
      const breakdown = computeScoreBreakdown(mission3, 1, 0, 25);
      const html = renderToString(
        <VictoryOverlay
          mission={mission3}
          breakdown={breakdown}
          isFirstCompletion={true}
          inkAwarded={2}
          xpAwarded={breakdown.finalXp}
          previousRank="Journeyman Surveyor"
          newRank="Master Cartographer"
          isRankUp={true}
          isAllThreeComplete={true}
          hasNextMission={false}
          onReturnToMap={vi.fn()}
        />
      );

      expect(html).toContain("All Royal Seals Restored");
      expect(html).toContain("The Cartographer&#x27;s Atlas is Complete!");
      expect(html).toContain("All three core dispatches across the archipelago have been successfully deciphered");
    });
  });

  describe("Anti-duplication and Progression Logic", () => {
    it("awards calculated XP and 2 Ink exactly once on first completion", () => {
      let currentProgress: Progress = {
        xp: 0,
        ink: START_INK,
        completed: [],
        activeMission: null,
      };

      const score1 = scoreMission(mission1, 1, 0, 30); // 100 + 60 = 160
      const isFirst = !currentProgress.completed.includes(mission1.id);
      expect(isFirst).toBe(true);

      if (isFirst) {
        currentProgress = {
          xp: currentProgress.xp + score1,
          ink: currentProgress.ink + INK_REWARD,
          completed: [...currentProgress.completed, mission1.id],
          activeMission: mission2.id,
        };
      }

      expect(currentProgress.xp).toBe(160);
      expect(currentProgress.ink).toBe(START_INK + 2);
      expect(currentProgress.completed).toEqual(["1"]);

      // Replaying mission 1 must not grant duplicate rewards
      const replayScore = scoreMission(mission1, 1, 0, 10);
      const isFirstOnReplay = !currentProgress.completed.includes(mission1.id);
      expect(isFirstOnReplay).toBe(false);

      if (isFirstOnReplay) {
        currentProgress = {
          xp: currentProgress.xp + replayScore,
          ink: currentProgress.ink + INK_REWARD,
          completed: [...currentProgress.completed, mission1.id],
          activeMission: currentProgress.activeMission,
        };
      }

      // Values should remain unchanged
      expect(currentProgress.xp).toBe(160);
      expect(currentProgress.ink).toBe(START_INK + 2);
      expect(currentProgress.completed).toEqual(["1"]);
    });

    it("completes all three missions in sequence with correct unlocks and rank progression", () => {
      let progress: Progress = {
        xp: 0,
        ink: START_INK,
        completed: [],
        activeMission: null,
      };

      // Initial state: Mission 1 unlocked, 2 and 3 locked
      expect(missionUnlocked(0, progress.completed)).toBe(true);
      expect(missionUnlocked(1, progress.completed)).toBe(false);
      expect(missionUnlocked(2, progress.completed)).toBe(false);
      expect(rankFor(progress.xp)).toBe("Novice Wanderer");

      // Complete Mission 1
      const score1 = scoreMission(mission1, 1, 0, 20); // 100 + 80 = 180 XP
      progress = {
        xp: progress.xp + score1,
        ink: progress.ink + INK_REWARD,
        completed: [...progress.completed, mission1.id],
        activeMission: mission2.id,
      };

      expect(missionUnlocked(1, progress.completed)).toBe(true);
      expect(missionUnlocked(2, progress.completed)).toBe(false);
      expect(progress.xp).toBe(180);
      expect(rankFor(progress.xp)).toBe("Novice Wanderer");
      expect(nextRankThreshold(progress.xp)).toBe(200);

      // Complete Mission 2
      const score2 = scoreMission(mission2, 1, 0, 30); // 150 + 60 = 210 XP
      const prevRank2 = rankFor(progress.xp);
      progress = {
        xp: progress.xp + score2,
        ink: progress.ink + INK_REWARD,
        completed: [...progress.completed, mission2.id],
        activeMission: mission3.id,
      };

      const newRank2 = rankFor(progress.xp);
      expect(progress.xp).toBe(390);
      expect(prevRank2).toBe("Novice Wanderer");
      expect(newRank2).toBe("Journeyman Surveyor");
      expect(newRank2 !== prevRank2).toBe(true); // Rank up triggered!
      expect(missionUnlocked(2, progress.completed)).toBe(true);

      // Complete Mission 3
      const score3 = scoreMission(mission3, 1, 0, 30); // 150 + 60 = 210 XP
      const prevRank3 = rankFor(progress.xp);
      progress = {
        xp: progress.xp + score3,
        ink: progress.ink + INK_REWARD,
        completed: [...progress.completed, mission3.id],
        activeMission: null,
      };

      const newRank3 = rankFor(progress.xp);
      expect(progress.xp).toBe(600);
      expect(prevRank3).toBe("Journeyman Surveyor");
      expect(newRank3).toBe("Master Cartographer");
      expect(newRank3 !== prevRank3).toBe(true); // Rank up to max rank!

      // All three seals complete check
      const allThreeDone = ["1", "2", "3"].every((id) => progress.completed.includes(id));
      expect(allThreeDone).toBe(true);
    });
  });
});
