'use client';

interface SeedPhraseGridProps {
  words: string[];
  columns?: number;
}

export function SeedPhraseGrid({ words }: SeedPhraseGridProps) {
  return (
    <div className="my-6 rounded-lg border border-zinc-700/50 bg-zinc-900/50 p-3 sm:p-6 shadow-inner w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 w-full">
        {words.map((word, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 sm:gap-2 rounded-md border border-zinc-700/30 bg-zinc-950/50 p-2 sm:p-3 transition hover:border-cyan-500/30 hover:bg-zinc-900/50 hover:shadow-sm min-w-0"
          >
            <span className="text-xs font-semibold text-zinc-500 sm:text-sm min-w-[1.5rem] sm:min-w-[2rem] tabular-nums shrink-0">
              {index + 1}.
            </span>
            <code className="flex-1 font-mono text-xs sm:text-base font-medium text-cyan-300 truncate sm:break-all">
              {word}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
