import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library as LibraryIcon, BookOpen, ChevronRight } from 'lucide-react';
import { api, LibraryAreaGroup } from '../services/api';
import { MasteryBar } from '../components/ui/MasteryBar';

const AREA_STYLES: Record<string, { color: string; borderColor: string }> = {
  matematica: { color: 'text-neon-blue', borderColor: 'border-neon-blue/20' },
  'ciencias-natureza': { color: 'text-success', borderColor: 'border-success/20' },
  'ciencias-humanas': { color: 'text-warning', borderColor: 'border-warning/20' },
  linguagens: { color: 'text-purple-400', borderColor: 'border-purple-500/20' },
};

export default function LibraryPage() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<LibraryAreaGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getLibrary()
      .then((res) => setAreas(res.areas))
      .catch((err) => console.error('Erro ao carregar biblioteca:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
          <LibraryIcon size={14} /> Biblioteca de Conteúdos
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
          Todos os Assuntos do ENEM
        </h1>
        <p className="text-xs md:text-sm text-text-muted mt-0.5">
          Resumos, pontos-chave e pegadinhas comuns de cada assunto cobrado nas quatro áreas do ENEM.
        </p>
      </div>

      {loading ? (
        <div className="quest-card text-center py-12 text-xs text-text-muted">
          Carregando biblioteca...
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {areas.map((group) => {
            const style = AREA_STYLES[group.area] || {
              color: 'text-text-primary',
              borderColor: 'border-white/10',
            };

            return (
              <div key={group.area} className={`quest-card border ${style.borderColor} flex flex-col gap-4`}>
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/5">
                  <h2 className={`text-base font-bold ${style.color}`}>{group.areaLabel}</h2>
                  <span className="text-xs text-text-muted font-mono">
                    {group.topics.length} assunto(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {group.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => navigate(`/library/${topic.id}`)}
                      className="text-left p-3.5 rounded-xl bg-bg-secondary border border-white/5 hover:border-neon-blue/30 transition-all flex flex-col gap-2 group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-sm text-text-primary flex items-center gap-1.5">
                          <BookOpen size={13} className="text-text-muted shrink-0" />
                          {topic.name}
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-text-muted group-hover:text-neon-blue transition-colors shrink-0"
                        />
                      </div>

                      {topic.summary && (
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                          {topic.summary}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-3 mt-1">
                        <div className="flex-1">
                          <MasteryBar score={topic.masteryScore} size="sm" />
                        </div>
                        <span className="text-[10px] font-mono text-text-muted shrink-0">
                          {topic.cachedQuestionsCount} questão(ões) no banco
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
