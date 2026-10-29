# Cartographer's Atlas — TASKFLOW

Audited 2026-10-29 at `3177b5c`. No code changed. `npm run test` 24/24, `tsc -b` and `npm run build` pass,
`npm run preview` serves the app and both audio files (200).

✅ done · ⚠️ partial · ❌ missing  · ◻️ unverified · P0 worst → P3

## Status

- **64% complete** — 16 done, 18 partial, 4 missing, 1 broken, 1 unverified of 40 features.
- **18 open bugs** — 3 P1, 5 P2, 10 P3. No P0: the app builds and plays.
- **Blockers:** BUG-001 (continue), BUG-002 (ink 0), BUG-003 (session state).
- **Next:** FEAT-001 harness → BUG-002 → BUG-001, test-first.

## Bugs

| ID      | P  | Problem → fix                                                                                                                                                                    | Where                                        |
| ------- | -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| BUG-001 | P1 | "Continue" after a first solve stays on the solved mission — `onContinue` closes over a pre-solve snapshot inside the `setProgress` updater → set `activeIndex` directly. | `App.tsx`                                  |
| BUG-002 | P1 | Saved ink `0` reloads as `5` (`parsedInk < 1 ? START_INK`) → return `parsedInk`, default only when absent.                                                               | `state.ts`                                 |
| BUG-003 | P1 | Timer, attempts, and purchased hints vanish on tab switch (desk unmounts) → lift per-mission session into `App`.                                                               | `MissionPanel.tsx`, `App.tsx`            |
| BUG-004 | P2 | Fractional seconds → fractional XP (`195.31`) → floor/round at the engine boundary.                                                                                           | `game.ts`, `MissionPanel.tsx`            |
| BUG-005 | P2 | `getClue` never returns `hints[2]`, and the UI never calls it → render tiers, make the last one the shift.                                                                   | `ai.ts`, `MissionPanel.tsx`              |
| BUG-006 | P2 | Tampered `activeMission` may be locked or unknown → normalize on load.                                                                                                         | `state.ts`, `App.tsx`                    |
| BUG-007 | P2 | Desk "Reset progress" wipes the save on one click → require confirmation.                                                                                                        | `App.tsx`                                  |
| BUG-008 | P2 | Victory dialog has no focus trap, Escape, or label → shared accessible dialog.                                                                                                   | `VictoryOverlay.tsx`                       |
| BUG-009 | P3 | Rank bar uses `xp/next` (250 XP shows 50%, not 17%) → subtract the tier floor.                                                                                                 | `StatusBar.tsx`                            |
| BUG-010 | P3 | "Center on Port" selects sector 0; "100% Scale" is inert → implement viewport or remove both.                                                                                    | `WorldMap.tsx`                             |
| BUG-011 | P3 | `TopNav` accepts sector/solved props and discards them → render or delete.                                                                                                     | `TopNav.tsx`, `App.tsx`                  |
| BUG-012 | P3 | Two persistence implementations; the `game.ts` copy is unused → delete it.                                                                                                     | `game.ts`, `state.ts`                    |
| BUG-013 | P3 | Unknown completion ids inflate the count (5/6 with 3 solves) → filter to known ids.                                                                                              | `state.ts`                                 |
| BUG-014 | P3 | Replay animates "+N XP" while awarding 0 → label it a practice score.                                                                                                            | `VictoryOverlay.tsx`, `MissionPanel.tsx` |
| BUG-015 | P3 | Victory fanfare starts twice (desk + overlay) → single owner, guard restart.                                                                                                     | `audio.ts`, `VictoryOverlay.tsx`         |
| BUG-016 | P3 | Map labels mix `84°E` with a west-longitude map → one consistent frame.                                                                                                       | `WorldMap.tsx`                             |
| BUG-017 | P3 | README/AGENTS describe 3 missions and old ranks, and claim tests that do not exist → refresh.                                                                                    | `README.md`, `AGENTS.md`                 |

## Features

