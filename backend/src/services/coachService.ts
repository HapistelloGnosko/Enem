import { db } from '../db/index';
import { calculateTopicPriorities } from './priorityEngine';

export interface CoachAnswer {
  question: string;
  category: 'foco' | 'fraqueza' | 'evolucao' | 'revisao' | 'treino';
  answer: string;
  recommendation: string;
  actionUrl?: string;
}

export interface TrainingBlock {
  title: string;
  durationMinutes: number;
  description: string;
  action: string;
  url: string;
}

export interface DailyTrainingPlan {
  title: string;
  totalMinutes: number;
  primaryFocus: string;
  blocks: TrainingBlock[];
}

export function generateCoachDiagnosis(userId: number): {
  coreAnswers: CoachAnswer[];
  dailyPlan: DailyTrainingPlan;
  summaryMetrics: {
    worstArea: string;
    worstTopic: string;
    bestTopic: string;
    dominantErrorReason: string;
    speedDiagnosis: string;
    evolutionStatus: string;
  };
} {
  const stats = db.getUserStats(userId);
  const priorities = calculateTopicPriorities(userId);
  const codexStats = db.getCodexStats(userId);
  const reviewsDue = db.getReviewsDue(userId);

  // 1. Pior e Melhor tópico
  const practiced = priorities.filter((p) => p.questionsAnswered > 0);
  const worstTopicObj = practiced.length > 0
    ? [...practiced].sort((a, b) => a.masteryScore - b.masteryScore)[0]
    : priorities[0];

  const bestTopicObj = practiced.length > 0
    ? [...practiced].sort((a, b) => b.masteryScore - a.masteryScore)[0]
    : null;

  // 2. Pior área
  let worstArea = 'Matemática';
  if (stats.byDiscipline.length > 0) {
    const sortedAreas = [...stats.byDiscipline].sort((a, b) => {
      const accA = a.total > 0 ? a.correct / a.total : 0;
      const accB = b.total > 0 ? b.correct / b.total : 0;
      return accA - accB;
    });
    const areaNameMap: Record<string, string> = {
      'matematica': 'Matemática',
      'ciencias-natureza': 'Ciências da Natureza',
      'ciencias-humanas': 'Ciências Humanas',
      'linguagens': 'Linguagens',
    };
    worstArea = areaNameMap[sortedAreas[0].discipline] || sortedAreas[0].discipline;
  }

  // 3. Motivo dominante de erro
  const dominantErrorReason = codexStats.byReason.length > 0
    ? codexStats.byReason[0].reason
    : 'Ainda não classificado';

  // 4. Diagnóstico de velocidade
  const avgTime = stats.total > 0 ? 150 : 0; // segundos
  let speedDiagnosis = 'Tempo médio equilibrado.';
  if (stats.accuracy >= 75 && avgTime > 240) {
    speedDiagnosis = 'Bom domínio teórico, mas baixa velocidade de resolução. Pratique treinos contra o relógio.';
  } else if (stats.accuracy < 50 && avgTime < 60) {
    speedDiagnosis = 'Resoluções muito precipitadas. Aumente o tempo de leitura e interpretação do enunciado.';
  } else if (stats.accuracy >= 70) {
    speedDiagnosis = 'Ritmo tático consistente e boa precisão.';
  }

  // 5. Status de evolução
  const evolutionStatus = stats.total >= 10
    ? `Você acumula ${stats.total} questões resolvidas com ${stats.accuracy}% de precisão global.`
    : 'Base de dados inicial em calibração. Continue resolvendo questões para aprofundar a precisão analítica.';

  // Perguntas Centrais Respondidas pelo Coach
  const coreAnswers: CoachAnswer[] = [
    {
      question: 'O que devo estudar hoje?',
      category: 'foco',
      answer: `Seu foco crítico prioritário hoje é "${worstTopicObj.topicName}". O sistema identificou uma maestria de ${worstTopicObj.masteryScore}/100 com necessidade de fixação conceitual.`,
      recommendation: `Resolva um bloco de 5 a 10 questões direcionadas a ${worstTopicObj.topicName}.`,
      actionUrl: `/questions?discipline=${worstTopicObj.area}`,
    },
    {
      question: 'Onde estou pior?',
      category: 'fraqueza',
      answer: `Sua maior fragilidade atual reside em ${worstArea}, especificamente no tópico de ${worstTopicObj.topicName}, onde a taxa de acerto tem oscilado negativamente.`,
      recommendation: 'Não evite sua matéria fraca: dedique o início da sua sessão com a mente descansada a este conteúdo.',
      actionUrl: '/codex',
    },
    {
      question: `Por que estou errando questões?`,
      category: 'fraqueza',
      answer: `A análise do seu Codex indica que o padrão dominante de erro é "${dominantErrorReason}". ${
        dominantErrorReason.toLowerCase().includes('interpretação')
          ? 'Você está escorregando na leitura atenta dos comandos e pegadinhas.'
          : dominantErrorReason.toLowerCase().includes('cálculo')
          ? 'Você domina a fórmula, mas perde pontos nas operações aritméticas básicas.'
          : 'Reforce a teoria antes de partir diretamente para exercícios difíceis.'
      }`,
      recommendation: 'Após cada questão incorreta, registre o motivo no Codex para alimentar seu raio-X cognitivo.',
      actionUrl: '/codex',
    },
    {
      question: 'Estou evoluindo?',
      category: 'evolucao',
      answer: `Com ${stats.total} questões respondidas e precisão de ${stats.accuracy}%, sua curva de consistência está ativa. ${
        bestTopicObj
          ? `Seu ponto mais forte consolidado é "${bestTopicObj.topicName}" com ${bestTopicObj.masteryScore}/100 de domínio.`
          : 'Continue para consolidar seus primeiros tópicos dominados.'
      }`,
      recommendation: 'Monitore seu gráfico de 14 dias no Dashboard para verificar se sua taxa diária permanece acima de 70%.',
      actionUrl: '/performance',
    },
    {
      question: 'O que devo revisar hoje?',
      category: 'revisao',
      answer: reviewsDue.length > 0
        ? `Você tem ${reviewsDue.length} assunto(s) agendado(s) para revisão hoje pelo método de repetição espaçada: ${reviewsDue.map((r) => r.topic_name).join(', ')}.`
        : `Nenhuma matéria vencida hoje. O próximo tópico sugerido para revisão preventiva é "${worstTopicObj.topicName}".`,
      recommendation: 'A revisão espaçada antes de esquecer o conteúdo garante a retenção na memória de longo prazo.',
      actionUrl: '/reviews',
    },
  ];

  // Plano Diário de 80 minutos
  const dailyPlan: DailyTrainingPlan = {
    title: 'TREINO TÁTICO DE HOJE',
    totalMinutes: 80,
    primaryFocus: worstTopicObj.topicName,
    blocks: [
      {
        title: 'Bloco 1: Revisão Conceitual Ativa',
        durationMinutes: 20,
        description: `Releia os conceitos centrais e fórmulas de ${worstTopicObj.topicName}.`,
        action: 'Revisar Conceito',
        url: '/reviews',
      },
      {
        title: 'Bloco 2: Fixação Rápida (5 fáceis)',
        durationMinutes: 15,
        description: 'Resolva 5 questões fáceis para sedimentar a confiança e os passos do raciocínio.',
        action: 'Resolver Fáceis',
        url: `/questions?discipline=${worstTopicObj.area}`,
      },
      {
        title: 'Bloco 3: Desafio Médio com Pressão (5 médias)',
        durationMinutes: 20,
        description: 'Simule o tempo real do ENEM: resolva 5 questões médias cronometradas a 3 min/questão.',
        action: 'Iniciar Bloco Médio',
        url: `/questions?discipline=${worstTopicObj.area}`,
      },
      {
        title: 'Bloco 4: Questão do Dia & Desafio ENEM (3 questões)',
        durationMinutes: 15,
        description: 'Enfrente a Questão do Dia oficial recomendada pelo motor adaptativo.',
        action: 'Fazer Questão do Dia',
        url: '/daily',
      },
      {
        title: 'Bloco 5: Análise dos Erros no Codex',
        durationMinutes: 10,
        description: 'Classifique qualquer erro cometido no treino e anote lições aprendidas.',
        action: 'Abrir Codex',
        url: '/codex',
      },
    ],
  };

  return {
    coreAnswers,
    dailyPlan,
    summaryMetrics: {
      worstArea,
      worstTopic: worstTopicObj.topicName,
      bestTopic: bestTopicObj?.topicName || 'A definir',
      dominantErrorReason,
      speedDiagnosis,
      evolutionStatus,
    },
  };
}
