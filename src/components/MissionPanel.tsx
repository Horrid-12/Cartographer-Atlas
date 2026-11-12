import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import {
  computeCiphertext,
  decodeText,
  scoreMission,
  HINT_TIERS,
  hintInkCost,
  hintScorePenaltyFor,
  type Mission,
} from "../lib/game";
import { getClue } from "../lib/ai";
import {
  playClick,
  playHintSound,
  playErrorSound,
  playSuccessSound,
} from "../lib/audio";
import {
  KeyRound,
  RotateCcw,
  Minus,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  Droplets,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Lock,
} from "lucide-react";

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function MissionPanel({
  mission,
  ink,
  revealedCount,
  onSolve,
  onUseHint,
}: {
  mission: Mission;
  ink?: number;
  revealedCount: number;
  onSolve: (
    score: number,
    missionId: string,
    stats?: { attempts: number; hintScorePenalty: number; timeSec: number }
  ) => void;
  onUseHint: (tier: number) => boolean;
}) {
  const ciphertext = computeCiphertext(mission);
  const [dialShift, setDialShift] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [solved, setSolved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [startedAt] = useState(() => Date.now());

  // Ladder state derived from the session purchase count owned by App.
  // Once solved, every tier reads as revealed for display purposes only —
  // the score penalty always uses the actual `revealedCount` purchases.
  const ladderRevealed = solved ? HINT_TIERS.length : revealedCount;
  const controllerUnlocked = ladderRevealed >= HINT_TIERS.length;
  const nextTierUnlocked = revealedCount < HINT_TIERS.length;
  const nextTierCost = nextTierUnlocked ? hintInkCost(revealedCount) : 0;
  const canAffordNext = typeof ink !== "number" || ink >= nextTierCost;

  const liveTranslation = decodeText(ciphertext, dialShift);

  function handleShiftChange(newShift: number) {
    if (solved) return;
    const normalized = ((newShift % 26) + 26) % 26;
    playClick();
    setDialShift(normalized);
  }

  function handleShiftInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") {
      setDialShift(0);
      return;
    }
    const val = parseInt(raw, 10);
    if (!Number.isNaN(val)) {
      handleShiftChange(val);
    }
  }

  function handleApplyToAnswer() {
    playClick();
    setAnswer(liveTranslation);
    setApplied(true);
    setTimeout(() => setApplied(false), 1400);
  }

  function submit() {
    if (solved || isSubmitting || answer.trim() === "") return;
    setIsSubmitting(true);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (normalize(answer) === normalize(mission.plaintext)) {
      const timeSec = Math.floor((Date.now() - startedAt) / 1000);
      const hintScorePenalty = hintScorePenaltyFor(revealedCount);
      const score = scoreMission(mission, nextAttempts, hintScorePenalty, timeSec);
      setSolved(true);
      setDialShift(mission.shift);
      playSuccessSound();
      setFeedback({
        type: "success",
        text: `Cipher Decoded! Sovereign mandate approved (+${score} XP).`,
      });
      onSolve(score, mission.id, {
        attempts: nextAttempts,
        hintScorePenalty,
        timeSec,
      });
    } else {
      setIsSubmitting(false);
      playErrorSound();
      setFeedback({
        type: "error",
        text: "The translation does not match the cipher record. Adjust shift key or verify plaintext.",
      });
    }
  }

  /**
   * Purchases the next rung of the hint ladder (`tier` must equal the
   * current revealed count — App enforces the sequential contract).
   */
  function useHint(tier: number) {
    if (solved) return;
    if (tier !== revealedCount) {
      setFeedback({
        type: "info",
        text: "The archivists reveal their clues in order — consult the current rung first.",
      });
      return;
    }
    if (!nextTierUnlocked) {
      setFeedback({
        type: "info",
        text: "The archival clue is already active. Use the Manual Cipher Shift Controller.",
      });
      return;
    }
    const ok = onUseHint(tier);
    if (!ok) {
      playErrorSound();
      setFeedback({
        type: "error",
        text: "Insufficient ink reserves in your surveyor flask.",
      });
      return;
    }
    playHintSound();
    const isFinalTier = tier === HINT_TIERS.length - 1;
    setFeedback({
      type: "success",
      text: isFinalTier
        ? "Archival Cipher Record Revealed: Manual Cipher Shift Controller unlocked."
        : `Archival Clue Revealed (Tier ${tier + 1}): the search narrows.`,
    });
  }

  return (
    <Card variant="framed" className="space-y-6 bg-[#fbf5e7] p-6 sm:p-8 font-display text-ink shadow-lg">
      {/* Header Plaque */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-3">
        <div>
          <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#735d33]">
            Survey Dispatch &bull; {mission.place}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-[#231a10]">
            {mission.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-gold/70 bg-[#ede0c6] px-3 py-1 text-xs font-bold text-[#5c4623] shadow-inner">
            +{mission.xp} XP Bounty
          </span>
          {solved && (
            <span className="rounded bg-wax px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-parchment shadow">
              Decrypted
            </span>
          )}
        </div>
      </div>

      {/* Encrypted Signal Display */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#635133]">
          <span>Encrypted Signal (Caesar Protocol):</span>
          <span className="text-[#84714f]">{ciphertext.length} Runes</span>
        </div>
        <div className="cipher-text mt-2 rounded border border-ink/30 bg-[#efe4cd] p-4 text-center text-lg sm:text-xl font-bold text-[#2d2214] shadow-inner break-words select-all">
          {ciphertext}
        </div>
      </div>

      {/* Hint Ladder: revealed rungs readable, next rung buyable, later rungs locked */}
      <div className="rounded-md border border-dashed border-gold/50 bg-[#f4ebd6]/50 p-4">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#735d33]">
          <Lightbulb className="h-4 w-4 text-gold" />
          <span>{revealedCount === 0 ? "Archival Clue Locked" : "Archival Hint Ladder"}</span>
        </div>
        <p className="mt-1 text-xs text-[#635133]/80">
          {revealedCount === 0
            ? `Consult the clue below (-${hintInkCost(0)} Ink) to reveal the Manual Cipher Shift Controller.`
            : "Each rung narrows the search — only the final rung records the exact shift."}
        </p>

        <ol className="mt-3 space-y-2">
          {HINT_TIERS.map((tier, index) => {
            const isRevealed = index < ladderRevealed;
            const isNext = !solved && index === revealedCount && nextTierUnlocked;

            return (
              <li
                key={index}
                className={`rounded border p-2.5 text-left ${
                  isRevealed
                    ? "border-gold/60 bg-[#efe4cd]"
                    : isNext
                    ? "border-ink/25 bg-[#fcf9f2]"
                    : "border-ink/15 bg-[#f4ebd6]/60 opacity-80"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6b5839]">
                    {isRevealed ? (
                      <Check className="h-3.5 w-3.5 text-wax" aria-hidden="true" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-[#8a7a5c]" aria-hidden="true" />
                    )}
                    {`Rung ${index + 1} of ${HINT_TIERS.length}`}
                  </span>
                  <span className="text-[10px] font-semibold text-[#78674d]">
                    {`Cost: ${tier.ink} Ink & ${tier.score} Score XP`}
                  </span>
                </div>

                {isRevealed ? (
                  <p className="mt-1.5 whitespace-pre-line text-xs italic leading-relaxed text-[#473620]">
                    {getClue(mission, index)}
                  </p>
                ) : isNext ? (
                  <button
                    type="button"
                    onClick={() => useHint(index)}
                    disabled={!canAffordNext}
                    className="mt-1.5 flex items-center gap-1.5 rounded border border-gold/70 bg-[#e8dbc0] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#473822] hover:bg-[#dccdb0] active:scale-95 disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                  >
                    <Droplets className="h-3.5 w-3.5 text-[#4a89a0]" aria-hidden="true" />
                    {`Consult Rung ${index + 1} (${hintInkCost(index)} Ink)`}
                  </button>
                ) : (
                  <p className="mt-1.5 text-[11px] text-[#78674d]">
                    {`Locked — purchase Rung ${index} first.`}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Manual Cipher Shift Controller — unlocked by the final rung */}
      {controllerUnlocked ? (
        <div className="rounded-md border border-gold/60 bg-[#f4ebd6] p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-2.5">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-gold" />
              <h3 className="text-sm sm:text-base font-bold text-[#2d2214] tracking-wide">
                Clue: Manual Cipher Shift Controller
              </h3>
            </div>
            <button
              type="button"
              onClick={() => handleShiftChange(0)}
              disabled={solved}
              className="flex items-center gap-1 rounded border border-ink/20 bg-[#e8dbc0] px-2.5 py-1 text-xs font-semibold text-[#473822] hover:bg-[#dccdb0] active:scale-95 disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <RotateCcw className="h-3 w-3 text-gold" />
              <span>Reset (0)</span>
            </button>
          </div>

          {/* Archival Decryption Hint */}
          <div className="mt-3.5 rounded border-l-4 border-gold bg-[#efe4cd] p-3 text-[#3b2d18] shadow-inner">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#735d33] mb-1">
              <Lightbulb className="h-3.5 w-3.5 text-gold shrink-0" />
              <span>Cartographer&apos;s Field Clue:</span>
            </div>
            <p className="italic leading-relaxed text-xs sm:text-sm text-[#473620] whitespace-pre-line">
              {getClue(mission, mission.hints.length - 1)}
            </p>
          </div>

          {/* Stepper & Direct Number Input */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="manual-shift-input"
                className="text-xs font-bold uppercase tracking-wider text-[#6b5839]"
              >
                Shift Offset Key:
              </label>
              <div className="flex items-center rounded border-2 border-ink/30 bg-[#fcf9f2] shadow-inner overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleShiftChange(dialShift - 1)}
                  disabled={solved}
                  aria-label="Decrease shift key offset"
                  className="flex h-10 w-10 items-center justify-center bg-[#ece0c9] text-ink hover:bg-[#dfd1b5] active:scale-95 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  id="manual-shift-input"
                  type="number"
                  min={0}
                  max={25}
                  value={dialShift}
                  disabled={solved}
                  onChange={handleShiftInput}
                  aria-label="Caesar shift key offset from 0 to 25"
                  className="h-10 w-16 text-center font-display text-lg font-bold text-wax bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleShiftChange(dialShift + 1)}
                  disabled={solved}
                  aria-label="Increase shift key offset"
                  className="flex h-10 w-10 items-center justify-center bg-[#ece0c9] text-ink hover:bg-[#dfd1b5] active:scale-95 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Slider for accessibility & fast scrubbing */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="text-[11px] text-[#78674d]">0</span>
              <input
                type="range"
                min={0}
                max={25}
                value={dialShift}
                disabled={solved}
                onChange={(e) => handleShiftChange(parseInt(e.target.value, 10))}
                aria-label="Shift key scrub slider"
                className="w-full h-2 bg-[#dfceb0] rounded-lg appearance-none cursor-pointer accent-wax disabled:opacity-50"
              />
              <span className="text-[11px] text-[#78674d]">25</span>
            </div>
          </div>

          {/* Transcribed Working Slate Live Output */}
          <div className="mt-4 pt-3 border-t border-ink/10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#635133]">
              <span>
                Transcribed Working Slate (Shift +{dialShift}):
              </span>
              <button
                type="button"
                onClick={handleApplyToAnswer}
                disabled={solved}
                className="flex items-center gap-1 rounded border border-ink/20 bg-[#e7d8bb] px-2.5 py-1 text-xs font-bold text-wax hover:bg-[#dfcead] active:scale-95 disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                {applied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-wax" />
                    <span>Applied to Answer</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-gold" />
                    <span>Apply to Answer &darr;</span>
                  </>
                )}
              </button>
            </div>
            <div className="cipher-text mt-2 min-h-14 rounded border-2 border-gold/50 bg-[#ded0b6] p-3.5 text-center text-lg sm:text-xl font-bold text-wax shadow-inner break-words">
              {liveTranslation}
            </div>
          </div>
        </div>
      ) : null}

      {/* Plaintext Manual Text Input & Submission */}
      <div className="space-y-3">
        <label
          htmlFor="plaintext-solution-input"
          className="block text-xs font-bold uppercase tracking-wider text-ink/80"
        >
          Plaintext Decryption Solution
        </label>
        <input
          id="plaintext-solution-input"
          type="text"
          value={answer}
          disabled={solved}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder={
            controllerUnlocked
              ? "Type the decoded message or use the transcribed slate above..."
              : "Type the decoded message or consult clue for shift controller..."
          }
          className="w-full rounded border-2 border-ink/30 bg-[#fefcf8] px-4 py-3 font-display text-base sm:text-lg font-bold tracking-wider text-ink shadow-inner focus:border-wax focus:outline-none focus:ring-2 focus:ring-wax/40 disabled:bg-[#eee3ce]"
        />

        {/* Action Buttons: Submit & Clue */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            onClick={submit}
            disabled={solved || isSubmitting || answer.trim() === ""}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 text-base font-bold uppercase tracking-wider shadow-md cursor-pointer"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Submit Decryption</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => useHint(revealedCount)}
            disabled={
              solved ||
              !nextTierUnlocked ||
              (typeof ink === "number" && ink < nextTierCost)
            }
            className="min-h-[44px] flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
          >
            {controllerUnlocked ? (
              <>
                <Check className="h-4 w-4 text-wax" />
                <span>Clue Active (Shift Controller)</span>
              </>
            ) : (
              <>
                <Droplets className="h-4 w-4 text-[#4a89a0]" />
                <span>
                  Consult Clue {revealedCount + 1} ({nextTierCost} Ink)
                  {typeof ink === "number" ? ` (${ink} Left)` : ""}
                </span>
              </>
            )}
          </Button>
        </div>

        {/* Feedback Banner with Accessibility Status */}
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-2 flex items-center gap-2 rounded p-3 text-xs font-bold tracking-wide shadow-sm ${
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
          </div>
        )}

        {/* Solved Summary */}
        {solved && (
          <p className="mt-2 text-xs text-ink/70">
            Shift verified: Key +{mission.shift}. Attempts: {attempts}. Rungs consulted: {revealedCount} of {HINT_TIERS.length}.
          </p>
        )}
      </div>
    </Card>
  );
}
