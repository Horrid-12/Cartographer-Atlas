import { MISSIONS, missionUnlocked } from "../lib/game";
import type { Progress } from "../lib/game";
import { SECTOR_METAS } from "../data/lore";
import { Lock, CheckCircle2, Compass } from "lucide-react";

export function MissionBoard({
  progress,
  activeIndex,
  onSelect,
}: {
  progress: Progress;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ul className="grid gap-2">
      {MISSIONS.map((mission, index) => {
        const unlocked = missionUnlocked(index, progress.completed);
        const done = progress.completed.includes(mission.id);
        const meta = SECTOR_METAS[index];
        const isActive = index === activeIndex;

        return (
          <li key={mission.id}>
            <button
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(index)}
              className={`w-full rounded border px-3.5 py-2.5 text-left font-display transition-all ${
                isActive
                  ? "border-wax bg-wax/10 shadow-sm ring-1 ring-wax/40"
                  : "border-ink/20 bg-[#fbf5e7] hover:bg-[#ede2cb]"
              } ${!unlocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6d5731] uppercase">
                  Sector {meta?.roman ?? index + 1}
                </span>
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-wax" />
                ) : !unlocked ? (
                  <Lock className="h-3 w-3 text-ink/40" />
                ) : (
                  <Compass className="h-3.5 w-3.5 text-gold" />
                )}
              </div>
              <span className="block text-sm font-bold text-[#1f170e]">
                {mission.title}
              </span>
              <span className="block text-[11px] text-ink/70">
                {mission.place} &bull; +{mission.xp} XP
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
