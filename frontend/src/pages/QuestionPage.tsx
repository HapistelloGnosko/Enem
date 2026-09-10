import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';
import { api, QuestionDetail, AttemptResult } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import { DifficultyBadge } from '../components/ui/DifficultyBadge';
import { MasteryBar } from '../components/ui/MasteryBar';

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateUser } = useAppStore();

  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [codexDismissed, setCodexDismissed] = useState(false);

  // Cronômetro da questão
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function loadQuestion() {
      if (!id) return;
      setLoading(true);
      setError('');
      setResult(null);
      setSelectedAnswer(null);
      setTimeSpent(0);
      setCodexDismissed(false);

      try {
        if (id === 'next') {
          const nextQ = await api.getNextQuestion();
          navigate(`/questions/${nextQ.id}`, { replace: true });
          return;
        }

        const q = await api.getQuestion(parseInt(id));
        setQuestion(q);

        // Se o usuário já respondeu hoje com acerto, avisa ou pré-carrega
        if (q.lastAttempt && q.lastAttempt.correct === 1) {
          setSelectedAnswer(q.lastAttempt.selected_answer);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar questão.');
      } finally {
        setLoading(false);
      }
    }

    loadQuestion();
  }, [id]);

  // Inicia o cronômetro assim que a questão carregar (e para se tiver resultado)
  useEffect(() => {
    if (!loading && question && !result) {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, question, result]);

  const handleSelect = (letter: string) => {
    if (!result) {
      setSelectedAnswer(letter);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !question || submitting || result) return;

    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await api.submitAttempt(question.id, selectedAnswer, timeSpent);
      setResult(res);

      // Atualiza estado global do usuário com novo XP, nível e streak
      updateUser({
        xp: res.totalXp,
        level: res.newLevel,
        streak: res.streak,
        currentXp: res.progress.currentXp,
        nextLevelXp: res.progress.nextLevelXp,
        progress: res.progress.progress,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao submeter resposta.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="quest-card max-w-3xl mx-auto text-center py-16 text-xs text-text-muted">
        Carregando questão...
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="quest-card max-w-3xl mx-auto text-center py-16 flex flex-col items-center gap-4">
        <p className="text-sm text-error">{error || 'Questão não encontrada.'}</p>
        <button onClick={() => navigate('/questions')} className="quest-btn-secondary text-xs">
          Voltar ao Banco de Questões
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Barra de Ações Superior */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/questions')}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors font-mono"
        >
          <ArrowLeft size={14} /> Voltar ao Banco
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-text-muted">
          <Clock size={14} className={result ? 'text-text-muted' : 'text-accent animate-pulse'} />
          <span>{formatTimer(timeSpent)}</span>
        </div>
      </div>

      {/* Card da Questão */}
      <div className="quest-card flex flex-col gap-5">
        {/* Identificação da Questão (Seção 17) */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-text-primary">
              ENEM {question.year}
            </span>
            <span className="text-text-muted text-xs">·</span>
            <span className="font-mono text-xs text-accent-bright font-bold">
              QUESTÃO {question.questionNumber}
            </span>
            <DisciplineBadge discipline={question.discipline} />
            <DifficultyBadge difficulty={question.difficulty} />
          </div>

          {question.topic && (
            <span className="text-xs font-mono text-text-muted bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              {question.topic.name}
            </span>
          )}
        </div>

        {/* Contexto do Enunciado se existir */}
        {question.context && (
          <div className="text-xs md:text-sm text-text-secondary leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5 font-sans">
            {question.context}
          </div>
        )}

        {/* Imagem de apoio se houver */}
        {question.imageUrl && (
          <div className="flex justify-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
            <img
              src={question.imageUrl}
              alt={`Questão ${question.questionNumber}`}
              className="max-h-72 object-contain rounded-lg"
            />
          </div>
        )}

        {/* Enunciado Principal */}
        <div className="text-sm md:text-base text-text-primary font-medium leading-relaxed">
          {question.statement}
        </div>

        {/* Alternativas A, B, C, D, E */}
        <div className="flex flex-col gap-2.5 pt-2">
          {question.alternatives.map((alt) => {
            const isSelected = selectedAnswer === alt.letter;
            let buttonStyle = 'border-white/5 hover:border-white/15 bg-bg-secondary text-text-secondary';

            if (result) {
              if (alt.letter === result.correctAnswer) {
                buttonStyle = 'border-success bg-success/15 text-success font-semibold';
              } else if (isSelected && !result.correct) {
                buttonStyle = 'border-error bg-error/15 text-error';
              } else {
                buttonStyle = 'border-white/5 opacity-50 bg-bg-secondary text-text-muted';
              }
            } else if (isSelected) {
              buttonStyle = 'border-accent bg-accent/15 text-accent-bright font-semibold shadow-sm';
            }

            return (
              <button
                key={alt.letter}
                type="button"
                onClick={() => handleSelect(alt.letter)}
                disabled={!!result}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-xs md:text-sm text-left transition-all ${buttonStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-xs ${
                    result && alt.letter === result.correctAnswer
                      ? 'bg-success text-white'
                      : isSelected && result && !result.correct
                      ? 'bg-error text-white'
                      : isSelected
                      ? 'bg-accent text-white'
                      : 'bg-white/5 text-text-muted'
                  }`}
                >
                  {alt.letter}
                </span>

                <div className="flex-1 leading-relaxed">
                  {alt.text}
                  {alt.imageUrl && (
                    <img src={alt.imageUrl} alt={alt.letter} className="mt-2 max-h-40 rounded" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botão de Resposta */}
        {!result && (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || submitting}
            className="quest-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-3"
          >
            <span>{submitting ? 'Avaliando resposta...' : 'RESPONDER'}</span>
          </button>
        )}
      </div>

      {/* Painel Pós-Questão (Seção 18) */}
      {result && (
        <div
          className={`quest-card flex flex-col gap-5 border-2 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            result.correct ? 'border-success/30 bg-success/[0.03]' : 'border-error/30 bg-error/[0.03]'
          }`}
        >
          {/* Header do Resultado */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {result.correct ? (
                <CheckCircle size={32} className="text-success" />
              ) : (
                <XCircle size={32} className="text-error" />
              )}
              <div>
                <div
                  className={`text-xl font-mono font-black tracking-wider ${
                    result.correct ? 'text-success' : 'text-error'
                  }`}
                >
                  {result.correct ? 'RESPOSTA CORRETA' : 'RESPOSTA INCORRETA'}
                </div>
                <div className="text-xs text-text-muted font-mono">
                  Tempo gasto: {formatTimer(timeSpent)}
                </div>
              </div>
            </div>

            {/* Recompensa de XP */}
            {result.xpGained > 0 ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-accent/20 border border-accent/40 text-accent font-mono font-bold text-sm">
                <Sparkles size={16} /> +{result.xpGained} XP
              </div>
            ) : (
              <div className="text-xs text-text-muted font-mono">0 XP (anti-farm ou erro)</div>
            )}
          </div>

          {/* Subiu de Nível! */}
          {result.leveledUp && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-accent/20 to-neon-blue/20 border border-accent/40 flex items-center gap-3 text-xs text-text-primary">
              <Zap size={20} className="text-accent-bright" />
              <div>
                <strong className="text-accent-bright">LEVEL UP!</strong> Você avançou para o{' '}
                <strong className="font-mono">NÍVEL {result.newLevel}</strong>!
              </div>
            </div>
          )}

          {/* Recompensas Desbloqueadas (Títulos / Conquistas) */}
          {result.unlockedRewards && result.unlockedRewards.length > 0 && (
            <div className="flex flex-col gap-2">
              {result.unlockedRewards.map((rew, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/40 flex items-center justify-between gap-3 text-xs text-text-primary animate-in fade-in"
                >
                  <div className="flex items-center gap-2.5">
                    <Award size={20} className="text-accent-bright shrink-0" />
                    <div>
                      <div className="font-mono font-bold text-accent-bright uppercase text-[11px]">
                        {rew.type === 'title' ? 'NOVO TÍTULO DESBLOQUEADO!' : 'NOVA CONQUISTA ALCANÇADA!'}
                      </div>
                      <div className="text-text-primary font-semibold">
                        {rew.name} — <span className="text-text-muted font-normal">{rew.description}</span>
                      </div>
                    </div>
                  </div>
                  {rew.xpReward ? (
                    <span className="font-mono text-accent font-bold shrink-0">+{rew.xpReward} XP</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* Prompt do Codex dos Erros (apenas para respostas incorretas) */}
          {!result.correct && result.attemptId && !codexDismissed && (
            <div className="p-4 rounded-xl bg-bg-secondary border border-error/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-error/80 font-bold flex items-center gap-1.5">
                  <BookOpen size={13} /> Por que você acha que errou?
                </span>
                <button
                  onClick={() => setCodexDismissed(true)}
                  className="text-[10px] text-text-muted hover:text-text-primary font-mono"
                >
                  pular
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'lack_of_knowledge', label: 'Não sabia o conteúdo' },
                  { key: 'confusion', label: 'Confundi conceitos' },
                  { key: 'carelessness', label: 'Descuido / Distração' },
                  { key: 'misread', label: 'Errei a leitura' },
                  { key: 'time_pressure', label: 'Falta de tempo' },
                  { key: 'calculation_error', label: 'Erro de cálculo' },
                  { key: 'guessed', label: 'Chutei' },
                ].map((reason) => (
                  <button
                    key={reason.key}
                    onClick={async () => {
                      try {
                        await api.classifyError(result.attemptId!, reason.key);
                      } catch (_) { /* silencioso */ }
                      setCodexDismissed(true);
                    }}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:border-error/30 hover:bg-error/5 transition-all font-medium"
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Impacto na Maestria */}
          {question.topic && (
            <div className="p-4 rounded-xl bg-bg-secondary border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted font-mono uppercase">
                  Impacto na Maestria: <strong className="text-text-primary">{question.topic.name}</strong>
                </span>
                <span className="font-mono text-xs">
                  {result.oldMastery} →{' '}
                  <strong className={result.correct ? 'text-success' : 'text-error'}>
                    {result.newMastery}
                  </strong>{' '}
                  ({result.masteryDelta >= 0 ? `+${result.masteryDelta}` : result.masteryDelta})
                </span>
              </div>
              <MasteryBar score={result.newMastery} size="sm" />
            </div>
          )}

          {/* Explicação Pedagógica (Seção 19) */}
          {result.explanation && (
            <div className="p-4 rounded-xl bg-bg-secondary border border-white/5 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase text-accent-bright flex items-center gap-1.5 font-bold">
                <BookOpen size={14} /> Análise e Resolução do Conceito
              </span>
              <p className="text-xs text-text-secondary leading-relaxed">
                {result.explanation}
              </p>
            </div>
          )}

          {/* Botão de Próxima Questão */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setResult(null);
                setSelectedAnswer(null);
              }}
              className="text-xs text-text-muted hover:text-text-primary underline font-mono"
            >
              Revisar alternativas
            </button>

            <button
              onClick={async () => {
                try {
                  const nextQ = await api.getNextQuestion();
                  navigate(`/questions/${nextQ.id}`);
                } catch {
                  navigate('/questions');
                }
              }}
              className="quest-btn-primary flex items-center gap-2 text-xs py-3 px-6"
            >
              <span>PRÓXIMA QUESTÃO RECOMENDADA</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
