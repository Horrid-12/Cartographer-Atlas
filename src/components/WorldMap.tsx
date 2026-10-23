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
import { playClick } from "../lib/audio";

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

  function handleSelect(index: number) {
    playClick();
    onSelectSector(index);
  }

  function handleEnter() {
    playClick();
    onEnterDesk();
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-[#e8dbc2] text-ink select-none font-display flex flex-col justify-between">
      {/* Parchment background with grid */}
      <div
        className={`absolute inset-0 parchment ${
          showGrid ? "map-grid-pattern" : ""
        } opacity-95 transition-opacity`}
      />

      {/* Neat, uncluttered navigational coordinate frame */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between border-4 sm:border-8 border-[#322718]/15 p-2 sm:p-3 pb-16">
        <div className="flex justify-between text-[9px] sm:text-[10px] tracking-wider text-[#635339]/80 px-2">
          <span>09°45&apos;W</span>
          <span>09°35&apos;W</span>
          <span>09°25&apos;W</span>
          <span>09°15&apos;W</span>
        </div>
        <div className="flex h-full items-center justify-between text-[9px] sm:text-[10px] text-[#635339]/80 py-4">
          <div className="flex flex-col justify-between h-full py-8">
            <span>42°30&apos;N</span>
            <span>42°20&apos;N</span>
            <span>42°10&apos;N</span>
          </div>
          <div className="flex flex-col justify-between h-full py-8">
            <span>84°E</span>
            <span>80°E</span>
            <span>78°E</span>
          </div>
        </div>
        <div className="flex justify-between text-[9px] sm:text-[10px] tracking-wider text-[#635339]/80 px-2">
          <span>42°05&apos;N</span>
          <span>42°15&apos;N</span>
          <span>42°25&apos;N</span>
          <span>42°35&apos;N</span>
        </div>
      </div>

      {/* SVG Map Continents and Routes */}
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

        {/* Chained Mission Nautical Routes */}
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
          x2="620"
          y2="336"
          stroke="#97403a"
          strokeWidth="2"
          strokeDasharray="5 5"
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
          x2="450"
          y2="203"
          stroke="#7a674e"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <line
          x1="450"
          y1="378"
          x2="550"
          y2="448"
          stroke="#7a674e"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Top Section: Title & Top-Right Expedition Orders Box */}
      <div className="relative z-20 w-full px-4 pt-4 sm:pt-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          {/* Map Title Plaque */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -10 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            className="rounded border border-gold/60 bg-[#f9f2e3]/95 px-6 py-2.5 text-center shadow-md backdrop-blur-sm self-center md:self-start"
          >
            <span className="block text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[#735d33]">
              Chart of Sovereign Discoveries
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-[#221a11]">
              THE UNKNOWN REACH
            </h1>
            <span className="text-[11px] italic text-[#5f4f34]">
              Select an unlocked sector seal to plot course
            </span>
          </motion.div>

          {/* TOP RIGHT: Moved Expedition Orders Box (with Compass Rose) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 self-center md:self-start md:ml-auto">
            <motion.div
              key={activeMeta.id}
              initial={reducedMotion ? false : { opacity: 0, x: 10 }}
              animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              className="w-full sm:w-80 rounded-md border-2 border-gold/70 bg-[#faf4e6]/95 p-3.5 text-ink shadow-xl ring-1 ring-black/10 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between border-b border-ink/15 pb-2 text-xs font-bold tracking-wider text-[#6b5839]">
                <span className="flex items-center gap-1.5 uppercase text-[11px]">
                  <BookOpen className="h-3.5 w-3.5 text-gold" /> Expedition Orders
                </span>
                <span className="rounded bg-[#2a2215] px-2 py-0.5 font-display text-[10px] text-gold uppercase">
                  Sector {activeMeta.roman}
                </span>
              </div>

              <div className="mt-2.5">
                <h2 className="text-base font-bold text-[#1f170f] leading-snug">
                  Objective: {activeMission.title}
                </h2>
                <p className="mt-1 text-xs italic leading-relaxed text-[#594b34] line-clamp-3">
                  &ldquo;{activeMeta.lore}&rdquo;
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2 text-[11px] text-[#55462f]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isSelectedCompleted
                        ? "border-wax bg-wax text-parchment"
                        : "border-ink/40 bg-parchment"
                    }`}
                  >
                    {isSelectedCompleted ? <CheckCircle2 className="h-3 w-3" /> : null}
                  </span>
                  <span className="font-semibold">{activeMeta.task}</span>
                </div>
                <div className="flex items-center gap-1 text-[#6b5839]">
                  <Droplets className="h-3.5 w-3.5 text-[#528ea5]" />
                  <span>Cost: 1 Ink</span>
                </div>
              </div>
            </motion.div>

            {/* Compass Rose */}
            <div className="hidden lg:block shrink-0">
              <CompassRose className="w-20 h-20 sm:w-24 sm:h-24 opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Interactive Canvas with Sector Seals */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-4 my-auto py-4">
        <div className="relative h-[360px] sm:h-[420px] w-full">
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
                  onClick={() => handleSelect(sector.index)}
                  aria-label={`Sector ${sector.roman}: ${MISSIONS[sector.index].title} ${
                    completed ? "(Completed)" : unlocked ? "(Unlocked)" : "(Locked)"
                  }`}
                  className={`group relative flex flex-col items-center transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/80 rounded-full ${
                    unlocked
                      ? "cursor-pointer hover:scale-110 active:scale-95"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  {/* Glowing selection ring */}
                  {isSelected ? (
                    <motion.div
                      layoutId="activeSectorRing"
                      className="absolute -inset-2.5 rounded-full border-2 border-gold bg-gold/25 animate-pulse pointer-events-none"
                    />
                  ) : null}

                  {/* Wax Seal / Marker Button */}
                  <div
                    className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 p-1 shadow-xl transition-all ${
                      completed
                        ? "border-wax bg-gradient-to-br from-wax via-[#b24c45] to-[#5c2420] text-parchment wax-seal-shadow"
                        : isSelected
                        ? "border-[#d8b056] bg-gradient-to-br from-[#e0be6c] via-[#b58c35] to-[#7a591e] text-[#241a0d]"
                        : unlocked
                        ? "border-gold/60 bg-gradient-to-br from-[#dfc17f] to-[#99742a] text-[#241a0d]"
                        : "border-ink/40 bg-[#423727] text-[#a4967d]"
                    }`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full border border-black/20 bg-black/10 shadow-inner">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 drop-shadow" />
                    </div>

                    {/* Status badge in corner */}
                    {!unlocked ? (
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#342718] text-[#f2e8d5] ring-1 ring-gold/40">
                        <Lock className="h-3 w-3" />
                      </div>
                    ) : completed ? (
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-wax text-parchment ring-1 ring-gold/50 shadow">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    ) : null}
                  </div>

                  {/* Clean, uncluttered label: Full badge for selected, clean roman title for others */}
                  <div className="mt-1.5 text-center pointer-events-none">
                    {isSelected ? (
                      <span className="inline-block rounded bg-[#20180d] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-gold shadow whitespace-nowrap">
                        ● {completed ? "SECTOR " + sector.roman + ": COMPLETED" : "SECTOR " + sector.roman + ": ACTIVE"}
                      </span>
                    ) : null}
                    <span
                      className={`block text-[11px] sm:text-xs font-bold tracking-wide ${
                        isSelected ? "text-[#1c150c] font-black" : "text-[#473a27]"
                      }`}
                    >
                      Sector {sector.roman} &bull; {MISSIONS[sector.index].title}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Area: Centered Action Button & Clean Utilities */}
      <div className="relative z-30 w-full px-4 pb-4 pt-1">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Map utility controls */}
          <div className="flex items-center gap-2 text-xs order-2 sm:order-1">
            <div className="flex items-center gap-1 rounded border border-ink/30 bg-[#f4ebd9]/90 px-2.5 py-1 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowGrid((v) => !v);
                }}
                title="Toggle coordinate grid"
                aria-label="Toggle coordinate grid"
                className={`p-1 rounded hover:bg-ink/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold ${
                  showGrid ? "text-wax font-bold" : "text-ink/50"
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSelect(0)}
                title="Center on Port"
                aria-label="Center on Port"
                className="p-1 rounded hover:bg-ink/10 text-ink/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <span className="h-3 w-px bg-ink/20" />
              <div className="flex items-center gap-1 text-[11px] text-[#554631]">
                <ZoomIn className="h-3 w-3 text-gold" />
                <span>100% Scale</span>
              </div>
            </div>
          </div>

          {/* Centered Main Action Button: Clean and Prominent */}
          <div className="order-1 sm:order-2 flex justify-center">
            {isSelectedUnlocked ? (
              <button
                type="button"
                onClick={handleEnter}
                className="group relative flex items-center gap-3 rounded-md border-2 border-[#523d1d] bg-gradient-to-b from-[#dfbe74] via-[#be953e] to-[#7f5d1e] px-8 py-3 text-center text-[#211709] shadow-xl transition-all hover:brightness-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold min-h-[48px] cursor-pointer"
              >
                <Compass className="h-5 w-5 text-[#2b1f0e] group-hover:rotate-45 transition-transform" />
                <span className="text-base sm:text-lg font-bold tracking-wider">
                  {isSelectedCompleted ? "REVIEW DISPATCH →" : "START THE JOURNEY →"}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded border border-ink/30 bg-[#ded0b6] px-5 py-2.5 text-center text-ink/70">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  Sector {activeMeta.roman} Locked &bull; Solve preceding sector to chart course
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clean Bottom Sovereign Society Footer Bar */}
      <footer className="relative z-30 border-t border-ink/30 bg-[#1e170e] px-4 py-2 text-[10px] font-display text-[#aa9a7c]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <span>ANNO DOMINI MDCCCLXXXVII &bull; HER MAJESTY&apos;S GEOGRAPHICAL SOCIETY</span>
          <span>&copy; The Cartographer&apos;s Atlas &bull; Field Coordinates Secured</span>
        </div>
      </footer>
    </div>
  );
}
