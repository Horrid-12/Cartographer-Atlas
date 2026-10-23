import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Trophy,
  Droplets,
  ArrowRight,
  MapPin,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  scoreMission,
  SPEED_BONUS_CAP_SEC,
  SPEED_PER_SEC,
  ATTEMPT_PENALTY,
  HINT_SCORE_COST,
  type Mission,
} from "../lib/game";
import { Button } from "./Button";
import { playAllSealsBrokenSound, playSuccessSound, playClick } from "../lib/audio";

export interface ScoreBreakdown {
  baseXp: number;
  speedBonus: number;
  attemptPenalty: number;
  hintPenalty: number;
  finalXp: number;
  timeSec: number;
  attempts: number;
  hintsUsed: number;
}

export function computeScoreBreakdown(
  mission: Mission,
  attempts: number,
  hintsUsed: number,
  timeSec: number
): ScoreBreakdown {
  const time = Number.isFinite(timeSec) ? timeSec : Infinity;
  const speedBonus = Math.max(0, SPEED_BONUS_CAP_SEC - time) * SPEED_PER_SEC;
  const attemptPenalty = Math.max(0, (attempts - 1) * ATTEMPT_PENALTY);
  const hintPenalty = hintsUsed * HINT_SCORE_COST;
  const finalXp = scoreMission(mission, attempts, hintsUsed, timeSec);

  return {
    baseXp: mission.xp,
    speedBonus,
    attemptPenalty,
    hintPenalty,
    finalXp,
    timeSec,
    attempts,
    hintsUsed,
  };
}

export interface VictoryOverlayProps {
  mission: Mission;
  breakdown?: ScoreBreakdown;
  score?: number;
  attempts?: number;
  hintsUsed?: number;
  timeSec?: number;
  isFirstCompletion?: boolean;
  inkAwarded?: number;
  xpAwarded?: number;
  previousRank?: string;
  newRank?: string;
  isRankUp?: boolean;
  isAllThreeComplete?: boolean;
  hasNextMission?: boolean;
  onContinue?: () => void;
  onReturnToMap: () => void;
}

