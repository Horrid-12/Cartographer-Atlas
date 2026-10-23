import { BookOpen, CheckCircle2, Lock, ArrowRight, Compass } from "lucide-react";
import { SECTOR_METAS } from "../data/lore";
import { MISSIONS, missionUnlocked, type Progress } from "../lib/game";

interface ExpeditionJournalProps {
  progress: Progress;
  onSelectSector: (index: number) => void;
  onGoToDesk: (index: number) => void;
}

export function ExpeditionJournal({
  progress,
  onSelectSector,
  onGoToDesk,
}: ExpeditionJournalProps) {
  const completedCount = progress.completed.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-display text-ink select-none">
      <div className="rounded border-2 border-[#544127] bg-[#fbf5e7] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gold/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 bg-[#2b2114] shadow-inner">
              <BookOpen className="h-6 w-6 text-gold" />
            </div>
            <div>
              <span className="block text-[11px] font-bold tracking-[0.2em] text-[#786136] uppercase">
                Field Logbook & Survey Records
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-[#231a10]">
                Her Majesty&apos;s Expedition Journal
              </h2>
            </div>
          </div>
          <div className="rounded border border-gold/60 bg-[#eee0c5] px-4 py-2 text-right">
            <span className="block text-[10px] uppercase text-[#6f5f46]">Survey Progress</span>
            <span className="text-lg font-bold text-wax">
              {completedCount} of 6 Dispatches Solved
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs italic text-[#594b34] leading-relaxed">
          &ldquo;Compiled during the Royal Hydrographic Expedition across the archipelago.
          All cryptograms adhere to imperial Caesar rotor standards.&rdquo;
        </p>

        <div className="mt-6 space-y-4">
          {SECTOR_METAS.map((sector) => {
            const mission = MISSIONS[sector.index];
            const unlocked = missionUnlocked(sector.index, progress.completed);
            const completed = progress.completed.includes(sector.id);

            return (
              <div
                key={sector.id}
                className={`rounded border p-4 transition-all ${
                  completed
                    ? "border-gold/60 bg-[#f4ebd8] shadow-sm"
                    : unlocked
                    ? "border-ink/30 bg-[#ede1cb]"
                    : "border-ink/15 bg-[#e3d7bf] opacity-60"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#2a2013] px-2 py-0.5 text-[10px] font-bold text-gold uppercase">
                      Sector {sector.roman}
                    </span>
                    <h3 className="text-lg font-bold text-[#1f160c]">
                      {mission.title}
                    </h3>
                    <span className="text-xs text-[#705e42]">
                      ({mission.place})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {completed ? (
                      <span className="flex items-center gap-1 rounded bg-wax/10 border border-wax/40 px-2 py-0.5 text-xs font-bold text-wax">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Charted (+{mission.xp} XP)
                      </span>
                    ) : unlocked ? (
                      <span className="flex items-center gap-1 rounded bg-gold/15 border border-gold/40 px-2 py-0.5 text-xs font-bold text-[#5c4720]">
                        <Compass className="h-3.5 w-3.5" /> Available to Decrypt
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-[#7d6c51]">
                        <Lock className="h-3.5 w-3.5" /> Sector Locked
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] items-center">
                  <div>
                    <p className="text-xs italic text-[#554631]">
                      &ldquo;{sector.lore}&rdquo;
                    </p>
                    <div className="mt-2 text-xs">
                      {completed ? (
                        <div className="rounded border border-gold/30 bg-[#fdf9f0] p-2">
                          <span className="text-[10px] font-bold uppercase text-gold mr-2">
                            Deciphered Text:
                          </span>
                          <span className="font-bold text-ink">
                            {mission.plaintext}
                          </span>
                          <span className="ml-2 text-[10px] text-[#715f43]">
                            (Shift: Key +{mission.shift})
                          </span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#736349]">
                          <span>Coordinate: {sector.coords}</span>
                          <span className="mx-2">•</span>
                          <span>Docket: {sector.docket}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {unlocked && (
                    <div className="flex sm:flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSector(sector.index);
                          onGoToDesk(sector.index);
                        }}
                        className="flex items-center justify-center gap-1.5 rounded border border-[#523d21] bg-gradient-to-b from-[#dfc17f] to-[#a47e30] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#261c0d] shadow hover:brightness-105 active:scale-95 transition-all"
                      >
                        <span>{completed ? "Inspect Desk" : "Open Desk"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
