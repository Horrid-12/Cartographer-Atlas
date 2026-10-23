import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import {
  computeCiphertext,
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
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [startedAt] = useState(() => Date.now());

  function submit() {
    if (solved) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (normalize(answer) === normalize(mission.plaintext)) {
      const timeSec = (Date.now() - startedAt) / 1000;
      const score = scoreMission(mission, nextAttempts, hintsUsed, timeSec);
      setSolved(true);
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
    <Card variant="framed">
      <h2 className="text-2xl font-bold">{mission.title}</h2>
      <p className="mt-1 text-sm text-ink/70">{mission.place}</p>
      <div className="cipher-text mt-6 rounded-md border border-ink/20 bg-ink/5 p-4 text-center text-lg">
        {ciphertext}
      </div>
      <div className="mt-6 flex flex-col gap-3">
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
      <p className="mt-4 text-xs text-ink/50">Shift {mission.shift}</p>
    </Card>
  );
}
