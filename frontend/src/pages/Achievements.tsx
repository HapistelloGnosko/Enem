import { useEffect, useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  BookOpen,
  Layers,
  Award,
  Shield,
  Flame,
  Target,
  RotateCcw,
} from 'lucide-react';
import { api, Achievement } from '../services/api';

const ICON_MAP: Record<string, any> = {
  Zap,
  BookOpen,
  Layers,
  Award,
  Shield,
  Flame,
  Sparkles,
  Target,
  Trophy,
  RotateCcw,
};

const CATEGORIES = ['TODAS', 'QUESTÕES', 'CONSISTÊNCIA', 'DESEMPENHO', 'ÁREAS', 'DESAFIOS'];

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('TODAS');

  useEffect(() => {
    api
      .getAchievements()
      .then((data) => setAchievements(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const filtered = achievements.filter((a) => {
    if (selectedCategory === 'TODAS') return true;
    return a.category.toUpperCase() === selectedCategory;
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
            <Trophy size={14} /> Medalhas & Conquistas RPG
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
            Quadro de Conquistas
          </h1>
          <p className="text-xs md:text-sm text-text-muted mt-0.5">
            Marcos da sua jornada de preparação e disciplina acadêmica.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 text-right font-mono self-start sm:self-center min-w-32">
          <div className="text-[10px] text-text-muted uppercase">DESBLOQUEADAS</div>
          <div className="text-xl font-bold text-accent">
            {unlockedCount} / {achievements.length}
          </div>
        </div>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              selectedCategory === cat
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'bg-bg-secondary border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Conquistas */}
      {loading ? (
        <div className="quest-card text-center py-12 text-xs text-text-muted">
          Carregando conquistas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="quest-card text-center py-12 text-xs text-text-muted">
          Nenhuma conquista encontrada nesta categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Trophy;
            return (
              <div
                key={item.id}
                className={`quest-card flex items-start gap-4 p-4 border transition-all ${
                  item.unlocked
                    ? 'border-accent/30 bg-accent/[0.04]'
                    : 'border-white/5 opacity-60 bg-bg-card'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    item.unlocked
                      ? 'bg-accent text-white shadow-neon-accent'
                      : 'bg-white/5 text-text-muted'
                  }`}
                >
                  {item.unlocked ? <IconComponent size={20} /> : <Lock size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wide">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono text-accent font-semibold flex items-center gap-1">
                      <Sparkles size={10} /> +{item.xp_reward} XP
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mt-2 pt-2 border-t border-white/5">
                    <span className={item.unlocked ? 'text-success font-semibold flex items-center gap-1' : ''}>
                      {item.unlocked ? (
                        <>
                          <CheckCircle2 size={11} /> Desbloqueada
                        </>
                      ) : (
                        'Bloqueada'
                      )}
                    </span>
                    <span>
                      {item.progress ?? 0} / {item.target_value}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
