# The Cartographer's Atlas

<p align="left">
  <img src="https://img.shields.io/badge/React-18.3-a9813c?logo=react&logoColor=f2e8d5&labelColor=2a2419" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-a9813c?logo=typescript&logoColor=f2e8d5&labelColor=2a2419" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-a9813c?logo=vite&logoColor=f2e8d5&labelColor=2a2419" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.1-a9813c?logo=tailwindcss&logoColor=f2e8d5&labelColor=2a2419" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-11.11-a9813c?logo=framer&logoColor=f2e8d5&labelColor=2a2419" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Tests-24_Passing-97403a?logo=vitest&logoColor=f2e8d5&labelColor=2a2419" alt="Vitest" />
  <img src="https://img.shields.io/badge/License-MIT-97403a?labelColor=2a2419" alt="License" />
</p>

A browser-based cartographic puzzle game where players decode Caesar-cipher dispatches across six uncharted archipelago sectors on an interactive parchment world map. Built with React 18, TypeScript, Vite, and Tailwind CSS v4.

## Features

- **Six Linked Dispatches:** Solve sequential sectors to chart new routes across the archipelago.
- **Interactive World Map:** Antique nautical canvas with voyage routes, interactive pins, coordinate HUD, and compass rose.
- **Decryption Desk:** Dedicated workspace with manual shift scrubbers (0-25), live transcription slate, and instant answer transfer.
- **Astronomical Cipher Wheel:** Dual-gear brass rotor simulation calculating modular Caesar alignments and angular displacements.
- **Ink Economy:** Start with 5 Ink; spend 1 per clue (with the final clue revealing the exact shift key); earn +2 Ink per solve.
- **Scoring Engine:** Calculates base XP, speed bonuses (+2 XP/sec under 60s), attempt penalties (-10 XP), and hint costs (-15 XP).
- **Surveyor Ranks:** Progression from Novice Wanderer (0-199 XP) to Journeyman Surveyor (200-499 XP) and Master Cartographer (500+ XP).
- **Wax Seal Victory Overlay:** Animated seal stamp, decrypted plaintext reveal, score breakdown, and replay-safe reward protection.
- **Expedition Journal & Archive:** Narrative logbook and cryptanalysis compendium explaining Caesar mathematics and frequency analysis.
- **Dual-Layer Audio:** Curated ambient background music, 11-second trimmed victory fanfare, and procedural Web Audio SFX with persistent mute toggle.
- **Resilient Persistence:** LocalStorage state synchronization with defensive schema validation and corruption recovery.

## Campaign

| Sector | Title | Place | Shift | Base XP | Docket | Coordinates |
|:------:|-------|-------|:-----:|:-------:|:------:|-------------|
| I | The Old Bridge | Cistern | 7 | 100 | C-1887-IV | 42°20'14" N • 09°42'02" W |
| II | The Sun Clock | Meridian | 13 | 150 | C-1887-V | 42°22'30" N • 09°34'18" W |
| III | The Watchtower | Tower | 3 | 150 | C-1887-VI | 42°19'05" N • 09°23'45" W |
| IV | The River Bank | River | 5 | 200 | C-1887-VII | 42°17'12" N • 09°32'50" W |
| V | The North Cave | Cave | 9 | 200 | C-1887-VIII | 42°26'40" N • 09°32'10" W |
| VI | The Sand Dunes | Desert | 11 | 250 | C-1887-IX | 42°13'55" N • 09°28'15" W |

Completing the first three sectors unlocks the "All Three Imperial Seals Restored" milestone.

## Mechanics

### Cipher Engine

Mathematical Caesar shift implementation with modulo-26 boundary normalization, preserving letter case, spaces, and punctuation:

$$E(x) = (x + k) \bmod 26$$
$$D(x) = (x - k) \bmod 26$$

### Scoring Formula

```ts
score = Math.max(0, mission.xp + Math.max(0, 60 - timeSec) * 2 - (attempts - 1) * 10 - hintsUsed * 15)
```

### Ranks

| Rank | XP Requirement |
|------|----------------|
| Novice Wanderer | 0 - 199 XP |
| Journeyman Surveyor | 200 - 499 XP |
| Master Cartographer | 500+ XP |

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-2a2419?style=for-the-badge&logo=react&logoColor=a9813c" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-2a2419?style=for-the-badge&logo=typescript&logoColor=a9813c" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-2a2419?style=for-the-badge&logo=vite&logoColor=a9813c" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-2a2419?style=for-the-badge&logo=tailwindcss&logoColor=a9813c" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-2a2419?style=for-the-badge&logo=framer&logoColor=a9813c" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vitest-2a2419?style=for-the-badge&logo=vitest&logoColor=a9813c" alt="Vitest" />
</p>

- **Framework:** React 18 + TypeScript 5.6
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS v4 (configured natively in `src/index.css` via `@tailwindcss/vite` and `@theme` tokens)
- **Animation & Icons:** Framer Motion, Lucide React
- **Testing:** Vitest (24 tests across 5 test suites)
- **State Persistence:** LocalStorage (`atlas-progress-v1`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation & Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Scripts

- `npm run dev` - Start the Vite dev server
- `npm run test` - Run Vitest suite (24 tests across 5 test suites)
- `npm run build` - Type-check (`tsc -b`) and compile production bundle to `dist/`
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── App.tsx                     # Main shell, tab routing, game state orchestration
├── main.tsx                    # Entry point
├── index.css                   # Tailwind v4 theme tokens and parchment textures
├── lib/
│   ├── game.ts                 # Missions, Caesar cipher, scoring, ranks, persistence
│   ├── ai.ts                   # Progressive clue lookup with shift reveal
│   ├── audio.ts                # Audio engine (BGM, fanfare, Web Audio SFX)
│   └── utils.ts                # Class-name helper (clsx + tailwind-merge)
├── game/
│   └── state.ts                # Defensive LocalStorage persistence with schema guards
├── data/
│   └── lore.ts                 # Sector metadata, coordinates, and lore
└── components/
    ├── TopNav.tsx              # HUD ribbon: XP, Ink, rank, audio toggle, tabs
    ├── WorldMap.tsx            # Parchment canvas, voyage routes, pins, grid
    ├── MissionPanel.tsx        # Active decryption desk and answer submission
    ├── MissionBoard.tsx        # Sidebar mission selector with lock states
    ├── CipherWheel.tsx         # Concentric astronomical cipher wheel
    ├── StatusBar.tsx           # Progress summary
    ├── VictoryOverlay.tsx      # Wax seal, score breakdown, rank-up animation
    ├── ExpeditionJournal.tsx   # Sector logbook and survey dossiers
    ├── ArchiveCuriosities.tsx  # Cryptanalysis guide and reset controls
    ├── CompassRose.tsx         # Decorative compass rose
    ├── Button.tsx / Card.tsx   # CVA-based UI primitives
    └── DecryptionDesk.tsx      # Standalone cryptographic workspace layout
```

## Testing

Run the test suite:

```bash
npm run test
```

The 24 tests across 5 suites cover:
- Caesar cipher encode/decode roundtrips and modulo-26 wrapping
- Case and punctuation preservation
- Score calculation and zero-floor clamping
- LocalStorage corruption recovery and schema fallback
- Progressive clue delivery and decisive shift reveals
- Victory overlay sequence, score breakdown, and anti-duplication protection

## License

MIT
