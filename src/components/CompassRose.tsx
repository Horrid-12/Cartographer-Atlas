export function CompassRose({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(42,36,25,0.35)]"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="#f4ebdb"
          stroke="#4a3c28"
          strokeWidth="2.5"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="#8f7a59"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <circle
          cx="100"
          cy="100"
          r="74"
          fill="none"
          stroke="#4a3c28"
          strokeWidth="1.5"
        />

        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const x1 = 100 + Math.cos(angle) * 86;
          const y1 = 100 + Math.sin(angle) * 86;
          const x2 = 100 + Math.cos(angle) * (i % 9 === 0 ? 76 : 81);
          const y2 = 100 + Math.sin(angle) * (i % 9 === 0 ? 76 : 81);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#4a3c28"
              strokeWidth={i % 9 === 0 ? 1.5 : 0.8}
            />
          );
        })}

        <polygon points="100,100 93,100 100,14" fill="#97403a" />
        <polygon points="100,100 107,100 100,14" fill="#662520" />

        <polygon points="100,100 100,93 186,100" fill="#a9813c" />
        <polygon points="100,100 100,107 186,100" fill="#5c441b" />

        <polygon points="100,100 107,100 100,186" fill="#a9813c" />
        <polygon points="100,100 93,100 100,186" fill="#5c441b" />

        <polygon points="100,100 100,107 14,100" fill="#a9813c" />
        <polygon points="100,100 100,93 14,100" fill="#5c441b" />

        <polygon points="100,100 96,104 160,40" fill="#c4aa6f" />
        <polygon points="100,100 104,96 160,40" fill="#6a5223" />

        <polygon points="100,100 104,104 160,160" fill="#c4aa6f" />
        <polygon points="100,100 96,96 160,160" fill="#6a5223" />

        <polygon points="100,100 104,96 40,160" fill="#c4aa6f" />
        <polygon points="100,100 96,104 40,160" fill="#6a5223" />

        <polygon points="100,100 96,96 40,40" fill="#c4aa6f" />
        <polygon points="100,100 104,104 40,40" fill="#6a5223" />

        <circle
          cx="100"
          cy="100"
          r="16"
          fill="#f2e8d5"
          stroke="#4a3c28"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="100"
          r="10"
          fill="#a9813c"
          stroke="#382813"
          strokeWidth="1.5"
        />
        <circle cx="100" cy="100" r="4" fill="#2a2419" />

        <text
          x="100"
          y="26"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#97403a"
          fontFamily="serif"
        >
          N
        </text>
        <text
          x="174"
          y="104"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#4a3c28"
          fontFamily="serif"
        >
          E
        </text>
        <text
          x="100"
          y="180"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#4a3c28"
          fontFamily="serif"
        >
          S
        </text>
        <text
          x="26"
          y="104"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#4a3c28"
          fontFamily="serif"
        >
          W
        </text>
      </svg>
    </div>
  );
}
