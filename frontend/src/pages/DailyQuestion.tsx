import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Star, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { api, QuestionDetail } from '../services/api';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import { DifficultyBadge } from '../components/ui/DifficultyBadge';

export default function DailyQuestion() {
  const navigate = useNavigate();
  const [daily, setDaily] = useState<(QuestionDetail & { completed: boolean; date: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .dailyQuestion()
      .then((data) => setDaily(data))
      .catch((err) => console.error('Erro ao carregar questão do dia:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="quest-card max-w-2xl mx-auto text-center py-16 text-xs text-text-muted">
        Identificando questão do dia...
      </div>
    );
  }

  if (!daily) {
    return (
      <div className="quest-card max-w-2xl mx-auto text-center py-16 text-xs text-text-muted">
        Nenhuma questão do dia disponível no momento.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-neon-accent text-white">
          <Star size={20} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">
            Questão do Dia
          </h1>
          <p className="text-xs text-text-muted font-mono">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="quest-card border-accent/20 flex flex-col gap-5 p-6 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-text-primary">
              ENEM {daily.year} · Questão {daily.questionNumber}
            </span>
            <DisciplineBadge discipline={daily.discipline} />
            <DifficultyBadge difficulty={daily.difficulty} />
          </div>

          {daily.completed ? (
            <span className="px-3 py-1 rounded-full bg-success/15 border border-success/30 text-success text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} /> CONCLUÍDA
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent-bright text-xs font-mono font-bold flex items-center gap-1.5">
              <Zap size={14} /> PENDENTE (+75 XP)
            </span>
          )}
        </div>

        {daily.topic && (
          <div className="text-xs text-text-secondary font-mono">
            Tópico: <strong className="text-text-primary">{daily.topic.name}</strong>
          </div>
        )}

        {daily.completed && daily.lastAttempt && (
          <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 flex items-center justify-between text-xs text-success font-mono">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Resposta registrada: Alternativa {daily.lastAttempt.selected_answer} ({daily.lastAttempt.correct === 1 ? 'Correta' : 'Incorreta'})
            </span>
            <span>+{daily.lastAttempt.xp_gained} XP</span>
          </div>
        )}

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
          {daily.statement}
        </p>

        <div className="flex items-center justify-between pt-2 gap-4 flex-wrap">
          <div className="text-xs text-text-muted font-mono">
            {daily.completed
              ? 'Missão do dia cumprida! Continue evoluindo no treino tático.'
              : 'Treinamento de consistência diária (+75 XP)'}
          </div>

          <div className="flex items-center gap-2">
            {daily.completed ? (
              <>
                <button
                  onClick={() => navigate(`/questions/${daily.id}`)}
                  className="quest-btn-secondary text-xs py-2.5 px-4"
                >
                  Rever Resolução
                </button>
                <button
                  onClick={async () => {
                    const nextQ = await api.getNextQuestion();
                    navigate(`/questions/${nextQ.id}`);
                  }}
                  className="quest-btn-primary flex items-center gap-2 text-xs py-2.5 px-5"
                >
                  <span>Próximo Desafio (Treino)</span>
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/questions/${daily.id}`)}
                className="quest-btn-primary flex items-center gap-2 text-xs py-2.5 px-5"
              >
                <span>Iniciar Questão do Dia</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
