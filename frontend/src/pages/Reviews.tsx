import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api, ReviewItem } from '../services/api';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import { MasteryBar } from '../components/ui/MasteryBar';

export default function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadReviews = async () => {
    try {
      const data = await api.getReviews();
      setReviews(data);
    } catch (err) {
      console.error('Erro ao listar revisões:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleComplete = async (topicId: number) => {
    setCompletingId(topicId);
    try {
      const res = await api.completeReview(topicId);
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(''), 4000);
      await loadReviews();
    } catch (err: any) {
      setActionMessage(err.message || 'Erro ao concluir revisão.');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-neon-blue tracking-widest">
            <RotateCcw size={14} /> Repetição Espaçada
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
            Centro de Revisão Tática
          </h1>
          <p className="text-xs md:text-sm text-text-muted mt-0.5">
            Mantenha os conteúdos na memória de longo prazo antes que a curva do esquecimento atue.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 text-right font-mono self-start sm:self-center min-w-36">
          <div className="text-[10px] text-text-muted uppercase">REVISÕES HOJE</div>
          <div className="text-xl font-bold text-neon-blue">
            {reviews.length} pendente(s)
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent-bright text-xs flex items-center gap-2 font-mono animate-fadeIn">
          <CheckCircle2 size={14} /> {actionMessage}
        </div>
      )}

      {/* Explicação da Repetição Espaçada */}
      <div className="quest-card p-5 border-neon-blue/20 bg-gradient-to-r from-neon-blue/5 via-bg-card to-bg-card flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-neon-blue" />
          <span className="text-xs font-mono uppercase font-bold text-text-primary">
            COMO FUNCIONA O CICLO ESPAÇADO
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Ao revisar um tópico, o intervalo para a próxima revisão aumenta progressivamente:
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-text-primary">
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">1º Dia (+1d)</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">3 Dias (+3d)</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">7 Dias (+7d)</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">14 Dias (+14d)</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-md bg-neon-blue/20 border border-neon-blue/40 text-neon-blue font-bold">
            30 Dias (Memória Consolidada)
          </span>
        </div>
      </div>

      {/* Lista de Revisões Pendentes */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-mono font-bold text-text-primary uppercase flex items-center gap-2">
          <Clock size={16} /> ASSUNTOS AGENDADOS PARA HOJE
        </h3>

        {loading ? (
          <div className="quest-card text-center py-12 text-xs text-text-muted">
            Carregando revisões...
          </div>
        ) : reviews.length === 0 ? (
          <div className="quest-card text-center py-12 flex flex-col items-center gap-3">
            <CheckCircle2 size={36} className="text-success" />
            <h4 className="text-sm font-mono font-bold text-text-primary uppercase">
              Ciclo de Revisões do Dia Concluído!
            </h4>
            <p className="text-xs text-text-muted max-w-md">
              Nenhuma matéria vencida hoje. Para agendar revisões automáticas, continue resolvendo questões no sistema.
            </p>
            <button
              onClick={() => navigate('/questions')}
              className="quest-btn-primary text-xs mt-1"
            >
              Ir para o Banco de Questões
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="quest-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 hover:border-neon-blue/30 transition-all"
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-mono text-xs font-bold text-text-primary">
                      {rev.topic_name}
                    </h4>
                    {rev.area && <DisciplineBadge discipline={rev.area} />}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-text-muted">
                      Ciclo #{rev.review_count + 1} ({rev.interval_days}d)
                    </span>
                  </div>

                  <div className="w-48">
                    <MasteryBar score={rev.mastery_score || 0} size="sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => navigate(`/questions?discipline=${rev.area}`)}
                    className="quest-btn-secondary text-xs flex items-center gap-1.5"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Praticar Questões</span>
                  </button>

                  <button
                    onClick={() => handleComplete(rev.topic_id)}
                    disabled={completingId === rev.topic_id}
                    className="quest-btn-primary text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    <span>{completingId === rev.topic_id ? 'Gravando...' : 'Concluir (+50 XP)'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
