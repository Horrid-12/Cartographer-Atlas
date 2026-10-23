import { rankFor, nextRankThreshold } from "../lib/game";
import type { Progress } from "../lib/game";
import { Trophy, Droplets, Compass } from "lucide-react";

export function StatusBar({ progress }: { progress: Progress }) {
  const rank = rankFor(progress.xp);
  const next = nextRankThreshold(progress.xp);
  const pct = next > progress.xp ? (progress.xp / next) * 100 : 100;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-gold/40 bg-[#f9f2e3] px-4 py-2 text-xs font-display text-ink shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[#726147]">XP:</span>
          <span className="font-bold text-gold">{progress.xp}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5 text-[#548fa6]" />
          <span className="text-[#726147]">Ink:</span>
          <span className="font-bold">{progress.ink}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-gold" />
          <span className="font-bold uppercase tracking-wider text-[#453621]">
            {rank}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-[#786952]">
          {next > progress.xp ? `Next Rank: ${next} XP` : "Max Rank"}
        </span>
        <div className="h-2 w-28 overflow-hidden rounded-full border border-ink/20 bg-[#e7dbc2]">
          <div
            className="h-full bg-gradient-to-r from-gold to-[#d8af56]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="flex items-center gap-1 text-[11px] text-[#726147]">
          <Compass className="h-3 w-3 text-gold" /> {progress.completed.length}/6
        </span>
      </div>
    </div>
  );
}
