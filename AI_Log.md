# AI Log — Cartographer's Atlas

## 1. Key Prompts

> Record 5–10 important prompts given to AI tools. Include what you asked the AI to build or solve.

| # | Prompt Summary | Tool Used | What It Built / Solved |
|---|----------------|-----------|------------------------|
| 1 | **Phase 1 — Project Foundation & Design System:** Scaffold the repository with React 18, Vite, TypeScript, and Tailwind CSS v4 (`@theme`). Implement antique cartography theme tokens (parchment, ink, wax, gold), SVG turbulence noise texture, and reusable `Button` and `Card` UI primitives via CVA. | Antigravity (Gemini 3.8 Flash) | Built modern frontend scaffolding, Tailwind v4 CSS-first theming in `src/index.css`, CVA component primitives, Vitest setup, and foundation preview. |
| 2 | **Phase 2 — Game Engine & Cipher Logic:** Implement pure TypeScript game engine without React dependencies. Define `Mission` and `Progress` interfaces, scoring/economy constants, pure Caesar cipher algorithm preserving casing/punctuation with modulo-26 wrap, rank progression, and corruption-safe localStorage persistence. | OpenCode (GLM-5.3-Flash / beam-free) | Delivered `src/lib/game.ts` and `src/game/state.ts`: Caesar cipher codec, `scoreMission()` formula, rank threshold logic (Novice → Journeyman → Master), and defensive localStorage handling with unit tests. |
| 3 | **Phase 3 — Cartographic World Map & Decryption Desk:** Implement interactive parchment World Map canvas with SVG routes and voyage pins, Decryption Desk, concentric astronomical cipher dial, Expedition Journal, Archive of Curiosities, and TopNav HUD ribbon matching design references. | Antigravity (Gemini 3.8 Flash) | Created `WorldMap.tsx`, `DecryptionDesk.tsx`, `CipherWheel.tsx`, `ExpeditionJournal.tsx`, `ArchiveCuriosities.tsx`, and `TopNav.tsx` with parchment aesthetics and status tracking. |
| 4 | **Phase 5 — Victory Overlay & Progression Integration:** Build final victory sequence with animated wax seal, decrypted message reveal, animated XP/Ink count-up using `scoreMission()`, rank-up notifications, sequence unlocking across all 3 missions, and replay anti-duplication guards. | Antigravity (Gemini 3.8 Flash) | Created `VictoryOverlay.tsx` with Framer Motion staggered transitions, exact score breakdowns, persistent rank promotion moments, and replay reward protection. |
| 5 | **Phase 6 — Polish, Audio, Input Simplification & Final Verification:** Final polish and regression testing: simplify cipher interaction by replacing the complex wheel with direct manual shift hint controllers and answer input, integrate local background music and victory sound effects with mute toggle, ensure responsive mobile/desktop layouts, and execute full test suite. | Antigravity (Gemini 3.8 Flash) | Integrated `src/lib/audio.ts` (Web Audio API & bundled audio tracks), refined `MissionPanel.tsx` and `DecryptionDesk.tsx` for accessible manual shift hints and input, hardened ink economy, and validated all 24 Vitest tests and production build. |

## 2. Tools Used

> Name each AI tool and explain what you used it for.

| Tool | Used For |
|------|----------|
| **Antigravity (Gemini 3.8 Flash / Claude)** | Frontend architecture, UI/UX implementation across Phases 1, 3, 5, and 6: Tailwind v4 theme, interactive World Map, Decryption Desk, Victory sequence animations, audio engine integration, and responsive layout polish. |
| **OpenCode (GLM-5.3-Flash / beam-free)** | Core algorithmic game engine in Phase 2: pure TypeScript Caesar cipher encode/decode, scoring/penalty formulas, rank transition thresholds, and localStorage persistence module. |
| **TypeScript 5 (`tsc -b`) & Vite** | Static type checking in strict mode, module bundling with `@tailwindcss/vite` plugin, and production build verification. |
| **Vitest & Node.js Assert** | Automated test runner: validated cipher modulo wraparounds, case/punctuation preservation, score calculation, corruption-safe storage recovery, and victory state triggers (24 tests passing). |
| **Git & GitHub (`Horrid-12/Cartographer-Atlas`)** | Source control, incremental commit staging across development phases, branch synchronization, and collaborative tracking between AI tools. |

## 3. One Time AI Got It Wrong

> Document a real AI mistake — incorrect cipher implementation, unsolvable puzzle, broken build, invalid assumption, etc. Explain how you caught it and what you changed.

**What happened:**

While setting up verification for the cipher engine in Phase 2, the agent attempted to execute `npx --yes typescript@5 --version`. This failed immediately with `npm error could not determine executable to run`. The agent assumed `npx` would automatically detect and run the TypeScript compiler binary, but the `typescript` npm package exports binaries named `tsc` and `tsserver` rather than `typescript`. Because no binary matched the package name directly, `npx` halted before running any type checking or tests.

**How you caught it:**

Rather than re-running the failed command blindly, the agent inspected the npm error log (`could not determine executable to run`), identifying that the issue was an npm executable resolution error rather than a syntax or engine defect. To verify the cipher engine independently, the suite was tested via both static typecheck and a Node.js runtime assertion script covering Caesar shift modulo arithmetic, punctuation preservation, negative offsets, and roundtrip codec integrity.

**What changed:**

Switched the invocation to the explicit package-and-binary flag format: `npx --yes -p typescript@5 tsc <flags>`, where `-p` specifies the package and `tsc` specifies the binary executable. In subsequent phases, permanent test and build scripts were defined in `package.json` (`npm run build` using `tsc -b && vite build` and `npm run test` using `vitest run`) so all agents and contributors could run consistent, verified one-line commands.
