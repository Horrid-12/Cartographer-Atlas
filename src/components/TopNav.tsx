import { useState } from "react";
import {
  Trophy,
  Droplets,
  Compass,
  Volume2,
  VolumeX,
} from "lucide-react";
import { rankFor, type Progress } from "../lib/game";
import { isAudioMuted, toggleAudioMute, playClick } from "../lib/audio";

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
  activeSectorRoman: _activeSectorRoman,
  isCurrentSolved: _isCurrentSolved,
}: TopNavProps) {
  const rank = rankFor(progress.xp);
  const [muted, setMuted] = useState(() => isAudioMuted());

  function handleToggleSound() {
    const next = toggleAudioMute();
    setMuted(next);
    if (!next) {
      playClick();
    }
  }

  function handleTabClick(tab: NavTab) {
    playClick();
    onSelectTab(tab);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink/40 bg-[#1e1810] text-[#f2e8d5] shadow-lg select-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6">
        {/* The atlas itself is the way back to the map */}
        <button
          type="button"
          onClick={() => handleTabClick("map")}
          title="The Cartographer's Atlas — World Map"
          aria-label="The Cartographer's Atlas — World Map"
          aria-current={currentTab === "map" ? "page" : undefined}
          className="group flex shrink-0 cursor-pointer items-center gap-2.5 rounded px-1 py-0.5 text-left transition-colors hover:bg-[#2c2317]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 active:scale-[0.99] sm:gap-3"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-gold/70 bg-[#2a2215] shadow-inner transition-colors group-hover:border-gold">
            <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-gold animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="leading-tight">
            <span className="hidden sm:block font-display text-[10px] sm:text-xs tracking-[0.2em] text-[#d6c7a7] transition-colors group-hover:text-[#e8dac0]">
              THE CARTOGRAPHER&apos;S
            </span>
            <span className="block font-display text-lg sm:text-xl font-bold tracking-[0.15em] text-[#f8edd9] transition-colors group-hover:text-parchment">
              ATLAS
            </span>
          </div>
        </button>

        <nav aria-label="Main Navigation" className="hidden lg:flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto no-scrollbar px-2 xl:gap-1 text-[11px] xl:text-xs font-display tracking-widest">
          <button
            type="button"
            onClick={() => handleTabClick("desk")}
            className={`min-h-[38px] shrink-0 whitespace-nowrap px-2.5 py-2 uppercase transition-all duration-150 xl:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              currentTab === "desk"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Desk
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("journal")}
            className={`min-h-[38px] shrink-0 whitespace-nowrap px-2.5 py-2 uppercase transition-all duration-150 xl:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              currentTab === "journal"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Journal
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("archive")}
            className={`min-h-[38px] shrink-0 whitespace-nowrap px-2.5 py-2 uppercase transition-all duration-150 xl:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              currentTab === "archive"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Archive
          </button>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Audio Mute/Unmute Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={muted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            aria-label={muted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded border border-gold/40 bg-[#292116] text-[#e8dac0] hover:bg-[#3d3120] hover:text-gold active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-[#ba908d]" />
            ) : (
              <Volume2 className="h-4 w-4 text-gold" />
            )}
          </button>

          {/* Player Progress Stats */}
          <div className="flex items-center gap-2 sm:gap-3 rounded border border-gold/40 bg-[#292116] px-2 sm:px-3.5 py-1 sm:py-1.5 font-display text-xs text-[#f2e8d5] shadow-inner whitespace-nowrap">
            <div className="flex items-center gap-1">
              <span className="text-[#a59477] text-[10px] sm:text-xs">XP:</span>
              <span className="font-bold text-gold">{progress.xp}</span>
            </div>
            <span className="hidden sm:inline text-gold/40">|</span>
            <div className="hidden sm:flex items-center gap-1">
              <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold shrink-0" />
              <span className="font-semibold tracking-wider uppercase text-[#e8dac0]">
                {rank}
              </span>
            </div>
            <span className="text-gold/40">|</span>
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#6ba4b8] shrink-0" />
              <span className="hidden sm:inline text-[#a59477] text-[10px] sm:text-xs">INK:</span>
              <span className="font-bold text-[#e6f4f8]">{progress.ink}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <nav aria-label="Mobile Navigation" className="flex lg:hidden border-t border-ink/40 bg-[#16120b] px-2 py-1 justify-around text-xs font-display uppercase tracking-wider text-[#d6c7a7]">
        <button
          type="button"
          onClick={() => handleTabClick("desk")}
          className={`min-h-[36px] px-2.5 py-1.5 rounded focus-visible:ring-1 focus-visible:ring-gold ${currentTab === "desk" ? "bg-[#796120] text-parchment font-bold" : ""}`}
        >
          Desk
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("journal")}
          className={`min-h-[36px] px-2.5 py-1.5 rounded focus-visible:ring-1 focus-visible:ring-gold ${currentTab === "journal" ? "bg-[#796120] text-parchment font-bold" : ""}`}
        >
          Journal
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("archive")}
          className={`min-h-[36px] px-2.5 py-1.5 rounded focus-visible:ring-1 focus-visible:ring-gold ${currentTab === "archive" ? "bg-[#796120] text-parchment font-bold" : ""}`}
        >
          Archive
        </button>
      </nav>
    </header>
  );
}
