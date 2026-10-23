import { motion } from "framer-motion";
import { Compass, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { caesar, decodeText } from "../lib/game";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface CipherWheelProps {
  shift: number;
  onShiftChange: (newShift: number) => void;
  targetShift?: number;
  solved?: boolean;
}

export function CipherWheel({
  shift,
  onShiftChange,
  targetShift,
  solved = false,
}: CipherWheelProps) {
  function stepShift(delta: number) {
    const next = ((shift + delta) % 26 + 26) % 26;
    onShiftChange(next);
  }

  function resetShift() {
    onShiftChange(0);
  }

  const shiftedA = caesar("A", shift, true);
  const decodedA = decodeText("A", shift);
  const anglePerLetter = 360 / 26;
  const rotationDegrees = shift * anglePerLetter;

  return (
    <div className="rounded border border-gold/50 bg-[#f9f2e3] p-5 shadow-lg font-display text-ink">
      <div className="flex flex-wrap items-center justify-between border-b border-ink/15 pb-2">
        <div>
          <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#735d33]">
            Mechanical Rotor System
          </span>
          <h3 className="text-xl font-bold text-[#231a10]">
            Concentric Astronomical Cipher Wheel
          </h3>
        </div>
        <button
          type="button"
          onClick={resetShift}
          className="flex items-center gap-1.5 rounded border border-ink/30 bg-[#ece0c9] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#453723] hover:bg-[#dfd1b8] active:scale-95 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5 text-gold" /> Reset Outer Gear
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[300px_1fr] items-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-72 w-72 items-center justify-center rounded-full border-4 border-[#3d2e1b] bg-gradient-to-br from-[#d4b470] via-[#8f6d2d] to-[#473413] p-2.5 shadow-2xl">
            <div className="absolute inset-1 rounded-full border border-gold/40 pointer-events-none" />

            <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-[#544127] bg-[#fbf5e8] shadow-inner overflow-hidden">
              <svg
                viewBox="0 0 240 240"
                className="absolute inset-0 h-full w-full pointer-events-none"
              >
                <circle
                  cx="120"
                  cy="120"
                  r="110"
                  fill="none"
                  stroke="#7e6949"
                  strokeWidth="1"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="92"
                  fill="none"
                  stroke="#473722"
                  strokeWidth="1.5"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="68"
                  fill="none"
                  stroke="#877353"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />

                {ALPHABET.map((char, index) => {
                  const angle = (index * anglePerLetter - 90) * (Math.PI / 180);
                  const x = 120 + Math.cos(angle) * 101;
                  const y = 120 + Math.sin(angle) * 101;
                  return (
                    <text
                      key={char}
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#2f2518"
                      fontFamily="serif"
                    >
                      {char}
                    </text>
                  );
                })}
              </svg>

              <motion.div
                animate={{ rotate: -rotationDegrees }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
                className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-gold/70 bg-[#ede0c8] shadow-md"
              >
                <svg
                  viewBox="0 0 144 144"
                  className="absolute inset-0 h-full w-full pointer-events-none"
                >
                  <circle
                    cx="72"
                    cy="72"
                    r="68"
                    fill="none"
                    stroke="#a68444"
                    strokeWidth="1"
                  />
                  {ALPHABET.map((char, index) => {
                    const angle = (index * anglePerLetter - 90) * (Math.PI / 180);
                    const x = 72 + Math.cos(angle) * 58;
                    const y = 72 + Math.sin(angle) * 58;
                    return (
                      <text
                        key={char}
                        x={x}
                        y={y + 3}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill="#594420"
                        fontFamily="serif"
                      >
                        {char}
                      </text>
                    );
                  })}
                </svg>

                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-gold/90 bg-[#211a12] text-parchment shadow-xl">
                  <Compass className="h-4 w-4 text-gold animate-[spin_40s_linear_infinite]" />
                  <span className="text-[10px] font-bold tracking-widest text-gold mt-0.5">
                    KEY: +{shift}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
          <span className="mt-2 text-[10px] italic text-[#6f5f46]">
            Outer Ring: Plaintext • Inner Rotor: Ciphertext
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded border border-ink/20 bg-[#f3ebd9] p-4">
            <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#6f5b35]">
              Mechanical Control Knobs
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base font-bold text-[#1f160d]">
                Stepped Gear Angle:
              </span>
              <span className="text-base font-bold text-wax">
                +{shift} (A &rarr; {shiftedA})
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => stepShift(-1)}
                className="flex items-center justify-center gap-2 rounded border border-[#523d21] bg-gradient-to-b from-[#dfc17f] to-[#a47e30] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#261c0d] shadow hover:brightness-105 active:scale-95 transition-all"
              >
                <ChevronLeft className="h-4 w-4" /> &mdash; Shift -1
              </button>
              <button
                type="button"
                onClick={() => stepShift(1)}
                className="flex items-center justify-center gap-2 rounded border border-[#523d21] bg-gradient-to-b from-[#dfc17f] to-[#a47e30] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#261c0d] shadow hover:brightness-105 active:scale-95 transition-all"
              >
                + Shift +1 <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="25"
                value={shift}
                onChange={(e) => onShiftChange(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <span className="min-w-6 text-right text-xs font-bold text-[#453723]">
                {shift}
              </span>
            </div>
          </div>

          <div className="rounded border border-ink/20 bg-[#f3ebd9] p-4">
            <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#6f5b35]">
              Alignment Calibration:
            </span>

            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded border border-ink/20 bg-parchment px-4 py-2.5 text-center">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#7e6e55]">
                  Ciphertext
                </span>
                <span className="text-xl font-bold text-[#1f170f]">A</span>
              </div>
              <span className="text-base text-gold font-bold">&hArr;</span>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#7e6e55]">
                  Plaintext
                </span>
                <span className="text-xl font-bold text-wax">{decodedA}</span>
              </div>
            </div>

            <p className="mt-2 text-xs italic leading-relaxed text-[#5e4f37]">
              Align glyphs until the transcribed working slate forms coherent navigational prose.
            </p>
          </div>

          {targetShift !== undefined && (
            <button
              type="button"
              onClick={() => onShiftChange(targetShift)}
              className="flex items-center justify-center gap-1.5 rounded border border-gold/60 bg-[#ebdec5] py-2 text-xs font-semibold uppercase tracking-wider text-[#4d3d25] hover:bg-[#e2d2b5] active:scale-95 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {solved
                ? `Lock Dial to Verified Shift (+${targetShift})`
                : `Auto-Align Rotor to Key (+${targetShift})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
