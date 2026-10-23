import { useState } from "react";
import { BookOpen, Trophy, Droplets, RotateCcw, AlertTriangle } from "lucide-react";
import { START_INK, INK_REWARD, HINT_INK_COST, HINT_SCORE_COST, SPEED_BONUS_CAP_SEC, SPEED_PER_SEC, ATTEMPT_PENALTY } from "../lib/game";

interface ArchiveCuriositiesProps {
  onReset: () => void;
}

export function ArchiveCuriosities({ onReset }: ArchiveCuriositiesProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-display text-ink select-none">
      <div className="rounded border-2 border-[#544127] bg-[#fbf5e7] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 border-b-2 border-gold/40 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 bg-[#2b2114] shadow-inner">
            <BookOpen className="h-6 w-6 text-gold" />
          </div>
          <div>
            <span className="block text-[11px] font-bold tracking-[0.2em] text-[#786136] uppercase">
              Royal Society Compendium
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-[#231a10]">
              Archive of Curiosities & Cryptanalysis
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded border border-ink/20 bg-[#f4ead6] p-5 shadow-sm">
            <h3 className="text-lg font-bold text-wax">
              The Caesar Rotor Cipher
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#4d3f2b]">
              Named after Julius Caesar, who used it with a shift of three to protect
              military communiqués. The cipher operates via modular arithmetic, substituting
              each letter with one positioned a fixed number of steps further in the alphabet.
            </p>
            <div className="mt-3 rounded border border-ink/15 bg-parchment p-3 text-xs">
              <span className="font-bold text-[#6d572d]">Mathematical Encoding:</span>
              <p className="mt-1 font-mono text-[11px] text-[#2a2419]">
                E(x) = (x + k) mod 26
              </p>
              <span className="mt-2 block font-bold text-[#6d572d]">Mathematical Decoding:</span>
              <p className="mt-1 font-mono text-[11px] text-[#2a2419]">
                D(x) = (x - k) mod 26
              </p>
            </div>
          </div>

          <div className="rounded border border-ink/20 bg-[#f4ead6] p-5 shadow-sm">
            <h3 className="text-lg font-bold text-[#356d81]">
              Frequency Analysis Strategy
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#4d3f2b]">
              In standard English prose, the letter <strong className="text-wax">E</strong> occurs
              with the highest frequency (~12.7%), followed by <strong className="text-wax">T, A, O, I, N</strong>.
              When deciphering field dispatches, tally the most recurrent glyph on your slate to deduce the rotor key.
            </p>
            <div className="mt-3 rounded border border-ink/15 bg-parchment p-3 text-xs">
              <span className="font-bold text-[#6d572d]">Key Decryption Clue:</span>
              <p className="mt-1 text-[11px] italic text-[#4a3b25]">
                If the letter &apos;L&apos; appears most often in a cipher text, and corresponds to &apos;E&apos;,
                the key offset is 7 (since E + 7 = L).
              </p>
            </div>
          </div>

          <div className="rounded border border-ink/20 bg-[#f4ead6] p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-bold text-[#1f170e]">
                Guild Ranks & Promotion
              </h3>
            </div>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center justify-between rounded border border-ink/10 bg-parchment p-2">
                <span className="font-bold text-[#5c4a2a]">Novice Wanderer</span>
                <span className="text-[11px] text-[#715f45]">0 &ndash; 199 XP</span>
              </li>
              <li className="flex items-center justify-between rounded border border-ink/10 bg-parchment p-2">
                <span className="font-bold text-gold">Journeyman Surveyor</span>
                <span className="text-[11px] text-[#715f45]">200 &ndash; 499 XP</span>
              </li>
              <li className="flex items-center justify-between rounded border border-ink/10 bg-parchment p-2">
                <span className="font-bold text-wax">Master Cartographer</span>
                <span className="text-[11px] text-[#715f45]">500+ XP</span>
              </li>
            </ul>
          </div>

          <div className="rounded border border-ink/20 bg-[#f4ead6] p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-[#428198]" />
              <h3 className="text-lg font-bold text-[#1f170e]">
                Ink Economy & Score Calculus
              </h3>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-[#4d3d27]">
              <li>&bull; Initial Flask Reserve: <strong>{START_INK} Ink</strong></li>
              <li>&bull; Sector Completion Bounty: <strong>+{INK_REWARD} Ink</strong></li>
              <li>&bull; Hint Consultation: <strong>-{HINT_INK_COST} Ink</strong> &amp; <strong>-{HINT_SCORE_COST} Score XP</strong></li>
              <li>&bull; Erroneous Submission: <strong>-{ATTEMPT_PENALTY} XP</strong> per attempt past first</li>
              <li>&bull; Speed Bonus: <strong>+{SPEED_PER_SEC} XP/sec</strong> for solves under {SPEED_BONUS_CAP_SEC}s</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded border border-wax/40 bg-[#f8e5e3] p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-wax" />
            <h3 className="text-base font-bold text-wax uppercase tracking-wider">
              Imperial Archives Reset Protocol
            </h3>
          </div>
          <p className="mt-1 text-xs text-[#522926]">
            Clearing your field dossier resets all charted sectors, accumulated XP, and ink supplies.
          </p>

          <div className="mt-4">
            {confirmReset ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="rounded border border-[#6b1e1b] bg-wax px-4 py-2 text-xs font-bold uppercase tracking-wider text-parchment shadow hover:brightness-110 active:scale-95 transition-all"
                >
                  Confirm Full Dossier Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded border border-ink/30 bg-[#ecdcc3] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#3d2f1c] hover:bg-[#dfceb2] transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1.5 rounded border border-ink/30 bg-[#f1ddd8] px-4 py-2 text-xs font-bold uppercase tracking-wider text-wax hover:bg-[#ecd0c9] active:scale-95 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Expedition Progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
