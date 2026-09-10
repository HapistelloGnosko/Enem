import { Sparkles } from 'lucide-react';

interface Props {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
  compact?: boolean;
}

export function XPBar({ level, currentXp, nextLevelXp, progress, compact = false }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Sparkles size={12} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">NÍVEL</span>
            <div className="font-mono text-xl font-black text-text-primary leading-none">
              {level}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs text-text-muted">
            <strong className="text-text-primary">{currentXp.toLocaleString('pt-BR')}</strong> / {nextLevelXp.toLocaleString('pt-BR')} XP
          </span>
        </div>
      </div>

      <div className={`mastery-track ${compact ? 'h-2' : 'h-2.5'}`}>
        <div
          className="mastery-fill bg-gradient-to-r from-accent via-accent-bright to-neon-blue shadow-neon-accent"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
