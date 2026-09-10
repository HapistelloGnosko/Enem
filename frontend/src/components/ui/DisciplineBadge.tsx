const DISCIPLINE_MAP: Record<string, { label: string; style: string }> = {
  matematica: {
    label: 'Matemática',
    style: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30',
  },
  'ciencias-natureza': {
    label: 'C. Natureza',
    style: 'text-success bg-success/10 border-success/30',
  },
  'ciencias-humanas': {
    label: 'C. Humanas',
    style: 'text-warning bg-warning/10 border-warning/30',
  },
  linguagens: {
    label: 'Linguagens',
    style: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
};

export function DisciplineBadge({ discipline }: { discipline: string }) {
  const info = DISCIPLINE_MAP[discipline] || {
    label: discipline,
    style: 'text-text-muted bg-white/5 border-white/10',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${info.style}`}>
      {info.label}
    </span>
  );
}
