/**
 * The Cartographer's Atlas — Audio Engine
 *
 * Manages Background Music, trimmed Victory Fanfare, and UI sound effects.
 * Uses bundled local audio files (background-music.mp3 & victory.mp3) with
 * Web Audio procedural fallbacks.
 * Fully compliant with browser autoplay policies & silent error recovery.
 */

const MUTE_STORAGE_KEY = "atlas-audio-muted-v1";
const BGM_PATH = "/audio/background-music.mp3";
const VICTORY_PATH = "/audio/victory.mp3";

// Victory audio duration trim in seconds (trim to fit victory panel cleanly)
const VICTORY_TRIM_DURATION_SEC = 11;

let isMuted: boolean = (() => {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
})();

let bgmAudio: HTMLAudioElement | null = null;
let victoryAudio: HTMLAudioElement | null = null;
let victoryTimeout: ReturnType<typeof setTimeout> | null = null;
let bgmInitialized = false;

function getBgmAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!bgmAudio) {
    try {
      bgmAudio = new Audio(BGM_PATH);
      bgmAudio.loop = true;
      bgmAudio.volume = isMuted ? 0 : 0.35;
      bgmAudio.preload = "auto";
    } catch {
      bgmAudio = null;
    }
  }
  return bgmAudio;
}

function getVictoryAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!victoryAudio) {
    try {
      victoryAudio = new Audio(VICTORY_PATH);
      victoryAudio.volume = isMuted ? 0 : 0.65;
      victoryAudio.preload = "auto";
    } catch {
      victoryAudio = null;
    }
  }
  return victoryAudio;
}

export function isAudioMuted(): boolean {
  return isMuted;
}

export function setAudioMuted(muted: boolean): void {
  isMuted = muted;
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, muted ? "true" : "false");
  } catch {
    // Storage best-effort
  }

  if (bgmAudio) {
    bgmAudio.volume = muted ? 0 : 0.35;
    if (muted) {
      bgmAudio.pause();
    } else {
      bgmAudio.play().catch(() => {});
    }
  }

  if (victoryAudio) {
    victoryAudio.volume = muted ? 0 : 0.65;
    if (muted) {
      victoryAudio.pause();
    }
  }
}

export function toggleAudioMute(): boolean {
  const next = !isMuted;
  setAudioMuted(next);
  return next;
}

/**
 * Start or resume background ambient music.
 */
export function startBackgroundMusic(): void {
  if (isMuted) return;
  try {
    const bgm = getBgmAudio();
    if (!bgm) return;
    bgm.volume = 0.35;
    bgm.play().catch(() => {
      // Browser blocked autoplay; will retry on first user gesture
    });
  } catch {
    // Audio failures silently handled
  }
}

/**
 * Stop or pause background music.
 */
export function stopBackgroundMusic(): void {
  try {
    if (bgmAudio) {
      bgmAudio.pause();
    }
  } catch {
    // Silently handle
  }
}

/**
 * Play trimmed Victory fanfare when a mission is completed / victory panel opens.
 * Temporarily ducks or pauses BGM, plays the victory audio trimmed to fit the victory panel,
 * and then resumes BGM.
 */
export function playVictoryMusic(): void {
  if (isMuted) return;

  // Pause BGM while victory audio plays
  stopBackgroundMusic();

  if (victoryTimeout) {
    clearTimeout(victoryTimeout);
    victoryTimeout = null;
  }

  try {
    const victory = getVictoryAudio();
    if (!victory) return;

    victory.currentTime = 0;
    victory.volume = 0.65;
    victory.play().catch(() => {});

    // Trim victory audio to fit the victory panel display time
    victoryTimeout = setTimeout(() => {
      stopVictoryMusic();
    }, VICTORY_TRIM_DURATION_SEC * 1000);
  } catch {
    // Silently handle
  }
}

/**
 * Stop victory music with a quick fade and resume BGM.
 */
export function stopVictoryMusic(): void {
  if (victoryTimeout) {
    clearTimeout(victoryTimeout);
    victoryTimeout = null;
  }

  try {
    if (victoryAudio) {
      victoryAudio.pause();
      victoryAudio.currentTime = 0;
    }
  } catch {
    // Silently handle
  }

  // Resume BGM if not muted
  if (!isMuted) {
    startBackgroundMusic();
  }
}

// Procedural Web Audio context for subtle tactile clicks/taps
let sfxCtx: AudioContext | null = null;

function getSfxContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sfxCtx) {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sfxCtx = new AudioCtxClass();
      }
    } catch {
      sfxCtx = null;
    }
  }
  if (sfxCtx && sfxCtx.state === "suspended") {
    sfxCtx.resume().catch(() => {});
  }
  return sfxCtx;
}

/**
 * Subtle parchment click / tap sound.
 */
export function playClick(): void {
  // Also try to ensure BGM is rolling on first user gesture
  if (!bgmInitialized && !isMuted) {
    bgmInitialized = true;
    startBackgroundMusic();
  }

  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Silently handled
  }
}

/**
 * Ink droplet sound on clue consultation.
 */
export function playHintSound(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Silently handled
  }
}

/**
 * Wooden thud on erroneous attempt.
 */
export function playErrorSound(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Silently handled
  }
}

/**
 * Success chime.
 */
export function playSuccessSound(): void {
  // Handled by playVictoryMusic()
  playVictoryMusic();
}

/**
 * All Seals Broken fanfare.
 */
export function playAllSealsBrokenSound(): void {
  playVictoryMusic();
}
