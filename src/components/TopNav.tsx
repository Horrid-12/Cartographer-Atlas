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
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-gold/70 bg-[#2a2215] shadow-inner">
            <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-gold animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-[10px] sm:text-xs tracking-[0.2em] text-[#d6c7a7]">
              THE CARTOGRAPHER&apos;S
            </span>
            <span className="block font-display text-lg sm:text-xl font-bold tracking-[0.15em] text-[#f8edd9]">
              ATLAS
            </span>
          </div>
        </div>

        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 text-xs font-display tracking-widest">
          <button
            type="button"
            onClick={() => handleTabClick("map")}
            className={`min-h-[38px] px-4 py-2 uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              currentTab === "map"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            World Map
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("desk")}
            className={`min-h-[38px] px-4 py-2 uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              currentTab === "desk"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Decryption Desk
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("journal")}
            className={`min-h-[38px] px-4 py-2 uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              currentTab === "journal"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Expedition Journal
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("archive")}
            className={`min-h-[38px] px-4 py-2 uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              currentTab === "archive"
                ? "bg-[#796120] text-parchment font-bold shadow-md ring-1 ring-gold/40"
                : "text-[#d6c7a7] hover:bg-[#2c2317] hover:text-parchment"
            }`}
          >
            Archive of Curiosities
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
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
          <div className="flex items-center gap-2 sm:gap-3 rounded border border-gold/40 bg-[#292116] px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-display text-xs text-[#f2e8d5] shadow-inner">
            <div className="flex items-center gap-1">
              <span className="text-[#a59477] text-[10px] sm:text-xs">XP:</span>
              <span className="font-bold text-gold">{progress.xp}</span>
            </div>
            <span className="text-gold/40">|</span>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold shrink-0" />
              <span className="hidden sm:inline font-semibold tracking-wider uppercase text-[#e8dac0]">
                {rank}
              </span>
            </div>
            <span className="text-gold/40">|</span>
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#6ba4b8] shrink-0" />
              <span className="text-[#a59477] text-[10px] sm:text-xs">INK:</span>
              <span className="font-bold text-[#e6f4f8]">{progress.ink}</span>
            </div>
          </div>

          <div
            title="Archibald Sterling, Royal Cartographic Surveyor"
            aria-label="Surveyor seal Archibald Sterling"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-[#382b1b] p-0.5 shadow-md"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-wax text-parchment text-xs font-bold shadow-inner">
              AS
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <nav aria-label="Mobile Navigation" className="flex md:hidden border-t border-ink/40 bg-[#16120b] px-2 py-1 justify-around text-xs font-display uppercase tracking-wider text-[#d6c7a7]">
        <button
          type="button"
          onClick={() => handleTabClick("map")}
          className={`min-h-[36px] px-2.5 py-1.5 rounded focus-visible:ring-1 focus-visible:ring-gold ${currentTab === "map" ? "bg-[#796120] text-parchment font-bold" : ""}`}
        >
          Map
        </button>
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
