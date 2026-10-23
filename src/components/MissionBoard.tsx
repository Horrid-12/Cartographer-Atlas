import { MISSIONS, missionUnlocked } from "../lib/game";
import type { Progress } from "../lib/game";

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
        return (
          <li key={mission.id}>
            <button
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(index)}
              className={`w-full rounded-md border px-4 py-3 text-left font-display transition-colors ${
                index === activeIndex
                  ? "border-wax bg-wax/10"
                  : "border-ink/20 hover:bg-ink/5"
              } ${!unlocked ? "opacity-40" : ""}`}
            >
              <span className="block text-base">{mission.title}</span>
              <span className="block text-xs text-ink/70">
                {mission.place}
                {done ? " - solved" : unlocked ? "" : " - locked"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
