import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { CipherWheel } from "./CipherWheel";
import {
  computeCiphertext,
  decodeText,
  scoreMission,
  HINT_INK_COST,
  type Mission,
} from "../lib/game";
import { getClue } from "../lib/ai";

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function MissionPanel({
  mission,
  onSolve,
  onUseHint,
}: {
  mission: Mission;
  onSolve: (score: number, missionId: string) => void;
  onUseHint: () => boolean;
}) {
  const ciphertext = computeCiphertext(mission);
  const [dialShift, setDialShift] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const liveTranslation = decodeText(ciphertext, dialShift);

  function submit() {
    if (solved) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (normalize(answer) === normalize(mission.plaintext)) {
      const timeSec = (Date.now() - startedAt) / 1000;
      const score = scoreMission(mission, nextAttempts, hintsUsed, timeSec);
      setSolved(true);
      setDialShift(mission.shift);
      setFeedback(`Solved. +${score} XP`);
      onSolve(score, mission.id);
    } else {
      setFeedback("Not quite. Try again.");
    }
  }

  function useHint() {
    if (solved) return;
    if (hintsUsed >= mission.hints.length) {
      setFeedback("No more hints.");
      return;
    }
    const ok = onUseHint();
    if (!ok) {
      setFeedback("Not enough ink.");
      return;
    }
    setHintsUsed((value) => value + 1);
    setHint(getClue(mission, hintsUsed));
  }

  return (
    <Card variant="framed" className="space-y-6 bg-[#fbf5e7]">
      <div className="flex items-center justify-between border-b border-ink/15 pb-2">
        <div>
          <h2 className="text-2xl font-bold">{mission.title}</h2>
          <p className="mt-1 text-sm text-ink/70">{mission.place}</p>
        </div>
        <span className="rounded border border-gold/60 bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold">
          +{mission.xp} XP
        </span>
      </div>

      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-ink/70">
          Encrypted Signal
        </span>
        <div className="cipher-text mt-2 rounded-md border border-ink/20 bg-ink/5 p-4 text-center text-lg font-bold">
          {ciphertext}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="block text-xs font-bold uppercase tracking-wider text-ink/70">
            Transcribed Working Slate (Shift +{dialShift})
          </span>
          <button
            type="button"
            onClick={() => setAnswer(liveTranslation)}
            className="text-xs font-semibold text-wax hover:underline"
          >
            Apply to answer
          </button>
        </div>
        <div className="cipher-text mt-2 rounded-md border-2 border-gold/40 bg-[#ded0b6] p-4 text-center text-lg font-bold text-wax">
          {liveTranslation}
        </div>
      </div>

      <CipherWheel
        shift={dialShift}
        onShiftChange={setDialShift}
        targetShift={mission.shift}
        solved={solved}
      />

      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={answer}
          disabled={solved}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder="Type the plaintext"
          className="rounded-md border border-ink/30 bg-parchment px-3 py-2 font-display text-ink focus:outline-none focus:ring-2 focus:ring-wax/60"
        />
        <div className="flex gap-2">
          <Button onClick={submit} disabled={solved || answer.trim() === ""}>
            Submit
          </Button>
          <Button variant="secondary" onClick={useHint} disabled={solved}>
            Hint ({HINT_INK_COST} ink)
          </Button>
        </div>
        {hint ? <p className="text-sm text-ink/80">{hint}</p> : null}
        {feedback ? <p className="text-sm font-bold">{feedback}</p> : null}
        {solved ? (
          <p className="text-xs text-ink/60">
            Shift used: {mission.shift}. Attempts: {attempts}. Hints:{" "}
            {hintsUsed}.
          </p>
        ) : null}
      </div>
    </Card>
  );
}
