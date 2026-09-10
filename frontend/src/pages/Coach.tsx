import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  MessageSquare,
  Sparkles,
  Target,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Play,
  CheckCircle2,
  BookOpen,
  Filter,
} from 'lucide-react';
import { api, CoachData, TopicPriority } from '../services/api';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import { MasteryBar } from '../components/ui/MasteryBar';

export default function Coach() {
  const navigate = useNavigate();
  const [coachData, setCoachData] = useState<CoachData | null>(null);
  const [priorities, setPriorities] = useState<TopicPriority[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'treino' | 'perguntas' | 'prioridades'>('treino');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCoach(), api.getPriorities()])
      .then(([cd, prio]) => {
        setCoachData(cd);
        setPriorities(prio);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getPriorityBadge = (level: string) => {
    switch (level) {
      case 'CRÍTICO':
        return 'text-error bg-error/15 border-error/30 font-black';
      case 'ALTO':
        return 'text-warning bg-warning/15 border-warning/30 font-bold';
      case 'MÉDIO':
        return 'text-neon-blue bg-neon-blue/15 border-neon-blue/30 font-semibold';
      case 'BAIXO':
        return 'text-text-muted bg-white/5 border-white/10';
      case 'DOMINADO':
        return 'text-success bg-success/15 border-success/30 font-bold';
      default:
        return 'text-text-muted bg-white/5';
    }
  };

  if (loading || !coachData) {
    return (
      <div className="quest-card text-center py-16 text-xs text-text-muted max-w-4xl mx-auto">
        Processando diagnóstico cognitivo do Coach IA...
      </div>
    );
  }

  const activeQuestion = coachData.coreAnswers[selectedQuestionIndex] || coachData.coreAnswers[0];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
            <BrainCircuit size={14} /> Treinador Pedagógico Pessoal
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
            Coach Acadêmico
          </h1>
          <p className="text-xs md:text-sm text-text-muted mt-0.5">
            Diagnóstico baseado em dados reais, respostas estratégicas e treino diário calibrado.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 font-mono text-xs self-start sm:self-center">
          <span className="text-text-muted">FOCO HOJE:</span>{' '}
          <strong className="text-accent">{coachData.summaryMetrics.worstTopic}</strong>
        </div>
      </div>

      {/* Cartões de Raio-X do Estudante */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="quest-card p-4">
          <span className="text-[10px] font-mono text-text-muted uppercase">Pior Matéria</span>
          <div className="text-sm font-bold text-error mt-1 truncate">
            {coachData.summaryMetrics.worstArea}
          </div>
        </div>

        <div className="quest-card p-4">
          <span className="text-[10px] font-mono text-text-muted uppercase">Maior Lacuna</span>
          <div className="text-sm font-bold text-warning mt-1 truncate">
            {coachData.summaryMetrics.worstTopic}
          </div>
        </div>

        <div className="quest-card p-4">
          <span className="text-[10px] font-mono text-text-muted uppercase">Causa Dominante</span>
          <div className="text-sm font-bold text-neon-blue mt-1 truncate">
            {coachData.summaryMetrics.dominantErrorReason}
          </div>
        </div>

        <div className="quest-card p-4">
          <span className="text-[10px] font-mono text-text-muted uppercase">Ritmo / Velocidade</span>
          <div className="text-sm font-bold text-success mt-1 truncate">
            {coachData.summaryMetrics.speedDiagnosis.split('.')[0]}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('treino')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            activeTab === 'treino'
              ? 'bg-accent text-white font-bold'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Treino de Hoje (80 min)
        </button>
        <button
          onClick={() => setActiveTab('perguntas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            activeTab === 'perguntas'
              ? 'bg-accent text-white font-bold'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Perguntas ao Coach
        </button>
        <button
          onClick={() => setActiveTab('prioridades')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            activeTab === 'prioridades'
              ? 'bg-accent text-white font-bold'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Matriz de Prioridades
        </button>
      </div>

      {/* Conteúdo da Tab: Treino de Hoje (Seção 27) */}
      {activeTab === 'treino' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary uppercase font-mono flex items-center gap-2">
                <Target size={18} className="text-accent" /> {coachData.dailyPlan.title}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Plano tático de {coachData.dailyPlan.totalMinutes} minutos focado em{' '}
                <strong className="text-text-primary">{coachData.dailyPlan.primaryFocus}</strong>.
              </p>
            </div>
            <span className="text-xs font-mono text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/30 font-bold">
              {coachData.dailyPlan.totalMinutes} min total
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {coachData.dailyPlan.blocks.map((block, idx) => (
              <div
                key={idx}
                className="quest-card p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 hover:border-accent/30 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono text-xs font-bold text-text-primary uppercase">
                        {block.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-text-muted">
                        <Clock size={10} className="inline mr-1" />
                        {block.durationMinutes} min
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(block.url)}
                  className="quest-btn-secondary text-xs shrink-0 self-end sm:self-center flex items-center gap-1.5"
                >
                  <span>{block.action}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo da Tab: Perguntas ao Coach (Seção 26) */}
      {activeTab === 'perguntas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Menu de Perguntas */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase text-text-muted tracking-wider mb-1">
              PERGUNTAS FREQUENTES AO COACH
            </span>
            {coachData.coreAnswers.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQuestionIndex(idx)}
                className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                  selectedQuestionIndex === idx
                    ? 'border-accent bg-accent/15 text-accent-bright font-bold'
                    : 'border-white/5 bg-bg-secondary text-text-secondary hover:border-white/20'
                }`}
              >
                <span>{item.question}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>

          {/* Resposta Detalhada */}
          <div className="md:col-span-2 quest-card p-6 flex flex-col justify-between gap-5 border-accent/30 bg-gradient-to-br from-accent/5 via-bg-card to-bg-card">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-accent" />
                <span className="font-mono text-xs font-bold text-accent-bright uppercase">
                  {activeQuestion.question}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-bg-secondary border border-white/5 text-xs text-text-primary leading-relaxed">
                {activeQuestion.answer}
              </div>

              <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-xs text-text-secondary leading-relaxed">
                <strong className="text-accent block font-mono text-[11px] mb-0.5">
                  RECOMENDAÇÃO PEDAGÓGICA:
                </strong>
                {activeQuestion.recommendation}
              </div>
            </div>

            {activeQuestion.actionUrl && (
              <button
                onClick={() => navigate(activeQuestion.actionUrl!)}
                className="quest-btn-primary text-xs self-start flex items-center gap-1.5"
              >
                <span>Executar Orientação do Coach</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo da Tab: Matriz de Prioridades (Seções 58 e 59) */}
      {activeTab === 'prioridades' && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-mono font-bold text-text-primary uppercase flex items-center gap-2">
              <Filter size={16} /> CLASSIFICAÇÃO PEDAGÓGICA DOS TÓPICOS ({priorities.length})
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Assuntos classificados automaticamente em CRÍTICO, ALTO, MÉDIO, BAIXO e DOMINADO.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {priorities.map((item) => (
              <div
                key={item.topicId}
                className="quest-card p-4 flex flex-col justify-between gap-3 border border-white/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-mono text-xs font-bold text-text-primary">
                      {item.topicName}
                    </h4>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getPriorityBadge(
                        item.priorityLevel
                      )}`}
                    >
                      {item.priorityLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <DisciplineBadge discipline={item.area} />
                    <span className="text-[10px] font-mono text-text-muted">
                      {item.questionsAnswered} questão(ões) · {item.wrongAnswers} erro(s)
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
                    {item.recommendationReason}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <div className="w-28">
                    <MasteryBar score={item.masteryScore} size="sm" />
                  </div>
                  <button
                    onClick={() => navigate(`/questions?discipline=${item.area}`)}
                    className="quest-btn-secondary text-[10px] py-1 px-2.5"
                  >
                    Treinar Tópico
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
