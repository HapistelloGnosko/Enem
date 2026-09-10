import { db } from '../db/index';

export type PriorityLevel = 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO' | 'DOMINADO';

export interface TopicPriority {
  topicId: number;
  topicName: string;
  area: string;
  masteryScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  priorityScore: number; // 0 a 100 (quanto maior, mais urgente estudar)
  priorityLevel: PriorityLevel;
  recommendationReason: string;
}

/**
 * Algoritmo de Prioridade Pedagógica
 * Cada assunto recebe um priorityScore baseado em:
 * 1. Fraqueza em maestria (peso principal)
 * 2. Volume de erros reincidentes
 * 3. Falta de prática recente
 */
export function calculateTopicPriorities(userId: number): TopicPriority[] {
  const allTopics = db.getAllTopics();
  const userStats = db.getUserTopicStatsList(userId);
  const statsMap = new Map(userStats.map((s) => [s.topic_id, s]));

  const priorities: TopicPriority[] = [];

  for (const topic of allTopics) {
    const stat = statsMap.get(topic.id);
    const answered = stat?.questions_answered ?? 0;
    const correct = stat?.correct_answers ?? 0;
    const wrong = stat?.wrong_answers ?? 0;
    const mastery = stat?.mastery_score ?? 0;

    let priorityScore = 50;
    let priorityLevel: PriorityLevel = 'MÉDIO';
    let recommendationReason = 'Conteúdo ainda não explorado em profundidade.';

    if (answered === 0) {
      priorityScore = 65;
      priorityLevel = 'MÉDIO';
      recommendationReason = 'Ainda sem histórico prático. Importante para calibrar a base.';
    } else if (mastery < 35 || (wrong >= 3 && correct === 0)) {
      priorityScore = 95;
      priorityLevel = 'CRÍTICO';
      recommendationReason = 'Lacuna urgente: baixa taxa de acerto e erros recorrentes acumulados.';
    } else if (mastery < 60) {
      priorityScore = 80;
      priorityLevel = 'ALTO';
      recommendationReason = 'Em desenvolvimento. Precisa de reforço para consolidação.';
    } else if (mastery < 80) {
      priorityScore = 45;
      priorityLevel = 'BAIXO';
      recommendationReason = 'Desempenho consistente. Requer apenas manutenção periódica.';
    } else {
      priorityScore = 15;
      priorityLevel = 'DOMINADO';
      recommendationReason = 'Alta maestria comprovada. Não é prioridade de estudo hoje.';
    }

    priorities.push({
      topicId: topic.id,
      topicName: topic.name,
      area: topic.area,
      masteryScore: mastery,
      questionsAnswered: answered,
      correctAnswers: correct,
      wrongAnswers: wrong,
      priorityScore,
      priorityLevel,
      recommendationReason,
    });
  }

  // Ordena por prioridade decrescente
  return priorities.sort((a, b) => b.priorityScore - a.priorityScore);
}
