import { useEffect, useState } from 'react';
import { api, TopicStat } from '../services/api';
import { MasteryBar } from '../components/ui/MasteryBar';
import { Compass, BookOpen, Layers } from 'lucide-react';

const AREAS = [
  {
    key: 'matematica',
    title: 'Matemática e suas Tecnologias',
    color: 'text-neon-blue',
    borderColor: 'border-neon-blue/20',
  },
  {
    key: 'ciencias-natureza',
    title: 'Ciências da Natureza e suas Tecnologias',
    color: 'text-success',
    borderColor: 'border-success/20',
  },
  {
    key: 'ciencias-humanas',
    title: 'Ciências Humanas e suas Tecnologias',
    color: 'text-warning',
    borderColor: 'border-warning/20',
  },
  {
    key: 'linguagens',
    title: 'Linguagens, Códigos e suas Tecnologias',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/20',
  },
];

export default function Areas() {
  const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .topicStats()
      .then((data) => setTopicStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
          <Compass size={14} /> Atributos Acadêmicos
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
          Áreas do Conhecimento & Maestria
        </h1>
        <p className="text-xs md:text-sm text-text-muted mt-0.5">
          Acompanhamento granular do seu nível de domínio em cada assunto avaliado no ENEM.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {AREAS.map((area) => {
          const areaTopics = topicStats.filter((t) => t.area === area.key);
          const totalAnswered = areaTopics.reduce((acc, t) => acc + t.questionsAnswered, 0);
          const totalCorrect = areaTopics.reduce((acc, t) => acc + t.correctAnswers, 0);
          const avgMastery =
            areaTopics.length > 0
              ? Math.round(
                  areaTopics.reduce((acc, t) => acc + t.masteryScore, 0) / areaTopics.length
                )
              : 0;

          return (
            <div key={area.key} className={`quest-card border ${area.borderColor} flex flex-col gap-4`}>
              {/* Header da Área */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/5">
                <div>
                  <h2 className={`text-base font-bold ${area.color}`}>{area.title}</h2>
                  <div className="text-xs text-text-muted font-mono mt-0.5">
                    {totalAnswered} questões resolvidas · {totalCorrect} acertos
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-text-muted font-mono uppercase">Maestria Média</div>
                  <div className="text-lg font-mono font-black text-text-primary">
                    {avgMastery}<span className="text-xs text-text-muted">/100</span>
                  </div>
                </div>
              </div>

              {/* Grid de Subatributos / Tópicos */}
              {areaTopics.length === 0 ? (
                <p className="text-xs text-text-muted py-3">
                  Nenhum assunto praticado ainda nesta área. Resolva questões para desbloquear os índices de domínio.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {areaTopics.map((topic) => (
                    <div
                      key={topic.topicId}
                      className="p-3 rounded-xl bg-bg-secondary border border-white/5 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-text-primary">{topic.topicName}</span>
                        <span className="font-mono text-xs font-bold text-text-secondary">
                          {topic.masteryScore}/100
                        </span>
                      </div>

                      <MasteryBar score={topic.masteryScore} size="sm" />

                      <div className="flex justify-between items-center text-[10px] text-text-muted font-mono mt-0.5">
                        <span>
                          {topic.correctAnswers} / {topic.questionsAnswered} acertos
                        </span>
                        <span>
                          Tempo médio: {topic.averageTime}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
