const DIFF_MAP: Record<string, { label: string; style: string }> = {
  easy: {
    label: 'Fácil',
    style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  medium: {
    label: 'Média',
    style: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  hard: {
    label: 'Difícil',
    style: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  very_hard: {
    label: 'Muito Difícil',
    style: 'text-red-500 bg-red-600/15 border-red-500/30 font-bold',
  },
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const info = DIFF_MAP[difficulty] || {
    label: difficulty,
    style: 'text-text-muted bg-white/5 border-white/10',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${info.style}`}>
      {info.label}
    </span>
  );
}
