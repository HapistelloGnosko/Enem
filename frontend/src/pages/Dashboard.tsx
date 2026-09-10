import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Star,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  CalendarCheck,
  Zap,
} from 'lucide-react';
import { api, Stats, TopicStat } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { XPBar } from '../components/ui/XPBar';
import { MasteryBar } from '../components/ui/MasteryBar';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function Dashboard() {
  const { user, updateUser } = useAppStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats | null>(null);
  const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
  const [dailyQuestion, setDailyQuestion] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [u, s, t, dq] = await Promise.all([
          api.me(),
          api.stats(),
          api.topicStats(),
          api.dailyQuestion().catch(() => null),
        ]);

        updateUser(u);
        setStats(s);
        setTopicStats(t);
        setDailyQuestion(dq);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Pontos fortes: tópicos com maestria >= 60
  const strongTopics = topicStats.filter((t) => t.masteryScore >= 60).slice(0, 4);

  // Pontos fracos: tópicos com maestria < 50
  const weakTopics = topicStats.filter((t) => t.masteryScore < 50).slice(0, 4);

  // Dados para o gráfico de evolução
  const evolutionData = stats?.daily.map((d) => ({
    date: d.date.split('-').slice(1).join('/'),
    total: d.total,
    correct: d.correct,
    taxa: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
  })) || [];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header com Saudação & Call to Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
            <Zap size={14} /> Centro de Comando Acadêmico
          </div>
          <div className="flex items-center gap-2.5 flex-wrap mt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              Olá, <span className="text-accent">{user?.name || 'Estudante'}</span>
            </h1>
            {user?.prestige && user.prestige > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold">
                PRESTÍGIO {['I', 'II', 'III', 'IV', 'V'][user.prestige - 1]}
              </span>
            ) : null}
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent-bright font-semibold">
              {user?.title || 'Novato'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-text-muted mt-1">
            Power Score: <span className="text-text-primary font-bold">{user?.powerScore || 300} pts</span> ({user?.activeLeague || 'Bronze'}) · Analise seu domínio e enfrente suas fraquezas.
          </p>
        </div>

        <button
          onClick={() => navigate('/questions/next')}
          className="quest-btn-primary flex items-center justify-center gap-2 self-start md:self-center"
        >
          <Play size={16} fill="currentColor" />
          <span>Iniciar Treino Adaptativo</span>
        </button>
      </div>

      {/* Banner de Missão de Retorno (se ativa) */}
      {user?.returnMission?.active && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Flame size={18} fill="currentColor" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-2">
                MISSÃO DE RETORNO AO FOCO (+150 XP)
              </div>
              <div className="text-[11px] text-text-muted font-mono mt-0.5">
                Progresso: Fáceis ({user.returnMission.easyProgress}/3) · Médias ({user.returnMission.mediumProgress}/2) · Revisão ({user.returnMission.reviewProgress}/1)
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="quest-btn-secondary text-xs self-start sm:self-center"
          >
            {user.returnMission.completed ? 'Resgatar Recompensa' : 'Ver Missão'}
          </button>
        </div>
      )}

      {/* Grid Principal Superior: Perfil RPG + Questão do Dia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card do Perfil & XP */}
        <div className="quest-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase text-text-muted tracking-wider">
                STATUS ACADÊMICO
              </span>
              {user && (
                <div className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Flame size={12} fill="currentColor" />
                  <span>{user.streak} dias seguidos</span>
                </div>
              )}
            </div>

            {user && (
              <XPBar
                level={user.level}
                currentXp={user.currentXp}
                nextLevelXp={user.nextLevelXp}
                progress={user.progress}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-white/5 text-center">
            <div>
              <div className="text-lg font-mono font-bold text-text-primary">
                {stats?.total ?? 0}
              </div>
              <div className="text-[10px] text-text-muted uppercase">Resolvidas</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-success">
                {stats?.correct ?? 0}
              </div>
              <div className="text-[10px] text-text-muted uppercase">Acertos</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-accent">
                {stats?.accuracy ?? 0}%
              </div>
              <div className="text-[10px] text-text-muted uppercase">Precisão</div>
            </div>
          </div>
        </div>

        {/* Card da Questão do Dia (Destaque) */}
        <div className="quest-card lg:col-span-2 relative overflow-hidden flex flex-col justify-between border-accent/20 bg-gradient-to-br from-accent/10 via-bg-card to-bg-card">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-accent-bright">
                  QUESTÃO DO DIA
                </span>
              </div>
              {dailyQuestion?.completed ? (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-success/15 border border-success/30 text-success flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={12} /> CONCLUÍDA HOJE
                </span>
              ) : (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent-bright font-semibold">
                  RECOMENDADA
                </span>
              )}
            </div>

            {dailyQuestion ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">ENEM {dailyQuestion.year}</span>
                  <DisciplineBadge discipline={dailyQuestion.discipline} />
                  {dailyQuestion.topic && (
                    <span className="text-xs text-text-secondary">· {dailyQuestion.topic.name}</span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-text-secondary line-clamp-2 leading-relaxed">
                  {dailyQuestion.statement}
                </p>
              </div>
            ) : (
              <p className="text-xs text-text-muted">Carregando questão diária...</p>
            )}
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-text-muted font-mono">
              {dailyQuestion?.completed
                ? 'Concluída! Treino adaptativo disponível:'
                : 'Recompensa: +75 XP base'}
            </span>
            <button
              onClick={async () => {
                if (dailyQuestion?.completed) {
                  const nextQ = await api.getNextQuestion();
                  navigate(`/questions/${nextQ.id}`);
                } else {
                  navigate(dailyQuestion ? `/questions/${dailyQuestion.id}` : '/daily');
                }
              }}
              className="quest-btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <span>{dailyQuestion?.completed ? 'Treino Adaptativo (Próxima)' : 'Resolver Agora'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Intermediário: Desempenho por Áreas & Gráfico de Evolução */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Atributos Acadêmicos (Desempenho por Área) */}
        <div className="quest-card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-text-muted tracking-wider flex items-center gap-2">
              <Target size={14} /> ATRIBUTOS ACADÊMICOS
            </span>
            <button
              onClick={() => navigate('/areas')}
              className="text-xs text-accent hover:underline flex items-center gap-1 font-mono"
            >
              Ver detalhes <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {[
              { key: 'matematica', name: 'Matemática' },
              { key: 'ciencias-natureza', name: 'Ciências da Natureza' },
              { key: 'ciencias-humanas', name: 'Ciências Humanas' },
              { key: 'linguagens', name: 'Linguagens' },
            ].map((disc) => {
              const discStat = stats?.byDiscipline.find((d) => d.discipline === disc.key);
              const total = discStat?.total ?? 0;
              const correct = discStat?.correct ?? 0;
              const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

              return (
                <div key={disc.key} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-primary font-medium">{disc.name}</span>
                    <span className="font-mono text-text-muted">
                      {total > 0 ? `${accuracy}% (${correct}/${total})` : 'Não praticado'}
                    </span>
                  </div>
                  <MasteryBar score={accuracy} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Evolução ao longo dos dias */}
        <div className="quest-card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-text-muted tracking-wider flex items-center gap-2">
              <TrendingUp size={14} /> EVOLUÇÃO TEMPORAL
            </span>
            <span className="text-[11px] text-text-muted font-mono">Últimos 14 dias</span>
          </div>

          {evolutionData.length > 0 ? (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData}>
                  <defs>
                    <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#13131c',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="taxa"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaGlow)"
                    name="Taxa de Acerto"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4">
              <AlertCircle size={24} className="text-text-muted mb-2 opacity-50" />
              <p className="text-xs text-text-muted max-w-xs">
                Responda questões nos próximos dias para gerar sua curva de evolução acadêmica.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Diagnóstico Tático: Pontos Fortes vs Pontos Fracos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pontos Fortes */}
        <div className="quest-card border-success/15 bg-success/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-success" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-success">
                PONTOS FORTES
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-mono">Alta Maestria</span>
          </div>

          {strongTopics.length > 0 ? (
            <div className="flex flex-col gap-3">
              {strongTopics.map((t) => (
                <div key={t.topicId} className="flex flex-col gap-1 p-2 rounded-lg bg-white/[0.02]">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-primary font-medium">{t.topicName}</span>
                    <span className="font-mono text-success font-bold">{t.masteryScore}/100</span>
                  </div>
                  <MasteryBar score={t.masteryScore} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-4 text-center">
              Continue acertando questões com consistência para registrar seus primeiros domínios.
            </p>
          )}
        </div>

        {/* Pontos Fracos */}
        <div className="quest-card border-error/15 bg-error/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-error" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-error">
                PONTOS FRACOS (ALVO DE TREINO)
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-mono">Prioridade</span>
          </div>

          {weakTopics.length > 0 ? (
            <div className="flex flex-col gap-3">
              {weakTopics.map((t) => (
                <div key={t.topicId} className="flex flex-col gap-1 p-2 rounded-lg bg-white/[0.02]">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-primary font-medium">{t.topicName}</span>
                    <span className="font-mono text-error font-bold">{t.masteryScore}/100</span>
                  </div>
                  <MasteryBar score={t.masteryScore} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-4 text-center">
              Nenhum ponto crítico identificado ainda. O sistema rastreará conforme você resolver novas questões.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
