import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Filter,
  DownloadCloud,
  Play,
  ArrowRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { api, Question } from '../services/api';
import { DisciplineBadge } from '../components/ui/DisciplineBadge';
import { DifficultyBadge } from '../components/ui/DifficultyBadge';

const DISCIPLINES = [
  { value: '', label: 'Todas as Áreas' },
  { value: 'matematica', label: 'Matemática' },
  { value: 'ciencias-natureza', label: 'Ciências da Natureza' },
  { value: 'ciencias-humanas', label: 'Ciências Humanas' },
  { value: 'linguagens', label: 'Linguagens' },
];

const YEARS = ['', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'];

export default function Questions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [discipline, setDiscipline] = useState(searchParams.get('discipline') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  const [importSource, setImportSource] = useState<'enem_dev' | 'enemhub'>('enemhub');
  const [importPage, setImportPage] = useState(1);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.listQuestions({
        discipline: discipline || undefined,
        year: year ? parseInt(year) : undefined,
        limit: 100,
      });
      setQuestions(res.questions);
      setTotalCount(res.total);
    } catch (err) {
      console.error('Erro ao listar questões:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [discipline, year]);

  const handleImport = async () => {
    setImporting(true);
    setImportMessage('');
    try {
      const targetYear = year ? parseInt(year) : 2023;
      const res = await api.importQuestions({
        source: importSource,
        year: targetYear,
        discipline: discipline || 'matematica',
        limit: 20,
        page: importPage,
      });
      setImportMessage(res.message);
      if (importSource === 'enemhub') {
        setImportPage((p) => p + 1);
      }
      await loadQuestions();
    } catch (err: any) {
      setImportMessage(err.message || 'Falha ao importar questões.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
            <BookOpen size={14} /> Repositório Oficial
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
            Banco de Questões ENEM
          </h1>
          <p className="text-xs md:text-sm text-text-muted mt-0.5">
            {totalCount} questão(ões) catalogada(s) no banco local com classificação tática.
          </p>
        </div>

        {/* Painel de Importação Rápida */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <div className="flex items-center rounded-lg border border-white/10 bg-bg-secondary p-0.5 text-xs">
            <button
              onClick={() => setImportSource('enemhub')}
              className={`px-3 py-1.5 rounded-md font-mono transition-colors ${
                importSource === 'enemhub'
                  ? 'bg-accent text-white font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              title="Acesso ao catálogo com mais de 80.000 questões via EnemHub"
            >
              EnemHub (80k+)
            </button>
            <button
              onClick={() => setImportSource('enem_dev')}
              className={`px-3 py-1.5 rounded-md font-mono transition-colors ${
                importSource === 'enem_dev'
                  ? 'bg-accent text-white font-semibold shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              ENEM.dev
            </button>
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="quest-btn-secondary flex items-center justify-center gap-2 text-xs"
          >
            <DownloadCloud size={14} />
            <span>
              {importing
                ? 'Importando...'
                : importSource === 'enemhub'
                ? `Importar Lote ${importPage} (EnemHub)`
                : 'Importar Lote (ENEM.dev)'}
            </span>
          </button>
        </div>
      </div>

      {importMessage && (
        <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent-bright text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 size={14} /> {importMessage}
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="quest-card flex flex-wrap items-center gap-4 py-3">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Filter size={14} />
          <span>Filtrar por:</span>
        </div>

        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          className="bg-bg-secondary border border-white/10 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent"
        >
          {DISCIPLINES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-bg-secondary border border-white/10 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent"
        >
          <option value="">Todos os Anos</option>
          {YEARS.filter(Boolean).map((y) => (
            <option key={y} value={y}>
              ENEM {y}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Questões */}
      {loading ? (
        <div className="quest-card text-center py-12 text-xs text-text-muted">
          Carregando questões...
        </div>
      ) : questions.length === 0 ? (
        <div className="quest-card text-center py-12 flex flex-col items-center gap-3">
          <p className="text-xs text-text-muted">
            Nenhuma questão encontrada com os filtros selecionados.
          </p>
          <button onClick={handleImport} className="quest-btn-primary text-xs">
            Importar questões para este filtro
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => navigate(`/questions/${q.id}`)}
              className="quest-card hover:border-accent/40 cursor-pointer flex items-center justify-between gap-4 p-4 group"
            >
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-text-primary">
                    ENEM {q.year} · Questão {q.questionNumber}
                  </span>
                  <DisciplineBadge discipline={q.discipline} />
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {q.statement}
                </p>
              </div>

              <button className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-accent group-hover:text-white flex items-center justify-center text-text-muted transition-all shrink-0">
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
