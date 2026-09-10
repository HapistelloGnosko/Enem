import { db } from '../db/index';
import { loadQuestionsFromApi } from './enemService';

/**
 * Algoritmo Inteligente de Recomendação de Questões
 * Prioriza:
 * 1. Assuntos com menor índice de maestria (pontos fracos)
 * 2. Assuntos cadastrados que ainda não foram praticados
 * 3. Evita repetir questões acertadas nos últimos 7 dias
 */
export async function getNextRecommendedQuestion(
  userId: number,
  preferredDiscipline?: string
): Promise<number | null> {
  // 1. Identifica questões acertadas nos últimos 7 dias
  const excludeIds = new Set(db.getRecentCorrectQuestionIds(userId, 7));

  // 2. Busca estatísticas de tópicos do usuário
  const userStats = db.getUserTopicStatsList(userId);
  let targetTopicId: number | null = null;

  if (userStats.length > 0) {
    // Pega o pior tópico (menor maestria)
    const weakTopic = [...userStats].reverse().find((s) => s.mastery_score < 60);
    if (weakTopic) {
      targetTopicId = weakTopic.topic_id;
    }
  }

  // 3. Se não tem tópico fraco ou sem histórico, busca tópicos não praticados
  if (!targetTopicId) {
    const allTopics = db.getAllTopics();
    const practicedTopicIds = new Set(userStats.map((s) => s.topic_id));
    const unpracticed = allTopics.filter((t) => {
      if (preferredDiscipline && t.area !== preferredDiscipline) return false;
      return !practicedTopicIds.has(t.id);
    });

    if (unpracticed.length > 0) {
      targetTopicId = unpracticed[Math.floor(Math.random() * unpracticed.length)].id;
    }
  }

  // 4. Busca questões candidatas no banco local
  let localCandidates = db.listQuestions({
    discipline: preferredDiscipline,
    limit: 200,
  }).questions;

  // Se o banco tiver poucas questões na disciplina, importa da API
  if (localCandidates.length < 5) {
    const disc = preferredDiscipline || 'matematica';
    await loadQuestionsFromApi(2023, disc, 10);
    localCandidates = db.listQuestions({
      discipline: preferredDiscipline,
      limit: 200,
    }).questions;
  }

  // Filtra as não respondidas recentemente
  let eligible = localCandidates.filter((q) => !excludeIds.has(q.id));

  // Se filtrou tudo, permite revisar qualquer questão
  if (eligible.length === 0) {
    eligible = localCandidates;
  }

  if (eligible.length === 0) {
    return null;
  }

  // Prioriza a do tópico alvo se existir
  if (targetTopicId) {
    const matched = eligible.filter((q) => q.topic_id === targetTopicId);
    if (matched.length > 0) {
      return matched[Math.floor(Math.random() * matched.length)].id;
    }
  }

  // Caso contrário, seleciona aleatoriamente entre as elegíveis
  const chosen = eligible[Math.floor(Math.random() * eligible.length)];
  return chosen.id;
}
