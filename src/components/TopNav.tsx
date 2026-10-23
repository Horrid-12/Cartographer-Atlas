import { BookOpen, Trophy, Droplets, Compass, Lock, Unlock, Sparkles } from "lucide-react";
import { rankFor, type Progress } from "../lib/game";

export type NavTab = "map" | "desk" | "journal" | "archive";

interface TopNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  progress: Progress;
  activeSectorRoman: string;
  isCurrentSolved: boolean;
}

export function TopNav({
  currentTab,
  onSelectTab,
  progress,
  activeSectorRoman,
  isCurrentSolved,
}: TopNavProps) {
  const rank = rankFor(progress.xp);
  const chartedCount = progress.completed.length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-ink/40 bg-[#1e1810] text-[#f2e8d5] shadow-lg select-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/70 bg-[#2a2215] shadow-inner">
            <Compass className="h-6 w-6 text-gold animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-xs tracking-[0.2em] text-[#d6c7a7]">
              THE CARTOGRAPHER&apos;S
            </span>
            <span className="block font-display text-xl font-bold tracking-[0.15em] text-[#f8edd9]">
              ATLAS
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 text-xs font-display tracking-widest">
          <button
            type="button"
            onClick={() => onSelectTab("map")}
            className={`px-4 py-2 uppercase transition-all duration-150 ${
              currentTab === "map"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            World Map
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("desk")}
            className={`px-4 py-2 uppercase transition-all duration-150 ${
              currentTab === "desk"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Decryption Desk
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("journal")}
            className={`px-4 py-2 uppercase transition-all duration-150 ${
              currentTab === "journal"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Expedition Journal
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("archive")}
            className={`px-4 py-2 uppercase transition-all duration-150 ${
              currentTab === "archive"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Archive of Curiosities
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded border border-gold/40 bg-[#292116] px-3.5 py-1.5 font-display text-xs text-[#f2e8d5] shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className="text-[#a59477]">XP:</span>
              <span className="font-bold text-gold">{progress.xp}</span>
            </div>
            <span className="text-gold/40">|</span>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-gold" />
              <span className="font-semibold tracking-wider uppercase text-[#e8dac0]">
                {rank}
              </span>
            </div>
            <span className="text-gold/40">|</span>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-[#6ba4b8]" />
              <span className="text-[#a59477]">INK:</span>
              <span className="font-bold text-[#e6f4f8]">{progress.ink}</span>
            </div>
          </div>

          <div
            title="Archibald Sterling, Royal Cartographic Surveyor"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-[#382b1b] p-0.5 shadow-md"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-wax text-parchment text-xs font-bold">
              AS
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:hidden border-t border-ink/40 bg-[#16120b] px-2 py-1 justify-around text-[11px] font-display uppercase tracking-wider text-[#d6c7a7]">
        <button
          type="button"
          onClick={() => onSelectTab("map")}
          className={`px-2 py-1 rounded ${currentTab === "map" ? "bg-[#796120] text-parchment" : ""}`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => onSelectTab("desk")}
          className={`px-2 py-1 rounded ${currentTab === "desk" ? "bg-[#796120] text-parchment" : ""}`}
        >
          Desk
        </button>
        <button
          type="button"
          onClick={() => onSelectTab("journal")}
          className={`px-2 py-1 rounded ${currentTab === "journal" ? "bg-[#796120] text-parchment" : ""}`}
        >
          Journal
        </button>
        <button
          type="button"
          onClick={() => onSelectTab("archive")}
          className={`px-2 py-1 rounded ${currentTab === "archive" ? "bg-[#796120] text-parchment" : ""}`}
        >
          Archive
        </button>
      </div>

      <div className="border-t border-ink/50 bg-[#141009] px-4 py-1.5 text-[11px] font-display text-[#bfb297] tracking-wider">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-gold/80" />
            {currentTab === "desk" ? (
              <span>
                CARTOGRAPHIC CRYPTANALYSIS UNIT • HER MAJESTY&apos;S FIELD DECRYPTION DESK (SECTOR {activeSectorRoman})
              </span>
            ) : (
              <span>
                CHART FOLIO: ARCHIPELAGO OF THE CARTOGRAPHER • PLATE NO. VII
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#9f9175]">
            <span>LAT 42°19&apos;14&quot; N • LON 09°33&apos;02&quot; W</span>
            <span className="hidden sm:inline text-gold/30">|</span>
            <span className="hidden sm:inline flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-gold/70" /> Mag. Declination: 3°12&apos; E
            </span>
            <span className="text-gold/30">|</span>
            <span className="flex items-center gap-1 font-semibold text-[#d4c6a9]">
              {isCurrentSolved ? (
                <Unlock className="h-3 w-3 text-gold" />
              ) : (
                <Lock className="h-3 w-3 text-gold" />
              )}
              {chartedCount} / 6 Sectors Charted
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
