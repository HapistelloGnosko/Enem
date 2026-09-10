import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Play,
} from 'lucide-react';
import { api, LibraryTopicDetail } from '../services/api';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import { MasteryBar } from '../components/ui/MasteryBar';

export default function LibraryTopicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<LibraryTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getLibraryTopic(parseInt(id))
      .then((data) => setTopic(data))
      .catch((err) => setError(err.message || 'Erro ao carregar assunto.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-xs text-text-muted">
        Carregando conteúdo...
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-error">{error || 'Assunto não encontrado.'}</p>
        <button onClick={() => navigate('/library')} className="quest-btn-secondary text-xs">
          Voltar para a Biblioteca
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-12">
      <button
        onClick={() => navigate('/library')}
        className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft size={14} /> Voltar para a Biblioteca
      </button>

      <div className="quest-card flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <DisciplineBadge discipline={topic.area} />
              <h1 className="text-xl md:text-2xl font-bold text-text-primary">{topic.name}</h1>
            </div>
            {topic.summary && (
              <p className="text-sm text-text-secondary leading-relaxed mt-2 max-w-xl">
                {topic.summary}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] text-text-muted uppercase font-mono">Sua Maestria</div>
            <div className="w-32 mt-1">
              <MasteryBar score={topic.masteryScore} showLabel size="sm" />
            </div>
          </div>
        </div>

        {topic.keyPoints.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-mono font-bold text-text-primary uppercase flex items-center gap-2">
              <CheckCircle2 size={14} className="text-success" /> Pontos-Chave
            </h3>
            <ul className="flex flex-col gap-2">
              {topic.keyPoints.map((point, i) => (
                <li
                  key={i}
                  className="text-xs text-text-secondary leading-relaxed p-2.5 rounded-lg bg-bg-secondary border border-white/5 flex gap-2"
                >
                  <span className="text-success font-mono shrink-0">{i + 1}.</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {topic.commonTraps.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-mono font-bold text-text-primary uppercase flex items-center gap-2">
              <AlertTriangle size={14} className="text-warning" /> Pegadinhas Comuns no ENEM
            </h3>
            <ul className="flex flex-col gap-2">
              {topic.commonTraps.map((trap, i) => (
                <li
                  key={i}
                  className="text-xs text-text-secondary leading-relaxed p-2.5 rounded-lg bg-warning/5 border border-warning/20"
                >
                  {trap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {topic.studyTip && (
          <div className="p-3.5 rounded-xl bg-neon-blue/5 border border-neon-blue/20 flex gap-3 items-start">
            <Lightbulb size={16} className="text-neon-blue shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-mono uppercase text-neon-blue font-bold mb-1">
                Dica de Estudo
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{topic.studyTip}</p>
            </div>
          </div>
        )}

        {!topic.hasContent && (
          <p className="text-xs text-text-muted py-4 text-center">
            Ainda não há material de estudo cadastrado para este assunto.
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5 flex-wrap">
          <span className="text-[10px] font-mono text-text-muted flex items-center gap-1.5">
            <BookOpen size={12} /> {topic.cachedQuestionsCount} questão(ões) disponível(eis) no banco
          </span>
          <button
            onClick={() => navigate(`/questions?discipline=${topic.area}`)}
            className="quest-btn-primary text-xs flex items-center gap-1.5"
          >
            <Play size={12} fill="currentColor" />
            Praticar Questões desta Área
          </button>
        </div>
      </div>
    </div>
  );
}
