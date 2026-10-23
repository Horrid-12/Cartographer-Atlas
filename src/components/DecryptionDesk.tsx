import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Droplets,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  CheckCircle2,
  Award,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import { SECTOR_METAS } from "../data/lore";
import {
  computeCiphertext,
  decodeText,
  scoreMission,
  SPEED_BONUS_CAP_SEC,
  type Mission,
  type Progress,
} from "../lib/game";
import { getClue } from "../lib/ai";
import {
  playClick,
  playHintSound,
  playErrorSound,
  playSuccessSound,
} from "../lib/audio";

interface DecryptionDeskProps {
  mission: Mission;
  sectorIndex: number;
  progress: Progress;
  onSolve: (
    score: number,
    missionId: string,
    stats?: { attempts: number; hintsUsed: number; timeSec: number }
  ) => void;
  onUseHint: () => boolean;
  onNextSector: () => void;
  onReturnToMap: () => void;
}

export function DecryptionDesk({
  mission,
  sectorIndex,
  progress,
  onSolve,
  onUseHint,
  onNextSector,
  onReturnToMap,
}: DecryptionDeskProps) {
  const reducedMotion = useReducedMotion();
  const ciphertext = computeCiphertext(mission);
  const meta = SECTOR_METAS[sectorIndex] ?? SECTOR_METAS[0];
  const alreadyCompleted = progress.completed.includes(mission.id);

  const [dialShift, setDialShift] = useState(alreadyCompleted ? mission.shift : 0);
  const [answer, setAnswer] = useState(alreadyCompleted ? mission.plaintext : "");
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: "error" | "info" | "success"; text: string } | null>(null);
  const [solved, setSolved] = useState(alreadyCompleted);
  const [earnedScore, setEarnedScore] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [copied, setCopied] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (solved) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [solved]);

  const elapsedSec = Math.floor((now - startTime) / 1000);
  const speedBonusRemaining = Math.max(0, SPEED_BONUS_CAP_SEC - elapsedSec) * 2;
  const liveTranslation = decodeText(ciphertext, dialShift);

  function normalize(str: string): string {
    return str.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function handleShiftChange(newShift: number) {
    if (solved) return;
    const normalized = ((newShift % 26) + 26) % 26;
    playClick();
    setDialShift(normalized);
  }

  function handleCheckAnswer() {
    if (solved || answer.trim() === "") return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (normalize(answer) === normalize(mission.plaintext)) {
      const finalScore = scoreMission(mission, nextAttempts, hintsUsed, elapsedSec);
      setEarnedScore(finalScore);
      setSolved(true);
      setDialShift(mission.shift);
      playSuccessSound();
      setFeedback({
        type: "success",
        text: `Decryption confirmed! Sovereign mandate approved (+${finalScore} XP).`,
      });
      onSolve(finalScore, mission.id, {
        attempts: nextAttempts,
        hintsUsed,
        timeSec: elapsedSec,
      });
    } else {
      setShake(true);
      playErrorSound();
      setTimeout(() => setShake(false), 500);
      setFeedback({
        type: "error",
        text: "The glyphs do not align with the imperial cipher record. Check your shift offset.",
      });
    }
  }

  function handleBuyHint() {
    if (solved) return;
    if (hintsUsed >= mission.hints.length) {
      setFeedback({
        type: "info",
        text: "All archival clues for this dispatch have been revealed.",
      });
      return;
    }
    const ok = onUseHint();
    if (!ok) {
      playErrorSound();
      setFeedback({
        type: "error",
        text: "Insufficient ink reserves in Her Majesty's flask. Chart further sectors.",
      });
      return;
    }
    playHintSound();
    const nextIndex = hintsUsed;
    const clueText = getClue(mission, nextIndex);
    setHintsUsed((v) => v + 1);
    setRevealedHints((prev) => [...prev, clueText]);
  }

  function handleFillFromSlate() {
    playClick();
    setAnswer(liveTranslation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-display text-ink select-none">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative rounded-sm border-2 border-[#544127] bg-[#fbf5e7] shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b-2 border-[#544127] bg-[#3a2c1a] px-4 py-1.5 text-[10px] tracking-[0.25em] text-[#d6c7a7] uppercase">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span>Top Roll Navigational Ruler</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#a8987b]">
              Speed Bonus Cap: {Math.max(0, SPEED_BONUS_CAP_SEC - elapsedSec)}s (+{speedBonusRemaining} XP)
            </span>
            <span className="h-2 w-2 rounded-full bg-gold" />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-3">
            <div>
              <span className="block text-[11px] font-bold tracking-[0.2em] text-[#786136] uppercase">
                Decryption Docket: {meta.docket}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-[#231a10]">
                Coded Dispatch &bull; Sector {meta.roman}: {mission.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded border border-gold/70 bg-[#ede0c6] px-3 py-1.5 text-xs text-[#523e1f] shadow-inner">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="font-bold tracking-wider uppercase">
                Imperial Sealing Certified
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#635133]">
              <span>Encrypted Signal:</span>
              <span className="text-[#84714f]">Caesar Cipher Protocol</span>
            </div>
            <div className="cipher-text mt-2 rounded border border-ink/30 bg-[#efe4cd] p-4 text-center text-lg sm:text-xl font-bold text-[#2d2214] shadow-inner break-words">
              {ciphertext}
            </div>
          </div>

          {/* Manual Shift Controller */}
          <div className="mt-6 rounded border border-gold/50 bg-[#f4ebd6] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#635133]">
                  Manual Shift Offset Controller
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleShiftChange(0)}
                disabled={solved}
                className="flex items-center gap-1 rounded border border-ink/20 bg-[#e8dbc0] px-2 py-0.5 text-xs font-semibold text-[#473822] hover:bg-[#dccdb0]"
              >
                <RotateCcw className="h-3 w-3 text-gold" />
                <span>Reset (0)</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6b5839]">Shift Key:</span>
                <div className="flex items-center rounded border border-ink/30 bg-[#fcf9f2] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleShiftChange(dialShift - 1)}
                    disabled={solved}
                    className="h-9 w-9 flex items-center justify-center bg-[#ece0c9] hover:bg-[#dfd1b5]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={dialShift}
                    disabled={solved}
                    onChange={(e) => handleShiftChange(parseInt(e.target.value, 10) || 0)}
                    className="h-9 w-14 text-center font-display text-base font-bold text-wax bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleShiftChange(dialShift + 1)}
                    disabled={solved}
                    className="h-9 w-9 flex items-center justify-center bg-[#ece0c9] hover:bg-[#dfd1b5]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <span className="text-[10px] text-[#78674d]">0</span>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={dialShift}
                  disabled={solved}
                  onChange={(e) => handleShiftChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#dfceb0] rounded-lg cursor-pointer accent-wax"
                />
                <span className="text-[10px] text-[#78674d]">25</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-ink/10">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#635133]">
                <span>Transcribed Working Slate (Shift +{dialShift}):</span>
                <button
                  type="button"
                  onClick={handleFillFromSlate}
                  className="flex items-center gap-1 rounded border border-ink/20 bg-[#e7d8bb] px-2 py-0.5 text-[11px] font-semibold text-[#453621] hover:bg-[#d9c8a7]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-wax" /> Applied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-gold" /> Use In Answer
                    </>
                  )}
                </button>
              </div>
              <div className="cipher-text mt-2 min-h-16 rounded border-2 border-gold/40 bg-[#ded0b6] p-3 text-center text-lg sm:text-xl font-bold text-wax shadow-inner break-words">
                {liveTranslation}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Manual Plaintext Answer & Submission Form */}
      <div className="mt-6 rounded border border-gold/50 bg-[#f9f2e3] p-6 shadow-lg">
        <label
          htmlFor="desk-answer-input"
          className="block text-xs font-bold uppercase tracking-wider text-[#695431] border-b border-ink/15 pb-2"
        >
          Plaintext Decryption Submission
        </label>

        <div className="mt-4 flex flex-col gap-4">
          <input
            id="desk-answer-input"
            type="text"
            value={answer}
            disabled={solved}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheckAnswer();
            }}
            placeholder="Enter plaintext transcription..."
            className="w-full rounded border-2 border-ink/30 bg-[#fefcf8] px-4 py-3 font-display text-base sm:text-lg font-bold tracking-wider text-ink shadow-inner focus:border-wax focus:outline-none focus:ring-2 focus:ring-wax/30 disabled:bg-[#eee3ce]"
          />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <motion.button
              type="button"
              animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              onClick={handleCheckAnswer}
              disabled={solved || answer.trim() === ""}
              className="flex items-center justify-center gap-2 rounded border border-[#591b17] bg-gradient-to-b from-[#b24c45] via-wax to-[#742b26] px-6 py-3.5 text-base font-bold uppercase tracking-widest text-[#fbf5e8] shadow-lg hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>Submit Decryption</span>
            </motion.button>

            <button
              type="button"
              onClick={handleBuyHint}
              disabled={solved || hintsUsed >= mission.hints.length || progress.ink < 1}
              className="flex items-center justify-between gap-3 rounded border border-gold/60 bg-[#eee0c5] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#473722] shadow hover:bg-[#e2d2b3] active:scale-95 disabled:opacity-50 transition-all"
            >
              <div className="flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-[#4f8fa7]" />
                <span>Buy Hint (-1 Ink)</span>
              </div>
              <span className="rounded bg-[#281f13] px-2 py-0.5 text-[11px] font-bold text-gold">
                {progress.ink} Left
              </span>
            </button>
          </div>

          {feedback && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: -4 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              role="status"
              aria-live="polite"
              className={`flex items-center gap-2 rounded p-3 text-xs font-bold tracking-wide ${
                feedback.type === "success"
                  ? "border border-wax/40 bg-wax/10 text-wax"
                  : feedback.type === "error"
                  ? "border border-red-800/40 bg-red-900/10 text-red-950"
                  : "border border-gold/40 bg-gold/10 text-[#544327]"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-wax" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </motion.div>
          )}

          {revealedHints.length > 0 && (
            <div className="mt-2 rounded border border-ink/20 bg-[#f1e6d0] p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#695634]">
                <HelpCircle className="h-3.5 w-3.5 text-gold" /> Revealed Clues ({revealedHints.length}/3)
              </span>
              <ul className="mt-2 space-y-2">
                {revealedHints.map((clue, idx) => (
                  <li
                    key={idx}
                    className="rounded border border-ink/10 bg-[#faf3e6] p-2.5 text-xs italic text-[#3f3320]"
                  >
                    <span className="font-bold not-italic text-wax mr-1">
                      Clue #{idx + 1}:
                    </span>
                    {clue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {solved && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
              className="mt-4 rounded border-2 border-gold/70 bg-[#f7ecd4] p-5 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gold/40 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-gold" />
                  <h4 className="text-xl font-bold text-[#231a0e]">
                    Sector {meta.roman} Charting Order Complete
                  </h4>
                </div>
                <span className="rounded bg-wax px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-parchment">
                  Approved
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-4 text-center text-xs">
                <div className="rounded border border-ink/10 bg-parchment p-2">
                  <span className="block text-[10px] text-[#716147] uppercase">Base Reward</span>
                  <span className="text-sm font-bold text-gold">+{mission.xp} XP</span>
                </div>
                <div className="rounded border border-ink/10 bg-parchment p-2">
                  <span className="block text-[10px] text-[#716147] uppercase">Shift Verified</span>
                  <span className="text-sm font-bold text-wax">Key +{mission.shift}</span>
                </div>
                <div className="rounded border border-ink/10 bg-parchment p-2">
                  <span className="block text-[10px] text-[#716147] uppercase">Ink Bounty</span>
                  <span className="text-sm font-bold text-[#3c788e]">+2 Ink Flasks</span>
                </div>
                <div className="rounded border border-ink/10 bg-parchment p-2">
                  <span className="block text-[10px] text-[#716147] uppercase">Total Accrued</span>
                  <span className="text-sm font-bold text-gold">
                    +{earnedScore ?? mission.xp} XP
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onReturnToMap}
                  className="rounded border border-ink/30 bg-[#ecdcc3] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#3d2f1c] hover:bg-[#dfceb2] active:scale-95 transition-all"
                >
                  Return to World Map
                </button>
                <button
                  type="button"
                  onClick={onNextSector}
                  className="flex items-center gap-1.5 rounded border border-[#523d21] bg-gradient-to-b from-[#dfc17f] via-[#be953e] to-[#7f5d1e] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#211709] shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  <span>Proceed to Next Sector</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
