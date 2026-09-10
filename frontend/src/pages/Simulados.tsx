import { useNavigate } from 'react-router-dom';
import { Layers, Play, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function Simulados() {
  const navigate = useNavigate();

  const mockExams = [
    {
      id: 1,
      title: 'Simulado Rápido: Matemática & Natureza',
      questionsCount: 20,
      estimatedTime: '45 minutos',
      description: 'Treino intensivo nas áreas exatas para calibrar seu tempo de resolução.',
    },
    {
      id: 2,
      title: 'Simulado Humanidades & Linguagens',
      questionsCount: 20,
      estimatedTime: '45 minutos',
      description: 'Focado em interpretação crítica, história e ciências sociais.',
    },
    {
      id: 3,
      title: 'Simulado Diagnóstico Completo (ENEM 2023)',
      questionsCount: 45,
      estimatedTime: '1h 45min',
      description: 'Caderno completo de uma área específica com métricas reais de TRI.',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
          <Layers size={14} /> Modo de Prova
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
          Simulados Estratégicos
        </h1>
        <p className="text-xs md:text-sm text-text-muted mt-0.5">
          Teste seu ritmo de prova, resistência cognitiva e gerenciamento de tempo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockExams.map((exam) => (
          <div
            key={exam.id}
            className="quest-card flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:border-accent/40"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-bold text-text-primary">{exam.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                {exam.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-text-muted font-mono mt-1">
                <span className="flex items-center gap-1">
                  <FileText size={13} /> {exam.questionsCount} questões
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {exam.estimatedTime}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/questions')}
              className="quest-btn-primary flex items-center justify-center gap-2 text-xs self-start md:self-center shrink-0"
            >
              <Play size={14} fill="currentColor" />
              <span>Iniciar Simulado</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
