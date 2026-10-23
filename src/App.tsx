import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";
import { Button } from "./components/Button";
import { StatusBar } from "./components/StatusBar";
import { MissionBoard } from "./components/MissionBoard";
import { MissionPanel } from "./components/MissionPanel";
import {
  MISSIONS,
  missionUnlocked,
  rankFor,
  type Progress,
} from "./lib/game";
import { loadProgress, saveProgress } from "./game/state";

export default function App() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const initialIndex = MISSIONS.findIndex((m) => m.id === progress.activeMission);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const mission = MISSIONS[activeIndex];

  function handleSolve(score: number, missionId: string) {
    setProgress((previous) => {
      const completed = previous.completed.includes(missionId)
        ? previous.completed
        : [...previous.completed, missionId];
      const nextIndex = Math.min(activeIndex + 1, MISSIONS.length - 1);
      const next = {
        xp: previous.xp + score,
        ink: previous.ink + 2,
        completed,
        activeMission: MISSIONS[nextIndex]?.id ?? null,
      };
      saveProgress(next);
      return next;
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

  return (
    <main className="parchment min-h-screen text-ink">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MapIcon className="h-8 w-8 text-ink" aria-hidden="true" />
            <h1 className="text-4xl font-bold">The Cartographer's Atlas</h1>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
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
    </main>
  );
}