| ID   | Status | Feature → gap                                          |
| ---- | ------ | ------------------------------------------------------- |
| F-01 | ✅     | Caesar engine                                           |
| F-02 | ✅     | 6-mission dataset                                       |
| F-03 | ✅     | Ciphertext display / live preview                       |
| F-04 | ✅     | Answer validation                                       |
| F-05 | ⚠️   | Scoring — fractional XP (BUG-004)                      |
| F-06 | ⚠️   | Attempts — reset on tab switch (BUG-003)               |
| F-07 | ⚠️   | Timer — no countdown, resets, fractional               |
| F-08 | ⚠️   | Ink — 0 reloads as 5 (BUG-002)                         |
| F-09 | ⚠️   | Hints — one tier; authored hints unreachable (BUG-005) |
| F-10 | ✅     | Ranks                                                   |
| F-11 | ✅     | Unlock chain — tamper bypass (BUG-006)                 |
| F-12 | ✅     | Replay awards once                                      |
| F-13 | ✅     | Shell and tabs                                          |
| F-14 | ⛔     | Continue to next mission (BUG-001)                      |
| F-15 | ⚠️   | Persistence (BUG-002/012)                               |
| F-16 | ⚠️   | Validation — no membership/unlock check (BUG-006/013)  |
| F-17 | ⚠️   | Reset — desk path unconfirmed (BUG-007)                |
| F-18 | ✅     | Victory overlay                                         |
| F-19 | ⚠️   | Dialog accessibility (BUG-008)                          |
| F-20 | ✅     | Map pins, routes, selection                             |
| F-21 | ❌     | Fog-of-war                                              |
| F-22 | ✅     | Compass rose                                            |
| F-23 | ✅     | Wax seals                                               |
| F-24 | ⚠️   | Map controls (BUG-010)                                  |
| F-25 | ⚠️   | TopNav HUD (BUG-011)                                    |
| F-26 | ⚠️   | Rank progress bar (BUG-009)                             |
| F-27 | ✅     | Mission board                                           |
| F-28 | ✅     | Journal                                                 |
| F-29 | ✅     | Archive                                                 |
| F-30 | ❌     | Cipher wheel — imported nowhere                        |
| F-31 | ❌     | `DecryptionDesk` — dead code                         |
| F-32 | ❌     | Title screen                                            |
| F-33 | ⚠️   | Audio — double fanfare (BUG-015); 3.96 MB asset        |
| F-34 | ⚠️   | Reduced motion — CSS loops unguarded                   |
| F-35 | ◻️   | Responsive — unverified                                |
| F-36 | ⚠️   | A11y semantics (BUG-008)                                |
| F-37 | ⚠️   | Keyboard — no Escape/trap                              |
| F-38 | ✅     | Build and typecheck                                     |
| F-39 | ⚠️   | Tests — no cipher/DOM/integration                      |
| F-40 | ⚠️   | Docs (BUG-017/018)                                      |

## Backlog

| ID       | P  | Task                                                      | Depends  |
| -------- | -- | --------------------------------------------------------- | -------- |
| FEAT-001 | P1 | jsdom + Testing Library harness                           | —       |
| FEAT-002 | P1 | Per-mission session state (timer, attempts, hints, draft) | 001      |
| FEAT-003 | P1 | Progressive clue tiers, charged per tier                  | 002      |
| FEAT-004 | P2 | Live timer / speed-bonus HUD                              | 002      |
| FEAT-005 | P2 | Fog-of-war and discovery                                  | —       |
| FEAT-006 | P2 | Title / intro screen                                      | —       |
| FEAT-007 | P3 | Route progress on the map                                 | 005      |
| FEAT-008 | P2 | Cipher wheel: integrate or remove                         | —       |
| FEAT-009 | P3 | One desk implementation                                   | 002, 008 |
| FEAT-010 | P2 | Real map viewport controls                                | —       |
| FEAT-011 | P3 | TopNav sector/solved chip                                 | —       |
| FEAT-012 | P2 | Versioned save schema + normalization                     | 001      |
| FEAT-013 | P2 | Accessible dialog + reset confirmation                    | 001      |
| FEAT-014 | P3 | Full reduced-motion coverage                              | —       |
| FEAT-015 | P3 | Single-owner victory audio                                | —       |
| FEAT-016 | P3 | Error boundary                                            | —       |
| FEAT-017 | P3 | Self-host the display font                                | —       |
| FEAT-018 | P3 | `BASE_URL`-safe audio paths                             | —       |
| FEAT-019 | P1 | Docs refresh (README, AGENTS, un-ignore)                  | all      |
| FEAT-020 | P1 | Lint, typecheck, CI                                       | 001      |
| FEAT-021 | P3 | Metadata and favicon                                      | —       |

