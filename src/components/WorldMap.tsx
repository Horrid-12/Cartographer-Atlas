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

/**
 * Calculates curved cartographic nautical voyage arcs between consecutive sectors.
 * Each leg follows a tailored natural curve navigating regional coastlines, channels, and sounds.
 */
function getSectorPath(
  index: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  switch (index) {
    case 0:
      // Sector I (Old Bridge) -> Sector II (Sun Clock): Arcing northwest along the mountain ridge
      return `M ${x1} ${y1} Q 170 220 ${x2} ${y2}`;
    case 1:
      // Sector II (Sun Clock) -> Sector III (Watchtower): Dipping south into the coastal sea channel
      return `M ${x1} ${y1} Q 410 230 ${x2} ${y2}`;
    case 2:
      // Sector III (Watchtower) -> Sector IV (River Bank): Sweeping nautical S-curve across the Azure Sound
      return `M ${x1} ${y1} C 570 250, 540 430 ${x2} ${y2}`;
    case 3:
      // Sector IV (River Bank) -> Sector V (North Cave): Meandering northeast voyage across the central gulf
      return `M ${x1} ${y1} C 490 560, 660 380 ${x2} ${y2}`;
    case 4:
      // Sector V (North Cave) -> Sector VI (Sand Dunes): Sweeping coastal curve down to the arid wastes
      return `M ${x1} ${y1} Q 850 310 ${x2} ${y2}`;
    default: {
      // Dynamic fallback for any additional sectors: smooth perpendicular arc
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cx = mx - dy * 0.18;
      const cy = my + dx * 0.18;
      return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    }
  }
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
    <div className="relative min-h-[calc(100vh-96px)] lg:min-h-[calc(100vh-64px)] w-full overflow-hidden bg-[#e8dbc2] text-ink select-none font-display flex flex-col justify-between">
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
            <span>42°30&apos;N</span>
            <span>42°20&apos;N</span>
            <span>42°10&apos;N</span>
          </div>
        </div>
        <div className="flex justify-between text-[9px] sm:text-[10px] tracking-wider text-[#635339]/80 px-2">
          <span>09°45&apos;W</span>
          <span>09°35&apos;W</span>
          <span>09°25&apos;W</span>
          <span>09°15&apos;W</span>
        </div>
      </div>



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

              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-ink/10 pt-2 text-[11px] text-[#55462f]">
                <div className="flex items-center gap-1.5">
                  {isSelectedCompleted ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-wax"
                      aria-hidden="true"
                    />
                  ) : (
                    <Clock
                      className="h-4 w-4 shrink-0 text-[#8a7654]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="font-semibold">{activeMeta.task}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isSelectedCompleted ? "text-wax" : "text-[#8a7654]"
                    }`}
                  >
                    &middot; {isSelectedCompleted ? "Done" : "Pending"}
                  </span>
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
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 my-auto py-2 sm:py-4 flex-1 flex items-center justify-center">
        <div className="relative h-[480px] sm:h-[540px] md:h-[580px] lg:h-[620px] w-full">
          {/* Cartographic Geography & Nautical Routes Canvas */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Subtle sea depth contours / parchment ocean glow */}
            <defs>
              <radialGradient id="oceanShine" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#ede1c9" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#dfceac" stopOpacity="0.2" />
              </radialGradient>
            </defs>
            <rect width="1000" height="700" fill="url(#oceanShine)" />

            {/* Nautical Compass Navigation Rays (Rhumb Lines) */}
            <g stroke="#b09f7a" strokeWidth="0.7" strokeDasharray="3 9" opacity="0.35">
              <line x1="500" y1="350" x2="0" y2="0" />
              <line x1="500" y1="350" x2="1000" y2="0" />
              <line x1="500" y1="350" x2="0" y2="700" />
              <line x1="500" y1="350" x2="1000" y2="700" />
              <line x1="500" y1="350" x2="500" y2="0" />
              <line x1="500" y1="350" x2="500" y2="700" />
              <line x1="500" y1="350" x2="0" y2="350" />
              <line x1="500" y1="350" x2="1000" y2="350" />
              <circle cx="500" cy="350" r="180" fill="none" strokeWidth="0.8" strokeDasharray="4 8" />
            </g>

            {/* Continent 1: Western Realm (Sectors I, II, IV) */}
            <path
              d="M 90 320 C 80 220, 130 150, 240 130 C 330 110, 400 160, 420 240 C 440 310, 370 380, 350 430 C 370 480, 470 490, 480 570 C 490 640, 420 670, 330 660 C 230 650, 170 600, 150 510 C 100 450, 110 380, 90 320 Z"
              fill="#ddcca9"
              stroke="#baa883"
              strokeWidth="1.8"
              opacity="0.85"
            />
            {/* Western Coastal Shallows Echo Line */}
            <path
              d="M 82 320 C 72 215, 124 142, 238 122 C 333 102, 407 154, 428 238 C 448 312, 376 384, 356 434 C 376 486, 478 496, 488 578 C 498 650, 424 680, 330 670 C 224 660, 162 608, 142 516 C 92 454, 102 382, 82 320 Z"
              fill="none"
              stroke="#baa883"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              opacity="0.5"
            />

            {/* Continent 2: Northern Promontory & Polaris Archipelago (Sectors III, V) */}
            <path
              d="M 450 170 C 460 100, 530 80, 620 80 C 700 70, 780 100, 800 170 C 810 240, 740 280, 660 270 C 590 270, 540 240, 480 250 C 440 240, 440 190, 450 170 Z"
              fill="#d8c5a0"
              stroke="#baa883"
              strokeWidth="1.8"
              opacity="0.85"
            />
            {/* Northern Coastal Shallows Echo Line */}
            <path
              d="M 442 170 C 452 94, 526 72, 620 72 C 704 62, 788 94, 808 168 C 818 244, 746 288, 662 278 C 588 278, 536 246, 476 256 C 434 246, 434 192, 442 170 Z"
              fill="none"
              stroke="#baa883"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              opacity="0.5"
            />

            {/* Continent 3: Southeastern Desert Landmass (Sector VI) */}
            <path
              d="M 640 450 C 690 380, 800 370, 870 410 C 930 450, 960 550, 930 630 C 890 680, 780 680, 710 650 C 640 620, 600 530, 640 450 Z"
              fill="#dac7a3"
              stroke="#baa883"
              strokeWidth="1.8"
              opacity="0.85"
            />
            {/* Southeastern Coastal Shallows Echo Line */}
            <path
              d="M 632 450 C 684 374, 802 362, 876 404 C 938 446, 970 552, 938 638 C 896 690, 782 690, 708 658 C 634 626, 592 532, 632 450 Z"
              fill="none"
              stroke="#baa883"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              opacity="0.5"
            />

            {/* Satellite Islets in the Sound */}
            <path
              d="M 520 370 Q 545 355 555 375 T 520 395 Z"
              fill="#ddcca9"
              stroke="#baa883"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <path
              d="M 580 430 Q 600 420 610 435 T 580 450 Z"
              fill="#ddcca9"
              stroke="#baa883"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <path
              d="M 230 490 Q 250 480 255 495 T 230 510 Z"
              fill="#ddcca9"
              stroke="#baa883"
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Serpentine River flowing from highlands to southern bay */}
            <path
              d="M 310 230 Q 360 320 340 400 T 420 520 T 410 600"
              fill="none"
              stroke="#7a97a6"
              strokeWidth="2.2"
              strokeOpacity="0.75"
              strokeDasharray="4 2"
            />

            {/* Mountain Peaks near Polaris Vault (Sector V) */}
            <path
              d="M 680 200 L 695 170 L 710 200 M 705 200 L 720 165 L 735 200 M 730 200 L 745 172 L 760 200"
              fill="none"
              stroke="#826e4f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Mountain Peaks near Meridian Terrace (Sector II) */}
            <path
              d="M 260 215 L 275 185 L 290 215 M 285 215 L 300 180 L 315 215"
              fill="none"
              stroke="#826e4f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Desert Dune Ridges near Sand Dunes (Sector VI) */}
            <path
              d="M 780 470 Q 805 460 830 470 M 825 520 Q 850 510 875 520 M 760 560 Q 785 550 810 560 M 820 610 Q 845 600 870 610"
              fill="none"
              stroke="#ab905c"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Ocean Waves */}
            <path
              d="M 440 330 Q 455 322 470 330 M 455 330 Q 470 322 485 330"
              fill="none"
              stroke="#7e95a3"
              strokeWidth="1.2"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
            <path
              d="M 620 310 Q 635 302 650 310 M 635 310 Q 650 302 665 310"
              fill="none"
              stroke="#7e95a3"
              strokeWidth="1.2"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
            <path
              d="M 480 500 Q 495 492 510 500 M 495 500 Q 510 492 525 500"
              fill="none"
              stroke="#7e95a3"
              strokeWidth="1.2"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />

            {/* Open Sea Ocean Inscription */}
            <text
              x="560"
              y="480"
              textAnchor="middle"
              fill="#806d4e"
              fontSize="13"
              letterSpacing="0.32em"
              opacity="0.65"
              fontStyle="italic"
            >
              MARE INCOGNITA
            </text>

            {/* Chained Mission Nautical Routes between Consecutive Sectors */}
            {SECTOR_METAS.slice(0, -1).map((sector, i) => {
              const nextSector = SECTOR_METAS[i + 1];
              const isCompleted = progress.completed.includes(sector.id);
              const isNextUnlocked = missionUnlocked(i + 1, progress.completed);

              const x1 = sector.mapX * 10;
              const y1 = sector.mapY * 7;
              const x2 = nextSector.mapX * 10;
              const y2 = nextSector.mapY * 7;
              const pathD = getSectorPath(i, x1, y1, x2, y2);

              return (
                <g key={`route-${sector.id}-${nextSector.id}`}>
                  {/* Route glow / halo for solved courses */}
                  {isCompleted && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#c99738"
                      strokeWidth="4"
                      strokeOpacity="0.35"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {/* Curvy dashed nautical voyage route */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      isCompleted ? "#97403a" : isNextUnlocked ? "#a86036" : "#7a674e"
                    }
                    strokeWidth={isCompleted ? "2.5" : "1.8"}
                    strokeDasharray={isCompleted ? "7 6" : "5 5"}
                    strokeOpacity={isNextUnlocked ? 0.95 : 0.4}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Sector Seals */}
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
                  className={`group relative flex flex-col items-center transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/80 rounded-lg ${
                    unlocked
                      ? "cursor-pointer hover:scale-110 active:scale-95"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  {/* Wax Seal Container with perfectly circular selection ring */}
                  <div className="relative flex items-center justify-center">
                    {/* Glowing selection ring strictly around the circular seal */}
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
                  </div>

                  {/* Clean, uncluttered label with clear parchment backing */}
                  <div className="mt-2 text-center pointer-events-none max-w-[150px] sm:max-w-[190px] flex flex-col items-center">
                    {isSelected ? (
                      <span className="inline-block rounded bg-[#20180d] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-gold shadow-md whitespace-nowrap mb-1 border border-gold/40">
                        ● {completed ? "SECTOR " + sector.roman + ": COMPLETED" : "SECTOR " + sector.roman + ": ACTIVE"}
                      </span>
                    ) : null}
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] sm:text-xs font-bold tracking-wide leading-tight shadow-sm backdrop-blur-[1px] ${
                        isSelected
                          ? "text-[#1a1309] font-black bg-[#faf3e3]/95 border border-[#b89f7a]/60 shadow"
                          : "text-[#3d3120] bg-[#faf3e3]/80 border border-[#baa883]/30"
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
                  {isSelectedCompleted
                    ? "REVIEW DISPATCH →"
                    : progress.completed.length > 0
                    ? "CONTINUE THE JOURNEY →"
                    : "START THE JOURNEY →"}
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
    </div>
  );
}
