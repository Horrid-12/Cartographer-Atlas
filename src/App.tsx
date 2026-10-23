import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";
import { Button } from "./components/Button";
import { StatusBar } from "./components/StatusBar";
import { MissionBoard } from "./components/MissionBoard";
import { MissionPanel } from "./components/MissionPanel";
import { WorldMap } from "./components/WorldMap";
import { TopNav, type NavTab } from "./components/TopNav";
import { ExpeditionJournal } from "./components/ExpeditionJournal";
import { ArchiveCuriosities } from "./components/ArchiveCuriosities";
import {
  VictoryOverlay,
  computeScoreBreakdown,
  type VictoryOverlayProps,
} from "./components/VictoryOverlay";
import {
  MISSIONS,
  missionUnlocked,
  rankFor,
  INK_REWARD,
  type Progress,
} from "./lib/game";
import { SECTOR_METAS } from "./data/lore";
import { loadProgress, saveProgress, resetProgress } from "./game/state";
import { startBackgroundMusic } from "./lib/audio";

export default function App() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const initialIndex = MISSIONS.findIndex((m) => m.id === progress.activeMission);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [currentTab, setCurrentTab] = useState<NavTab>("map");
  const [victoryData, setVictoryData] = useState<VictoryOverlayProps | null>(null);

  const mission = MISSIONS[activeIndex] ?? MISSIONS[0];
  const activeSectorMeta = SECTOR_METAS[activeIndex] ?? SECTOR_METAS[0];
  const isCurrentSolved = progress.completed.includes(mission.id);
  const isAllThreeComplete = ["1", "2", "3"].every((id) =>
    progress.completed.includes(id)
  );

  useEffect(() => {
    const handleGesture = () => {
      startBackgroundMusic();
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
    window.addEventListener("pointerdown", handleGesture);
    window.addEventListener("keydown", handleGesture);
    return () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, []);

  function handleSolve(
    _score: number,
    missionId: string,
    stats?: { attempts: number; hintsUsed: number; timeSec: number }
  ) {
    const targetMission = MISSIONS.find((m) => m.id === missionId) ?? mission;
    const attempts = stats?.attempts ?? 1;
    const hintsUsed = stats?.hintsUsed ?? 0;
    const timeSec = stats?.timeSec ?? 0;
    const breakdown = computeScoreBreakdown(
      targetMission,
      attempts,
      hintsUsed,
      timeSec
    );

    setProgress((previous) => {
      const isFirst = !previous.completed.includes(missionId);
      const prevRank = rankFor(previous.xp);
      const currIdx = MISSIONS.findIndex((m) => m.id === missionId);
      const nextIndex = Math.min(currIdx + 1, MISSIONS.length - 1);

      if (isFirst) {
        const nextCompleted = [...previous.completed, missionId];
        const nextXp = previous.xp + breakdown.finalXp;
        const nextInk = previous.ink + INK_REWARD;
        const newRank = rankFor(nextXp);
        const isRankUp = newRank !== prevRank;
        const isAllThree = ["1", "2", "3"].every((id) =>
          nextCompleted.includes(id)
        );

        const nextProgress: Progress = {
          xp: nextXp,
          ink: nextInk,
          completed: nextCompleted,
          activeMission: MISSIONS[nextIndex]?.id ?? null,
        };
        saveProgress(nextProgress);

        setVictoryData({
          mission: targetMission,
          breakdown,
          score: breakdown.finalXp,
          attempts,
          hintsUsed,
          timeSec,
          isFirstCompletion: true,
          inkAwarded: INK_REWARD,
          xpAwarded: breakdown.finalXp,
          previousRank: prevRank,
          newRank,
          isRankUp,
          isAllThreeComplete: isAllThree,
          hasNextMission: currIdx < MISSIONS.length - 1,
          onContinue: () => {
            setVictoryData(null);
            if (currIdx + 1 < MISSIONS.length) {
              selectMission(currIdx + 1);
            }
            setCurrentTab("desk");
          },
          onReturnToMap: () => {
            setVictoryData(null);
            setCurrentTab("map");
          },
        });

        return nextProgress;
      } else {
        // Replay: Calculate and display attempt breakdown without duplicate awards
        const isAllThree = ["1", "2", "3"].every((id) =>
          previous.completed.includes(id)
        );

        setVictoryData({
          mission: targetMission,
          breakdown,
          score: breakdown.finalXp,
          attempts,
          hintsUsed,
          timeSec,
          isFirstCompletion: false,
          inkAwarded: 0,
          xpAwarded: 0,
          previousRank: prevRank,
          newRank: prevRank,
          isRankUp: false,
          isAllThreeComplete: isAllThree,
          hasNextMission: currIdx < MISSIONS.length - 1,
          onContinue: () => {
            setVictoryData(null);
            if (currIdx + 1 < MISSIONS.length) {
              selectMission(currIdx + 1);
            }
            setCurrentTab("desk");
          },
          onReturnToMap: () => {
            setVictoryData(null);
            setCurrentTab("map");
          },
        });

        return previous;
      }
    });
  }

  function handleUseHint() {
    let ok = false;
    setProgress((previous) => {
      if (previous.ink < 1) return previous;
      ok = true;
      const next = { ...previous, ink: previous.ink - 1 };
      saveProgress(next);
      return next;
    });
    return ok;
  }

  function selectMission(index: number) {
    if (!missionUnlocked(index, progress.completed)) return;
    setActiveIndex(index);
    setProgress((previous) => {
      const next = { ...previous, activeMission: MISSIONS[index]?.id ?? null };
      saveProgress(next);
      return next;
    });
  }

  function handleReset() {
    const fresh = resetProgress();
    setProgress(fresh);
    setActiveIndex(0);
    setVictoryData(null);
  }

  return (
    <main className="parchment min-h-screen text-ink flex flex-col">
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        progress={progress}
        activeSectorRoman={activeSectorMeta.roman}
        isCurrentSolved={isCurrentSolved}
      />

      {/* Grand All-Seals-Complete State Banner */}
      {isAllThreeComplete && (
        <div className="border-b border-wax/40 bg-gradient-to-r from-[#97403a]/20 via-[#a9813c]/20 to-[#97403a]/20 py-2.5 px-4 text-center font-display text-xs text-[#2a2419] shadow-inner">
          <span className="font-bold tracking-wider text-wax uppercase sm:text-sm">
            ★ All Seals Broken &bull; Royal Cartographic Achievement: All Three Imperial Seals Restored ★
          </span>
        </div>
      )}

      {currentTab === "map" && (
        <WorldMap
          progress={progress}
          activeSectorIndex={activeIndex}
          onSelectSector={selectMission}
          onEnterDesk={() => setCurrentTab("desk")}
        />
      )}

      {currentTab === "desk" && (
        <div className="mx-auto max-w-5xl px-6 py-8 w-full">
          <header className="flex items-center justify-between gap-3 border-b border-ink/15 pb-4">
            <div className="flex items-center gap-3">
              <MapIcon className="h-8 w-8 text-ink" aria-hidden="true" />
              <h1 className="text-3xl sm:text-4xl font-bold">
                The Cartographer&apos;s Atlas
              </h1>
            </div>
            <span className="font-display text-sm text-ink/70">
              {rankFor(progress.xp)}
            </span>
          </header>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <StatusBar progress={progress} />
          </motion.div>

          <div className="mt-8 grid gap-6 md:grid-cols-[260px_1fr]">
            <aside>
              <MissionBoard
                progress={progress}
                activeIndex={activeIndex}
                onSelect={selectMission}
              />
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset progress
                </Button>
              </div>
            </aside>
            <section>
              {mission ? (
                <MissionPanel
                  key={mission.id}
                  mission={mission}
                  onSolve={handleSolve}
                  onUseHint={handleUseHint}
                />
              ) : null}
            </section>
          </div>
        </div>
      )}

      {currentTab === "journal" && (
        <ExpeditionJournal
          progress={progress}
          onSelectSector={selectMission}
          onGoToDesk={(idx) => {
            selectMission(idx);
            setCurrentTab("desk");
          }}
        />
      )}

      {currentTab === "archive" && (
        <ArchiveCuriosities onReset={handleReset} />
      )}

      {/* Victory Overlay Sequence */}
      {victoryData && <VictoryOverlay {...victoryData} />}
    </main>
  );
}