## Plan

1. **Harness** — FEAT-001, FEAT-020, BUG-018.
2. **Core state** — BUG-002, BUG-001, BUG-004, BUG-006, BUG-013, FEAT-012.
3. **Gameplay loop** — BUG-003, FEAT-002, FEAT-003, FEAT-004, BUG-005, BUG-007, BUG-014.
4. **UI** — FEAT-005, FEAT-006, FEAT-008, FEAT-010, FEAT-007, BUG-009, BUG-010, BUG-011, BUG-016, responsive pass.
5. **A11y + polish** — BUG-008, FEAT-013, FEAT-014, FEAT-015, FEAT-016, FEAT-017, FEAT-021.
6. **Regression + docs** — FEAT-019, FEAT-018, full manual matrix.

## Tests

Existing: `utils` (3), `state` (5), `lore` (3), `AudioAndHints` (5), `VictoryOverlay` (8). All component tests use
`renderToString` — nothing mounts or clicks.

Missing:

- **Unit** — cipher round-trip, `normalizeShift` edge cases, score boundaries (0/60/120 s; 1/2/15 attempts; 0/1/5
  hints), integer contract, `missionUnlocked` 1-6, `rankFor` 199/200/499/500, loader ink-0, unknown ids, locked
  mission, `getClue` per index.
- **Integration** — solve → victory → continue, replay, hint survives tab switch, timer across tabs, reload, ink-0
  reload, tampered save, reset confirmation, keyboard victory, locked-sector refusal, invalid answer.
- **Manual** — 6-mission playthrough, rank boundaries, ink drain, both reset paths, keyboard-only run, reduced
  motion, 375/768/1440 layouts. Not run: browser automation, axe, screen readers, audio playback, cross-browser,
  sub-path deploy.

## Unverified

- SUS-001/003 map labels may clip at 375 px; map height may collide with the mobile nav.
- SUS-002 9-11 px gold/parchment text may fail WCAG AA.
- SUS-004/012 audio playback and mute→unmute resume differ by browser.
- SUS-005 side effects inside the `setProgress` updater under StrictMode.
- SUS-006 shared `DEFAULT_PROGRESS.completed` array; SUS-014 rapid hint clicks may double-charge.
- SUS-007 `attempts = 0` earns +10; SUS-008/009 absolute `/audio` URLs and the Google Fonts import break
  offline/sub-path; SUS-010 no error boundary; SUS-011 strict schema wipes legacy saves; SUS-013 "All Three Seals"
  ignores missions 4-6.

## Debt

Duplicate persistence (BUG-012) and desk logic (F-31); scoring lives in `VictoryOverlay` while `App` imports it;
impure state updater; dead props and unused tokens (`--color-fog`); duplicate MP3s in the repo root; no lint/CI.

## Done when

- All 6 missions solvable; XP integral; ink 0 stays 0; hints tiered, paid, and retained; Continue advances.
- Save survives reload without silent wipes; tampered saves normalize; reset is confirmed.
- Every visible control does what it says; no dead components; no fog-of-war or wheel promises left unkept.
- Keyboard-only playthrough passes; dialogs trap focus; reduced motion respected; one fanfare.
- `lint`, `typecheck`, `test`, `build` green from a clean checkout; README/AGENTS match code and are tracked.
