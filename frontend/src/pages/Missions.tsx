import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, ArrowRight, Zap, Target } from 'lucide-react';

export default function Missions() {
  const navigate = useNavigate();

  const missions = [
    {
      id: 1,
      title: 'CONSISTÊNCIA MATEMÁTICA',
      description: 'Resolva 5 questões de Matemática e suas Tecnologias.',
      rewardXp: 250,
      progress: 2,
      target: 5,
      completed: false,
      discipline: 'matematica',
    },
    {
      id: 2,
      title: 'SUPERANDO O PONTO FRACO',
      description: 'Resolva 3 questões do seu assunto com menor índice de maestria.',
      rewardXp: 200,
      progress: 1,
      target: 3,
      completed: false,
    },
    {
      id: 3,
      title: 'QUESTÃO DO DIA',
      description: 'Conclua a questão diária recomendada pelo sistema.',
      rewardXp: 150,
      progress: 1,
      target: 1,
      completed: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
          <Award size={14} /> Objetivos Diários
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
          Missões de Treinamento
        </h1>
        <p className="text-xs md:text-sm text-text-muted mt-0.5">
          Tarefas adaptativas renovadas diariamente para guiar seu foco de estudo.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`quest-card flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 ${
              m.completed ? 'border-success/30 bg-success/[0.03]' : 'border-white/5'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  m.completed ? 'bg-success/20 text-success' : 'bg-accent/15 text-accent'
                }`}
              >
                {m.completed ? <CheckCircle2 size={20} /> : <Target size={20} />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-xs font-bold text-text-primary uppercase">
                    {m.title}
                  </h3>
                  <span className="text-[10px] font-mono text-accent font-semibold flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> +{m.rewardXp} XP
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {m.description}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="w-36 mastery-track h-1.5">
                    <div
                      className={`mastery-fill ${m.completed ? 'bg-success' : 'bg-accent'}`}
                      style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    {m.progress}/{m.target}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/questions')}
              disabled={m.completed}
              className={`quest-btn-secondary text-xs self-end md:self-center flex items-center gap-1.5 ${
                m.completed ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <span>{m.completed ? 'Concluída' : 'Executar Missão'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
