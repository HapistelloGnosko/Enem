import { useEffect, useState } from 'react';
import { api, Stats, TopicStat } from '../services/api';
import {
  BarChart3,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

export default function Performance() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.topicStats()])
      .then(([s, t]) => {
        setStats(s);
        setTopicStats(t);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const masteredTopics = topicStats.filter((t) => t.masteryScore >= 70);
  const unmasteredTopics = topicStats.filter((t) => t.masteryScore < 50);

  const disciplineData = [
    { key: 'matematica', name: 'Matemática' },
    { key: 'ciencias-natureza', name: 'C. Natureza' },
    { key: 'ciencias-humanas', name: 'C. Humanas' },
    { key: 'linguagens', name: 'Linguagens' },
  ].map((d) => {
    const s = stats?.byDiscipline.find((b) => b.discipline === d.key);
    const total = s?.total ?? 0;
    const correct = s?.correct ?? 0;
    const taxa = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { name: d.name, taxa, total, correct };
  });

  const evolutionData = stats?.daily.map((d) => ({
    date: d.date.split('-').slice(1).join('/'),
    taxa: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
    total: d.total,
  })) || [];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
          <BarChart3 size={14} /> Análise Tática
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
          Diagnóstico de Desempenho
        </h1>
        <p className="text-xs md:text-sm text-text-muted mt-0.5">
          As 5 respostas essenciais sobre a sua preparação para o ENEM.
        </p>
      </div>

      {/* As 5 Perguntas Centrais (Seção 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. O que eu já domino? */}
        <div className="quest-card border-success/20 bg-success/[0.02] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-success font-mono text-xs font-bold uppercase">
            <CheckCircle size={14} /> 1. O QUE EU JÁ DOMINO?
          </div>
          {masteredTopics.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {masteredTopics.map((t) => (
                <span key={t.topicId} className="px-2 py-1 rounded bg-success/10 border border-success/20 text-success text-xs font-mono">
                  {t.topicName} ({t.masteryScore}%)
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">Ainda consolidando maestria inicial.</p>
          )}
        </div>

        {/* 2. O que eu ainda não domino? */}
        <div className="quest-card border-error/20 bg-error/[0.02] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-error font-mono text-xs font-bold uppercase">
            <XCircle size={14} /> 2. O QUE EU AINDA NÃO DOMINO?
          </div>
          {unmasteredTopics.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {unmasteredTopics.map((t) => (
                <span key={t.topicId} className="px-2 py-1 rounded bg-error/10 border border-error/20 text-error text-xs font-mono">
                  {t.topicName} ({t.masteryScore}%)
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">Nenhum ponto crítico pendente.</p>
          )}
        </div>

        {/* 3. Onde estou errando? */}
        <div className="quest-card flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <HelpCircle size={14} /> 3. ONDE ESTOU ERRANDO?
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {stats && stats.total > 0
              ? `Você errou ${stats.total - stats.correct} de ${stats.total} questões analisadas (${100 - stats.accuracy}% de taxa de erro). Concentre-se nas áreas com menor pontuação de maestria.`
              : 'Resolva questões para o sistema mapear seus padrões de erro.'}
          </p>
        </div>

        {/* 4. O que devo estudar hoje? */}
        <div className="quest-card flex flex-col gap-2">
          <div className="flex items-center gap-2 text-accent-bright font-mono text-xs font-bold uppercase">
            <Target size={14} /> 4. O QUE DEVO ESTUDAR HOJE?
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {unmasteredTopics.length > 0
              ? `Prioridade recomendada: resolva 5 questões de "${unmasteredTopics[0].topicName}" e conclua a Questão do Dia.`
              : 'Mantenha sua sequência diária resolvendo o treino adaptativo.'}
          </p>
        </div>
      </div>

      {/* 5. Estou realmente evoluindo? Gráficos */}
      <div className="quest-card flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-text-primary">
            <TrendingUp size={16} className="text-accent" /> 5. ESTOU REALMENTE EVOLUINDO?
          </div>
          <span className="text-xs font-mono text-text-muted">
            Precisão média global: <strong className="text-accent">{stats?.accuracy ?? 0}%</strong>
          </span>
        </div>

        {/* Gráfico de Barras por Área */}
        <div>
          <div className="text-xs text-text-muted font-mono uppercase mb-3">
            Precisão por Grande Área
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disciplineData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#13131c',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="taxa" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Precisão (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
