import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  BookOpen,
  Lock,
  CheckCircle2,
  Droplets,
  Clock,
  Castle,
  Waves,
  Mountain,
  Sparkles,
  Grid,
  Maximize2,
  ZoomIn,
  Landmark,
} from "lucide-react";
import { CompassRose } from "./CompassRose";
import { SECTOR_METAS, type SectorMeta } from "../data/lore";
import { MISSIONS, missionUnlocked, type Progress } from "../lib/game";

interface WorldMapProps {
  progress: Progress;
  activeSectorIndex: number;
  onSelectSector: (index: number) => void;
  onEnterDesk: () => void;
}

export function WorldMap({
  progress,
  activeSectorIndex,
  onSelectSector,
  onEnterDesk,
}: WorldMapProps) {
  const reducedMotion = useReducedMotion();
  const [showGrid, setShowGrid] = useState(true);
  const activeMeta = SECTOR_METAS[activeSectorIndex] ?? SECTOR_METAS[0];
  const activeMission = MISSIONS[activeSectorIndex] ?? MISSIONS[0];
  const isSelectedUnlocked = missionUnlocked(activeSectorIndex, progress.completed);
  const isSelectedCompleted = progress.completed.includes(activeMission.id);

  function getSectorIcon(iconType: SectorMeta["iconType"]) {
    switch (iconType) {
      case "bridge":
        return Landmark;
      case "clock":
        return Clock;
      case "tower":
        return Castle;
      case "river":
        return Waves;
      case "cave":
        return Mountain;
      case "dunes":
        return Sparkles;
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] w-full overflow-hidden bg-[#e8dbc2] text-ink select-none font-display">
      <div
        className={`absolute inset-0 parchment ${
          showGrid ? "map-grid-pattern" : ""
        } opacity-95 transition-opacity`}
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between border-8 border-[#322718]/20 p-2 sm:p-4">
        <div className="flex justify-between text-[10px] tracking-wider text-[#635339]">
          <span>09°45&apos;W</span>
          <span>09°40&apos;W</span>
          <span className="hidden sm:inline">09°35&apos;W</span>
          <span>09°30&apos;W</span>
          <span className="hidden sm:inline">09°25&apos;W</span>
          <span>09°20&apos;W</span>
          <span>09°15&apos;W</span>
        </div>
        <div className="flex h-full items-center justify-between text-[10px] text-[#635339]">
          <div className="flex flex-col justify-between h-full py-10">
            <span>42°30&apos;</span>
            <span>42°25&apos;</span>
            <span>42°20&apos;</span>
            <span>42°15&apos;</span>
          </div>
          <div className="flex flex-col justify-between h-full py-10">
            <span>84°E</span>
            <span>82°E</span>
            <span>80°E</span>
            <span>78°E</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] tracking-wider text-[#635339]">
          <span>42°05&apos;N</span>
          <span>42°10&apos;N</span>
          <span className="hidden sm:inline">42°15&apos;N</span>
          <span>42°20&apos;N</span>
          <span className="hidden sm:inline">42°25&apos;N</span>
          <span>42°30&apos;N</span>
          <span>42°35&apos;N</span>
        </div>
      </div>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 120 180 Q 200 130 350 200 T 500 240 T 420 450 T 250 500 T 130 380 Z"
          fill="#ddcca9"
          stroke="#baa883"
          strokeWidth="1.5"
        />
        <path
          d="M 520 280 Q 640 220 780 270 T 820 480 T 680 560 T 520 480 Z"
          fill="#dac7a3"
          stroke="#baa883"
          strokeWidth="1.5"
        />
        <path
          d="M 380 90 Q 480 70 560 120 T 480 200 T 360 140 Z"
          fill="#d8c5a0"
          stroke="#baa883"
          strokeWidth="1"
        />

        <line
          x1="200"
          y1="322"
          x2="380"
          y2="273"
          stroke="#97403a"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        <line
          x1="380"
          y1="273"
          x2="450"
          y2="203"
          stroke="#7a674e"
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />
        <line
          x1="380"
          y1="273"
          x2="620"
          y2="336"
          stroke="#7a674e"
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />
        <line
          x1="380"
          y1="273"
          x2="450"
          y2="378"
          stroke="#7a674e"
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />
        <line
          x1="450"
          y1="378"
          x2="550"
          y2="448"
          stroke="#7a674e"
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />
      </svg>

      <div className="relative z-20 flex flex-col items-center pt-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -10 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="rounded-sm border border-gold/60 bg-[#f9f2e3]/90 px-8 py-3 text-center shadow-md backdrop-blur-sm"
        >
          <span className="block text-[11px] font-bold tracking-[0.25em] uppercase text-[#735d33]">
            Chart of Sovereign Discoveries
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-[#221a11]">
            THE UNKNOWN REACH
          </h1>
          <div className="mt-0.5 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-xs italic text-[#5f4f34]">
              Tap an unlocked seal to plot course
            </span>
            <span className="h-px w-8 bg-gold/50" />
          </div>
        </motion.div>
      </div>

      <div className="absolute top-6 right-6 sm:top-10 sm:right-12 z-20">
        <CompassRose className="w-28 h-28 sm:w-36 sm:h-36" />
      </div>

      <div className="relative z-20 mx-auto min-h-[460px] max-w-6xl px-4 py-8">
        <div className="relative h-[480px] w-full">
          {SECTOR_METAS.map((sector) => {
            const unlocked = missionUnlocked(sector.index, progress.completed);
            const completed = progress.completed.includes(sector.id);
            const isSelected = sector.index === activeSectorIndex;
            const Icon = getSectorIcon(sector.iconType);

            return (
              <div
                key={sector.id}
                style={{
                  left: `${sector.mapX}%`,
                  top: `${sector.mapY}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute z-20 flex flex-col items-center"
              >
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => onSelectSector(sector.index)}
                  className={`group relative flex flex-col items-center transition-transform focus:outline-none ${
                    unlocked
                      ? "cursor-pointer hover:scale-105 active:scale-95"
                      : "cursor-not-allowed opacity-60"
                  }`}
                >
                  {isSelected ? (
                    <motion.div
                      layoutId="activeSectorRing"
                      className="absolute -inset-3 rounded-full border-2 border-gold/80 bg-gold/20 animate-pulse pointer-events-none"
                    />
                  ) : null}

                  {sector.index === 0 || isSelected ? (
                    <div
                      className={`relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 p-1 shadow-xl transition-all ${
                        completed
                          ? "border-wax bg-gradient-to-br from-wax to-[#5c2420] text-parchment"
                          : isSelected
                          ? "border-[#d8b056] bg-gradient-to-br from-[#e0be6c] via-[#b58c35] to-[#7a591e] text-[#241a0d]"
                          : "border-gold/60 bg-gradient-to-br from-[#dfc17f] to-[#99742a] text-[#241a0d]"
                      }`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-black/20 bg-black/10 shadow-inner">
                        <Icon className="h-7 w-7 sm:h-9 sm:w-9 drop-shadow" />
                      </div>
                      {!unlocked ? (
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#342718] text-[#f2e8d5] ring-2 ring-gold/40">
                          <Lock className="h-3.5 w-3.5" />
                        </div>
                      ) : completed ? (
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-wax text-parchment ring-2 ring-gold/50 shadow">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div
                      className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 p-1 shadow-md transition-all ${
                        completed
                          ? "border-wax/80 bg-[#5e3834] text-parchment"
                          : unlocked
                          ? "border-gold/50 bg-[#423625] text-parchment hover:bg-[#52432e]"
                          : "border-ink/30 bg-[#473c2e] text-[#a4967d]"
                      }`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-black/20 bg-black/20">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      {!unlocked ? (
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#241b10] text-[#a8997f] ring-1 ring-gold/30">
                          <Lock className="h-3 w-3" />
                        </div>
                      ) : completed ? (
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-wax text-parchment ring-1 ring-gold/40">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="mt-2 text-center pointer-events-none">
                    {isSelected ? (
                      <span className="inline-block rounded bg-[#20180d] px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-gold shadow">
                        ● {completed ? "SECTOR " + sector.roman + ": COMPLETED" : "SECTOR " + sector.roman + ": UNLOCKED"}
                      </span>
                    ) : null}
                    <span
                      className={`block text-xs sm:text-sm font-bold tracking-wide mt-0.5 ${
                        isSelected ? "text-[#1c150c]" : "text-[#473a27]"
                      }`}
                    >
                      {sector.index === 0
                        ? MISSIONS[sector.index].title
                        : `Sector ${sector.roman} • ${MISSIONS[sector.index].title}`}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-30 mx-auto max-w-7xl px-4 pb-6 pt-2">
        <div className="grid gap-4 md:grid-cols-[380px_1fr_260px] items-end">
          <motion.div
            key={activeMeta.id}
            initial={reducedMotion ? false : { opacity: 0, x: -10 }}
            animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            className="rounded border border-gold/60 bg-[#fbf6ec] p-4 text-ink shadow-lg ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between border-b border-ink/15 pb-2 text-xs font-bold tracking-wider text-[#6b5839]">
              <span className="flex items-center gap-1.5 uppercase">
                <BookOpen className="h-3.5 w-3.5 text-gold" /> Expedition Orders
              </span>
              <span className="rounded bg-[#2a2215] px-2 py-0.5 font-display text-[10px] text-gold uppercase">
                Sector {activeMeta.roman}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-bold text-[#1f170f]">
                Objective: {activeMission.title}
              </h3>
              <p className="mt-1 text-xs italic leading-relaxed text-[#594b34]">
                &ldquo;{activeMeta.lore}&rdquo;
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-2.5 text-[11px] text-[#55462f]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    isSelectedCompleted
                      ? "border-wax bg-wax text-parchment"
                      : "border-ink/40 bg-parchment"
                  }`}
                >
                  {isSelectedCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                </span>
                <span>{activeMeta.task}</span>
              </div>
              <div className="flex items-center gap-1 text-[#6b5839]">
                <Droplets className="h-3.5 w-3.5 text-[#528ea5]" />
                <span>{activeMeta.inkCostLabel}</span>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center">
            {isSelectedUnlocked ? (
              <button
                type="button"
                onClick={onEnterDesk}
                className="group relative flex flex-col items-center justify-center rounded border-2 border-[#523d1d] bg-gradient-to-b from-[#dfbe74] via-[#be953e] to-[#7f5d1e] px-8 py-3.5 text-center text-[#211709] shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-none"
              >
                <div className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full border border-black/40 bg-[#3d2f19]" />
                <div className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border border-black/40 bg-[#3d2f19]" />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border border-black/40 bg-[#3d2f19]" />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border border-black/40 bg-[#3d2f19]" />

                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#473413]">
                  Sovereign Mandate
                </span>
                <span className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-wider">
                  <Compass className="h-5 w-5 text-[#2b1f0e]" />
                  {isSelectedCompleted ? "REVIEW DISPATCH →" : "START THE JOURNEY →"}
                </span>
                <span className="mt-0.5 text-[10px] tracking-widest text-[#4f3c1a]">
                  Royal Decree Seal #0492 • Charting Authorization Active
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center rounded border border-ink/30 bg-[#ded0b6] px-6 py-3 text-center text-ink/70">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <Lock className="h-3.5 w-3.5" /> Sector {activeMeta.roman} Locked
                </span>
                <span className="text-[10px] italic">
                  Solve preceding sector to chart course
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded border border-ink/30 bg-[#f4ebd9]/90 px-3 py-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setShowGrid((v) => !v)}
                title="Toggle coordinate grid"
                className={`p-1 rounded hover:bg-ink/10 transition-colors ${
                  showGrid ? "text-wax" : "text-ink/50"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onSelectSector(0)}
                title="Center on Home Port"
                className="p-1 rounded hover:bg-ink/10 text-ink/70 transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <span className="h-3 w-px bg-ink/20" />
              <div className="flex items-center gap-1 text-[11px] text-[#554631]">
                <ZoomIn className="h-3.5 w-3.5 text-gold" />
                <span>100% Copperplate Scale</span>
              </div>
            </div>
            <div className="text-[10px] text-right text-[#7a6b53] tracking-wide">
              <span>Engraved by Archibald Sterling • London, 1887</span>
              <br />
              <span>Vellum Preservation Grade A-1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 border-t border-ink/30 bg-[#1e170e] px-4 py-2 text-[10px] font-display text-[#aa9a7c]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <span>ANNO DOMINI MDCCCLXXXVII • HER MAJESTY&apos;S GEOGRAPHICAL SOCIETY</span>
          <span>© The Cartographer&apos;s Atlas. All field coordinates secured by royal decree.</span>
        </div>
      </div>
    </div>
  );
}
