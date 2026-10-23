import { useState, useEffect } from "react";
import { TopNav, type NavTab } from "./components/TopNav";
import { WorldMap } from "./components/WorldMap";
import { DecryptionDesk } from "./components/DecryptionDesk";
import { ExpeditionJournal } from "./components/ExpeditionJournal";
import { ArchiveCuriosities } from "./components/ArchiveCuriosities";
import { SECTOR_METAS } from "./data/lore";
import {
  MISSIONS,
  missionUnlocked,
  type Progress,
  INK_REWARD,
} from "./lib/game";
import { loadProgress, saveProgress, resetProgress } from "./game/state";

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [currentTab, setCurrentTab] = useState<NavTab>("map");

  const initialIndex = MISSIONS.findIndex((m) => m.id === progress.activeMission);
  const [activeSectorIndex, setActiveSectorIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  useEffect(() => {
    if (progress.activeMission) {
      const idx = MISSIONS.findIndex((m) => m.id === progress.activeMission);
      if (idx >= 0 && idx !== activeSectorIndex) {
        setActiveSectorIndex(idx);
      }
    }
  }, [progress.activeMission]);

  const activeMission = MISSIONS[activeSectorIndex] ?? MISSIONS[0];
  const activeMeta = SECTOR_METAS[activeSectorIndex] ?? SECTOR_METAS[0];
  const isCurrentSolved = progress.completed.includes(activeMission.id);

  function handleSelectSector(index: number) {
    if (!missionUnlocked(index, progress.completed)) return;
    setActiveSectorIndex(index);
    setProgress((prev) => {
      const next = { ...prev, activeMission: MISSIONS[index]?.id ?? null };
      saveProgress(next);
      return next;
    });
  }

  function handleSolve(score: number, missionId: string) {
    setProgress((prev) => {
      const completed = prev.completed.includes(missionId)
        ? prev.completed
        : [...prev.completed, missionId];
      const nextIndex = Math.min(activeSectorIndex + 1, MISSIONS.length - 1);
      const next: Progress = {
        xp: prev.xp + score,
        ink: prev.ink + INK_REWARD,
        completed,
        activeMission: MISSIONS[nextIndex]?.id ?? null,
      };
      saveProgress(next);
      return next;
    });
  }

  function handleUseHint(): boolean {
    let ok = false;
    setProgress((prev) => {
      if (prev.ink < 1) return prev;
      ok = true;
      const next: Progress = { ...prev, ink: prev.ink - 1 };
      saveProgress(next);
      return next;
    });
    return ok;
  }

  function handleNextSector() {
    const nextIdx = Math.min(activeSectorIndex + 1, MISSIONS.length - 1);
    if (missionUnlocked(nextIdx, progress.completed)) {
      setActiveSectorIndex(nextIdx);
      setProgress((prev) => {
        const next = { ...prev, activeMission: MISSIONS[nextIdx]?.id ?? null };
        saveProgress(next);
        return next;
      });
      setCurrentTab("desk");
    } else {
      setCurrentTab("map");
    }
  }

  function handleReset() {
    const fresh = resetProgress();
    setProgress(fresh);
    setActiveSectorIndex(0);
    setCurrentTab("map");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen bg-[#1c160e] text-ink font-display antialiased">
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        progress={progress}
        activeSectorRoman={activeMeta.roman}
        isCurrentSolved={isCurrentSolved}
      />

      <main className="w-full">
        {currentTab === "map" && (
          <WorldMap
            progress={progress}
            activeSectorIndex={activeSectorIndex}
            onSelectSector={handleSelectSector}
            onEnterDesk={() => setCurrentTab("desk")}
          />
        )}

        {currentTab === "desk" && (
          <div className="parchment min-h-[calc(100vh-100px)] py-6">
            <DecryptionDesk
              mission={activeMission}
              sectorIndex={activeSectorIndex}
              progress={progress}
              onSolve={handleSolve}
              onUseHint={handleUseHint}
              onNextSector={handleNextSector}
              onReturnToMap={() => setCurrentTab("map")}
            />
          </div>
        )}

        {currentTab === "journal" && (
          <div className="parchment min-h-[calc(100vh-100px)] py-6">
            <ExpeditionJournal
              progress={progress}
              onSelectSector={handleSelectSector}
              onGoToDesk={(idx) => {
                handleSelectSector(idx);
                setCurrentTab("desk");
              }}
            />
          </div>
        )}

        {currentTab === "archive" && (
          <div className="parchment min-h-[calc(100vh-100px)] py-6">
            <ArchiveCuriosities onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  );
}
