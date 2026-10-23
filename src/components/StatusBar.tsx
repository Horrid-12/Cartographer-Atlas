import { rankFor, nextRankThreshold } from "../lib/game";
import type { Progress } from "../lib/game";

export function StatusBar({ progress }: { progress: Progress }) {
  const rank = rankFor(progress.xp);
  const next = nextRankThreshold(progress.xp);
  const pct = next > progress.xp ? (progress.xp / next) * 100 : 100;
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="font-display">XP {progress.xp}</span>
      <span className="font-display">Ink {progress.ink}</span>
      <span className="font-display">{rank}</span>
      {next > progress.xp ? (
        <span className="text-ink/70">Next rank at {next} XP</span>
      ) : (
        <span className="text-ink/70">Max rank reached</span>
      )}
      <div className="h-2 w-28 overflow-hidden rounded bg-ink/10">
        <div className="h-2 bg-gold" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
