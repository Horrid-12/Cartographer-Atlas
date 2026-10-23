# AI Log — Cartographer's Atlas

## 1. Key Prompts

> Record 5–10 important prompts given to AI tools. Include what you asked the AI to build or solve.

| # | Prompt Summary | Tool Used | What It Built / Solved |
|---|----------------|-----------|------------------------|
| 1 | "Act as a Senior TypeScript Developer… We are starting Phase 2: Game Engine. Create src/lib/game.ts — pure TypeScript logic, no React code yet." | OpenCode (GLM-5.3-Flash) | Skeleton for the engine module with separate types / constants / cipher sections, written strict-mode-safe |
| 2 | "Task 1: Define Interfaces — Mission (id, title, place, shift, plaintext, xp, hints) and Progress (xp, ink, completed, activeMission)." | OpenCode (GLM-5.3-Flash) | Exported `Mission` and `Progress` interfaces that the rest of Phase 2 will build on |
| 3 | "Task 2: Define Constants — START_INK=5, INK_REWARD=2, HINT_INK_COST=1, HINT_SCORE_COST=15, SPEED_BONUS_CAP_SEC=60, SPEED_PER_SEC=2, ATTEMPT_PENALTY=10, PERSISTENCE_KEY='atlas-progress-v1'." | OpenCode (GLM-5.3-Flash) | Eight exact exported constants for the ink economy, speed bonus and persistence key |
| 4 | "Task 3: The Cipher Engine — pure caesar(text, shift, forward) that preserves casing, ignores punctuation/digits, wraps shifts with modulo 26; plus computeCiphertext() and decodeText() helpers." | OpenCode (GLM-5.3-Flash) | Working Caesar engine; verified via tsc --strict and a Node assertion suite (A→D examples, casing/punctuation, wraparound at 25/26/52/−3, decode(cipher(x)) round-trips) |
| 5 | "The GitHub repo (Horrid-12/Cartographer-Atlas) is where you push and pull the updates." | OpenCode (GLM-5.3-Flash) | Cloned the repo into the workspace; committed src/lib/game.ts (d364206) and pushed to origin/main, then fetched to confirm sync |
| 6 | "Done — fill in the AI_Log entry." | OpenCode (GLM-5.3-Flash) | This file: real prompts, tools and the npx mistake below recorded for Phase 2 |
| 7 | "Resume and wire the UI: StatusBar, MissionBoard, MissionPanel, App orchestration, localStorage state module." | OpenCode (beam-free) | Added src/game/state.ts (+ tests), three components, rewrote App.tsx; build and 8 tests pass |
| 8 | "Proceed with Phase 3 UI: World Map, Decryption Desk, Concentric Astronomical Cipher Wheel, Expedition Journal, and Archive of Curiosities matching the reference designs." | Antigravity (Gemini 3.8) | Implemented full WorldMap canvas, interactive animated CipherWheel with gear controls and live working slate, DecryptionDesk, ExpeditionJournal, ArchiveCuriosities, and TopNav ribbon; all 11 unit tests and production build pass |
| 9 | | | |
| 10 | | | |

## 2. Tools Used

> Name each AI tool and explain what you used it for.

| Tool | Used For |
|------|----------|
| OpenCode — GLM-5.3-Flash | Main AI agent: implemented src/lib/game.ts, designed and ran the verification suite, committed/pushed, and filled this log |
| Git 2.55 (Git for Windows) | Cloned Cartographer-Atlas into the workspace; staged, committed (d364206) and pushed src/lib/game.ts to origin/main; fetch + `git status -sb` to confirm sync |
| TypeScript 5 via `npx -p typescript@5 tsc` | `--noEmit --strict --target ES2020` typecheck of game.ts; second pass emitted CommonJS output so the engine could be unit-tested at runtime |
| Node.js 24 + `node:assert/strict` | Executed cipher assertions: spec examples, case/punctuation preservation, modulo wraparound (25/26/27/52, negatives) and codec round-trips over 10 shift values |
| Antigravity — Gemini 3.8 | Implemented Phase 3 UI polish: World Map, Decryption Desk, Concentric Astronomical Cipher Wheel, TopNav, Expedition Journal, Archive of Curiosities; verified test suite and build |

## 3. One Time AI Got It Wrong

> Document a real AI mistake — incorrect cipher implementation, unsolvable puzzle, broken build, invalid assumption, etc. Explain how you caught it and what you changed.

**What happened:**

While setting up verification for the cipher engine, my first attempt to run the TypeScript compiler was `npx --yes typescript@5 --version`. It failed immediately with `npm error could not determine executable to run`. I had assumed npx would resolve the compiler binary automatically, but the `typescript` package ships two executables (`tsc` and `tsserver`) and none of them is named `typescript`, so npx had no default binary to forward my arguments to. The failure was an invalid CLI invocation on my side — the engine code itself was untouched and untested at that point.

**How you caught it:**

I read the actual npm error (`could not determine executable to run`) and the npm debug log it referenced instead of retrying blindly, recognized it as a package/binary-resolution problem rather than a code error, and switched the invocation. To make sure the engine was genuinely sound once the correct command ran, I verified it two independent ways: a compile-only pass (`tsc --noEmit --strict --target ES2020`) and a compiled-to-JS assertion suite under Node that tests the spec examples, casing/punctuation preservation, modulo wraparound and `decode(cipher(x))` round-trips — it printed "All cipher engine checks passed."

**What changed:**

Switched to the explicit form `npx --yes -p typescript@5 tsc <flags>`, where `-p` installs the package and `tsc` names the executable. That command typechecked the file cleanly and let the runtime test suite execute. A secondary lesson from the same session: in PowerShell, git operations report success through stderr (clone/push showed up as "errors" with non-zero exit codes even when they succeeded), so pipeline failures should be confirmed against repository state (`git status`, `git log`, fetch-and-compare with origin) before concluding anything actually failed.
