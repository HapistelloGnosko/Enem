import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BookX,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  Flame,
  HelpCircle,
  Pencil,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { api, CodexError, CodexStats } from '../services/api';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import { DifficultyBadge } from '../components/ui/DifficultyBadge';

const ERROR_REASONS = [
  'Não conhecia o conteúdo',
  'Interpretação',
  'Cálculo',
  'Distração',
  'Falta de tempo',
  'Confusão conceitual',
  'Chute',
];

export default function Codex() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<CodexError[]>([]);
  const [stats, setStats] = useState<CodexStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedReasonFilter, setSelectedReasonFilter] = useState('');
  const [editingAttemptId, setEditingAttemptId] = useState<number | null>(null);
  const [tempReason, setTempReason] = useState('');
  const [tempNotes, setTempNotes] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const loadCodex = async () => {
    try {
      const data = await api.getCodex(100);
      setErrors(data.errors);
      setStats(data.stats);
    } catch (err) {
      console.error('Erro ao carregar Codex:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCodex();
  }, []);

  const handleSaveReason = async (attemptId: number) => {
    try {
      await api.classifyError(attemptId, tempReason, tempNotes);
      setActionMessage('Motivo e anotações atualizados no Codex.');
      setTimeout(() => setActionMessage(''), 3000);
      setEditingAttemptId(null);
      await loadCodex();
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredErrors = errors.filter((err) => {
    if (!selectedReasonFilter) return true;
    return (err.error_reason || 'Não Classificado') === selectedReasonFilter;
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-error tracking-widest">
            <BookX size={14} /> Raio-X Cognitivo
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
            Codex dos Erros
          </h1>
          <p className="text-xs md:text-sm text-text-muted mt-0.5">
            Mapeamento tático de falhas, causas de erro e detecção de padrões reincidentes.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 text-right font-mono self-start sm:self-center min-w-36">
          <div className="text-[10px] text-text-muted uppercase">TOTAL DE ERROS</div>
          <div className="text-xl font-bold text-error">
            {stats?.totalErrors ?? 0}
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent-bright text-xs flex items-center gap-2 font-mono animate-fadeIn">
          <CheckCircle2 size={14} /> {actionMessage}
        </div>
      )}

      {/* Alerta de Padrões Detectados (Seção 23) */}
      {stats?.recurrentPatterns && stats.recurrentPatterns.length > 0 && (
        <div className="flex flex-col gap-3">
          {stats.recurrentPatterns.map((pat) => (
            <div
              key={pat.topic_id}
              className="p-5 rounded-2xl bg-error/10 border-2 border-error/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-error uppercase tracking-wider">
                      ⚠ PADRÃO DETECTADO
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-error/20 text-error font-bold">
                      {pat.error_count} erros reincidentes
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-text-primary mt-0.5">
                    Fraqueza crítica em {pat.topic_name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Você errou este tipo de problema {pat.error_count} vezes. Recomendação tática:
                    revisão conceitual urgente seguida de bateria de 3 fáceis, 3 médias e 1 ENEM.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/questions?discipline=${pat.area}`)}
                className="quest-btn-primary text-xs shrink-0 self-start md:self-center"
              >
                Remediar Este Tópico
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grid de Estatísticas do Codex */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Motivos Classificados */}
        <div className="quest-card p-5 md:col-span-2 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-text-muted tracking-wider">
                DISTRIBUIÇÃO DOS MOTIVOS DE ERRO
              </span>
              <HelpCircle size={14} className="text-text-muted" />
            </div>
            {stats?.byReason && stats.byReason.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.byReason.map((r) => (
                  <button
                    key={r.reason}
                    onClick={() =>
                      setSelectedReasonFilter(selectedReasonFilter === r.reason ? '' : r.reason)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all ${
                      selectedReasonFilter === r.reason
                        ? 'border-accent bg-accent/20 text-accent-bright font-bold'
                        : 'border-white/5 bg-bg-secondary text-text-secondary hover:border-white/20'
                    }`}
                  >
                    <span>{r.reason}</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/5 text-text-muted text-[10px]">
                      {r.count}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">Nenhum motivo classificado ainda.</p>
            )}
          </div>
          <p className="text-[11px] text-text-muted font-mono border-t border-white/5 pt-2">
            Dica: clique em uma categoria acima para filtrar os erros correspondentes.
          </p>
        </div>

        {/* Tópicos com Mais Erros */}
        <div className="quest-card p-5 flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted tracking-wider mb-2 block">
              ZONA DE MAIOR VULNERABILIDADE
            </span>
            <div className="flex flex-col gap-2">
              {stats?.byTopic && stats.byTopic.length > 0 ? (
                stats.byTopic.slice(0, 4).map((t) => (
                  <div
                    key={t.topic_id}
                    className="flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-text-primary truncate">{t.topic_name}</span>
                    <span className="text-error font-bold shrink-0">{t.error_count} erros</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted">Sem dados de erros por assunto.</p>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/reviews')}
            className="quest-btn-secondary text-[11px] w-full mt-2"
          >
            Abrir Centro de Revisão
          </button>
        </div>
      </div>

      {/* Lista de Questões Erradas */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-text-primary uppercase flex items-center gap-2">
            <Filter size={14} /> HISTÓRICO DE FALHAS ({filteredErrors.length})
          </h3>
          {selectedReasonFilter && (
            <button
              onClick={() => setSelectedReasonFilter('')}
              className="text-xs font-mono text-accent hover:underline"
            >
              Limpar filtro ({selectedReasonFilter})
            </button>
          )}
        </div>

        {loading ? (
          <div className="quest-card text-center py-12 text-xs text-text-muted">
            Carregando erros...
          </div>
        ) : filteredErrors.length === 0 ? (
          <div className="quest-card text-center py-12 text-xs text-text-muted">
            Nenhum erro registrado neste filtro. Excelente precisão!
          </div>
        ) : (
          filteredErrors.map((err) => {
            const isExpanded = expandedId === err.attempt_id;
            const isEditing = editingAttemptId === err.attempt_id;

            return (
              <div
                key={err.attempt_id}
                className="quest-card p-4 border border-white/5 flex flex-col gap-3 transition-all hover:border-white/15"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-text-primary">
                      ENEM {err.year} · Questão {err.question_number}
                    </span>
                    <DisciplineBadge discipline={err.discipline} />
                    <DifficultyBadge difficulty={err.difficulty} />
                    {err.topic_name && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-text-muted">
                        {err.topic_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        err.error_reason
                          ? 'bg-accent/15 border-accent/30 text-accent-bright font-semibold'
                          : 'bg-white/5 border-white/10 text-text-muted'
                      }`}
                    >
                      {err.error_reason || 'Classificar Motivo'}
                    </span>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : err.attempt_id)}
                      className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {err.statement}
                </p>

                {/* Bloco Expandido: Análise Completa + Edição de Motivo */}
                {isExpanded && (
                  <div className="border-t border-white/5 pt-3 flex flex-col gap-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error">
                        Sua resposta: <strong>Letra {err.selected_answer}</strong>
                      </div>
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-success">
                        Gabarito oficial: <strong>Letra {err.correct_answer}</strong>
                      </div>
                    </div>

                    {err.explanation && (
                      <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 text-xs text-text-secondary leading-relaxed">
                        <strong className="text-text-primary block font-mono mb-1">
                          Explicação Pedagógica:
                        </strong>
                        {err.explanation}
                      </div>
                    )}

                    {/* Classificação do Motivo */}
                    <div className="p-3.5 rounded-xl bg-bg-secondary border border-white/5 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-text-primary uppercase flex items-center gap-1.5">
                          <Pencil size={12} /> Diagnóstico Pessoal do Erro
                        </span>
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setEditingAttemptId(err.attempt_id);
                              setTempReason(err.error_reason || ERROR_REASONS[0]);
                              setTempNotes(err.user_notes || '');
                            }}
                            className="text-[11px] font-mono text-accent hover:underline"
                          >
                            Editar motivo e nota
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <label className="text-[10px] font-mono text-text-muted">
                            Por que você acha que errou?
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {ERROR_REASONS.map((reason) => (
                              <button
                                key={reason}
                                type="button"
                                onClick={() => setTempReason(reason)}
                                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                                  tempReason === reason
                                    ? 'bg-accent text-white font-semibold'
                                    : 'bg-white/5 text-text-secondary hover:bg-white/10'
                                }`}
                              >
                                {reason}
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Anotação pessoal (ex: esqueci de inverter o sinal na equação)..."
                            className="w-full mt-1 p-2 rounded-lg bg-bg-tertiary border border-white/10 text-xs text-text-primary focus:outline-none focus:border-accent"
                            rows={2}
                          />

                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => handleSaveReason(err.attempt_id)}
                              className="quest-btn-primary text-xs py-1"
                            >
                              Salvar no Codex
                            </button>
                            <button
                              onClick={() => setEditingAttemptId(null)}
                              className="quest-btn-secondary text-xs py-1"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-text-muted">
                          <div>
                            Motivo registrado:{' '}
                            <strong className="text-text-primary">
                              {err.error_reason || 'Nenhum motivo selecionado'}
                            </strong>
                          </div>
                          {err.user_notes && (
                            <div className="mt-1 italic text-text-secondary">
                              "{err.user_notes}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => navigate(`/questions/${err.question_id}`)}
                        className="quest-btn-secondary text-xs flex items-center gap-1.5"
                      >
                        <RotateCcw size={12} />
                        <span>Refazer Questão</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
