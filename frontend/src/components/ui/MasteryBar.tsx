interface Props {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function getMasteryInfo(score: number) {
  if (score >= 80) return { label: 'Dominado', color: 'bg-success', textColor: 'text-success' };
  if (score >= 60) return { label: 'Consistente', color: 'bg-neon-blue', textColor: 'text-neon-blue' };
  if (score >= 40) return { label: 'Desenvolvendo', color: 'bg-warning', textColor: 'text-warning' };
  if (score >= 20) return { label: 'Iniciando', color: 'bg-purple-500', textColor: 'text-purple-400' };
  return { label: 'Fraco', color: 'bg-error', textColor: 'text-error' };
}

export function MasteryBar({ score, showLabel = false, size = 'md' }: Props) {
  const info = getMasteryInfo(score);
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className={`mastery-track ${heightClass}`}>
        <div
          className={`mastery-fill ${info.color}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono">
          <span className={info.textColor}>{info.label}</span>
          <span className="text-text-muted">{score}/100</span>
        </div>
      )}
    </div>
  );
}