export function VictoryOverlay({
  mission,
  breakdown,
  score,
  attempts = 1,
  hintsUsed = 0,
  timeSec = 0,
  isFirstCompletion = true,
  inkAwarded,
  xpAwarded,
  previousRank,
  newRank,
  isRankUp = false,
  isAllThreeComplete = false,
  hasNextMission = false,
  onContinue,
  onReturnToMap,
}: VictoryOverlayProps) {
  const reducedMotion = useReducedMotion();

  const activeBreakdown: ScoreBreakdown =
    breakdown ??
    computeScoreBreakdown(
      mission,
      attempts,
      hintsUsed,
      timeSec
    );

  const finalScore = score !== undefined ? score : activeBreakdown.finalXp;
  const effectiveInk = inkAwarded !== undefined ? inkAwarded : (isFirstCompletion ? 2 : 0);
  const effectiveXpAwarded = xpAwarded !== undefined ? xpAwarded : (isFirstCompletion ? finalScore : 0);

  // Animated count-up for XP display
  const [displayXp, setDisplayXp] = useState(reducedMotion ? activeBreakdown.finalXp : 0);

  useEffect(() => {
    if (isAllThreeComplete) {
      playAllSealsBrokenSound();
    } else {
      playSuccessSound();
    }
  }, [isAllThreeComplete]);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayXp(activeBreakdown.finalXp);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1100;
    const target = activeBreakdown.finalXp;

    if (target === 0) {
      setDisplayXp(0);
      return;
    }

    let animId: number;
    const step = (now: number) => {
      if (!startTimestamp) startTimestamp = now;
      const progress = Math.min((now - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayXp(Math.round(eased * target));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [activeBreakdown.finalXp, reducedMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
        delayChildren: reducedMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mission Victory"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14100b]/80 backdrop-blur-sm overflow-y-auto select-none"
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 15 }}
        animate={reducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-xl my-8 rounded-lg border-2 border-gold/70 bg-[#faf4e6] p-6 sm:p-8 font-display text-ink shadow-2xl parchment"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          {/* Animated Wax Seal or Engraved Checkmark */}
          <div className="flex justify-center">
            <motion.div
              initial={reducedMotion ? false : { scale: 2.2, rotate: -25, opacity: 0 }}
              animate={reducedMotion ? undefined : { scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 16,
                delay: reducedMotion ? 0 : 0.1,
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#591d19] bg-gradient-to-br from-[#b64b44] via-wax to-[#5c211d] text-parchment shadow-2xl wax-seal-shadow"
            >
              <div className="flex h-18 w-18 items-center justify-center rounded-full border border-gold/60 bg-[#7a2823] shadow-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 text-parchment drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  aria-label="Engraved checkmark"
                >
                  <motion.path
                    d="M20 6L9 17L4 12"
                    initial={reducedMotion ? false : { pathLength: 0 }}
                    animate={reducedMotion ? undefined : { pathLength: 1 }}
                    transition={{ duration: 0.45, delay: reducedMotion ? 0 : 0.35 }}
                  />
                </svg>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full border border-gold/30" />
            </motion.div>
          </div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mt-4">
            <span className="block text-[11px] font-bold tracking-[0.25em] uppercase text-[#735d33]">
              {isFirstCompletion
                ? "Her Majesty's Imperial Seal Verified"
                : "Imperial Archive Record"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-[#231a10] mt-0.5">
              {isFirstCompletion ? "Mission Accomplished!" : "Archival Replay Complete"}
            </h2>
            <p className="mt-1 text-sm text-[#54432a]">
              Sector: <strong className="text-ink">{mission.title}</strong> ({mission.place})
            </p>
          </motion.div>

          {/* Decrypted Plaintext Inscription */}
          <motion.div
            variants={itemVariants}
            className="mt-4 rounded border border-ink/20 bg-[#efe4cd] p-4 text-center shadow-inner"
          >
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b5839]">
              Deciphered Plaintext Inscription
            </span>
            <p className="mt-1.5 text-base sm:text-lg font-bold tracking-wider text-wax italic break-words">
              &ldquo;{mission.plaintext}&rdquo;
            </p>
            <span className="mt-1 block text-[10px] text-[#78674d]">
              {`Caesar Rotor Alignment Verified • Key +${mission.shift}`}
            </span>
          </motion.div>

          {/* Count-Up XP & Ink Reward Cards */}
          <motion.div variants={itemVariants} className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded border border-gold/60 bg-[#f4ebd6] p-3 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6e5d3f]">
                Mission Score
              </span>
              <div className="mt-1 flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-2xl sm:text-3xl font-bold text-gold">
                  +{displayXp}
                </span>
                <span className="text-xs font-bold text-gold">XP</span>
              </div>
              <span className="text-[10px] text-[#7a6b52]">
                {isFirstCompletion
                  ? `+${effectiveXpAwarded} XP Added to Dossier`
                  : "Score logged for attempt"}
              </span>
            </div>

            <div className="rounded border border-gold/60 bg-[#f4ebd6] p-3 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6e5d3f]">
                Ink Flask Bounty
              </span>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <Droplets className="h-5 w-5 text-[#3b7c93]" />
                <span className="text-2xl sm:text-3xl font-bold text-[#30687c]">
                  +{effectiveInk}
                </span>
                <span className="text-xs font-bold text-[#30687c]">Ink</span>
              </div>
              <span className="text-[10px] text-[#7a6b52]">
                {isFirstCompletion
                  ? "+2 Imperial Ink Flasks Awarded"
                  : "First bounty already claimed"}
              </span>
            </div>
          </motion.div>

          {/* Score Calculus Breakdown */}
          <motion.div
            variants={itemVariants}
            className="mt-4 rounded border border-ink/15 bg-parchment p-3 text-xs"
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6b583a] border-b border-ink/10 pb-1 mb-2">
              Official Score Calculus
            </span>
            <div className="space-y-1.5 text-[#3f321f]">
              <div className="flex justify-between items-center">
                <span className="text-[#61523b]">Base Mission XP:</span>
                <span className="font-bold text-ink">{`+${activeBreakdown.baseXp} XP`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#61523b]">
                  {`Speed Bonus (${Math.round(activeBreakdown.timeSec)}s / 60s cap):`}
                </span>
                <span className="font-bold text-gold">{`+${activeBreakdown.speedBonus} XP`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#61523b]">
                  {`Attempt Penalty (${activeBreakdown.attempts} attempt${activeBreakdown.attempts !== 1 ? "s" : ""}):`}
                </span>
                <span className="font-bold text-wax">
                  {activeBreakdown.attemptPenalty > 0
                    ? `-${activeBreakdown.attemptPenalty} XP`
                    : "-0 XP"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#61523b]">
                  {`Hint Penalty (${activeBreakdown.hintsUsed} hint${activeBreakdown.hintsUsed !== 1 ? "s" : ""}):`}
                </span>
                <span className="font-bold text-wax">
                  {activeBreakdown.hintPenalty > 0
                    ? `-${activeBreakdown.hintPenalty} XP`
                    : "-0 XP"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-ink/10 pt-1 font-bold text-sm">
                <span className="text-ink">Final Calculated Score:</span>
                <span className="text-gold">{`+${activeBreakdown.finalXp} XP`}</span>
              </div>
            </div>
          </motion.div>

          {/* Replay Notice (if replay) */}
          {!isFirstCompletion && (
            <motion.div
              variants={itemVariants}
              className="mt-3 rounded border border-ink/20 bg-[#efe6d3] p-2.5 text-center text-xs text-[#524430]"
            >
              <div className="flex items-center justify-center gap-1 font-bold text-wax">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Archival Notice: Mission Replayed</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#665742]">
                First completion rewards were credited upon initial survey. Dossier XP and Ink remain preserved.
              </p>
            </motion.div>
          )}

          {/* Rank-Up Celebration Moment */}
          {isRankUp && newRank && (
            <motion.div
              variants={itemVariants}
              className="mt-4 rounded border-2 border-gold bg-gradient-to-r from-[#e7c77c]/25 via-gold/15 to-[#e7c77c]/25 p-3.5 text-center shadow-md"
            >
              <div className="flex items-center justify-center gap-2 text-gold">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-xs">
                  Cartographic Promotion Bestowed!
                </span>
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="mt-1 text-lg font-bold text-wax tracking-wide">
                {newRank}
              </div>
              {previousRank && (
                <span className="text-[11px] text-[#554631] italic">
                  {`Advanced from ${previousRank}`}
                </span>
              )}
            </motion.div>
          )}

          {/* All-Seals-Complete Celebration State */}
          {isAllThreeComplete && (
            <motion.div
              variants={itemVariants}
              className="mt-4 rounded border-2 border-wax bg-[#97403a]/15 p-3.5 text-center shadow-md"
            >
              <div className="flex items-center justify-center gap-2 text-wax">
                <Trophy className="h-5 w-5 text-gold" />
                <span className="font-bold uppercase tracking-wider text-xs">
                  All Royal Seals Restored
                </span>
                <Trophy className="h-5 w-5 text-gold" />
              </div>
              <p className="mt-1 text-sm font-bold text-[#231a0e]">
                The Cartographer&apos;s Atlas is Complete!
              </p>
              <p className="mt-0.5 text-[11px] text-[#574834] italic">
                All three core dispatches across the archipelago have been successfully deciphered.
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-ink/10"
          >
            <Button
              variant="secondary"
              onClick={onReturnToMap}
              className="flex items-center gap-1.5"
            >
              <MapPin className="h-4 w-4 text-gold" />
              <span>Return to Map</span>
            </Button>

            {hasNextMission && onContinue && (
              <Button
                variant="primary"
                onClick={onContinue}
                className="flex items-center gap-1.5"
              >
                <span>Continue to Next Mission</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
