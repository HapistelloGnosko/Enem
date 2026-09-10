import { sqlite } from '../db/index';

/**
 * ENEM Power Score (Escala 100 - 1000)
 *
 * Mede a proficiência acadêmica estimada do estudante com base em:
 * 1. Acurácia geral ponderada (35%)
 * 2. Complexidade/Dificuldade das questões acertadas (20%)
 * 3. Abrangência e Maestria média entre as 4 áreas (25%)
 * 4. Consistência e regularidade recente (20%)
 *
 * XP representa esforço/volume; POWER SCORE representa força pedagógica demonstrada.
 */
export function calculatePowerScore(userId: number): {
  score: number;
  league: string;
  breakdown: {
    accuracyPart: number;
    difficultyPart: number;
    masteryPart: number;
    consistencyPart: number;
  };
} {
  // 1. Estatísticas de tentativas
  const attempts = sqlite.prepare(`
    SELECT a.correct, a.time_spent, q.difficulty, q.discipline
    FROM attempts a
    INNER JOIN questions q ON a.question_id = q.id
    WHERE a.user_id = ?
    ORDER BY a.id DESC LIMIT 100
  `).all(userId) as { correct: number; time_spent: number; difficulty: string; discipline: string }[];

  if (attempts.length === 0) {
    return {
      score: 300,
      league: 'Bronze',
      breakdown: {
        accuracyPart: 100,
        difficultyPart: 80,
        masteryPart: 60,
        consistencyPart: 60,
      },
    };
  }

  // 1. Acurácia ponderada (max 350 pts)
  const total = attempts.length;
  const correctCount = attempts.filter((a) => a.correct === 1).length;
  const accuracy = correctCount / total;
  // Fator de volume (exige ao menos 15 questões para alcançar peso total de acurácia)
  const volumeFactor = Math.min(total / 15, 1.0);
  const accuracyPart = Math.round(accuracy * 350 * volumeFactor);

  // 2. Dificuldade das questões acertadas (max 200 pts)
  const diffWeights: Record<string, number> = {
    easy: 0.6,
    medium: 0.9,
    hard: 1.2,
    very_hard: 1.5,
  };
  const correctAttempts = attempts.filter((a) => a.correct === 1);
  let avgDiffWeight = 0.8;
  if (correctAttempts.length > 0) {
    const sumDiff = correctAttempts.reduce((acc, curr) => acc + (diffWeights[curr.difficulty] || 0.8), 0);
    avgDiffWeight = sumDiff / correctAttempts.length;
  }
  const difficultyPart = Math.min(200, Math.round((avgDiffWeight / 1.5) * 200 * volumeFactor));

  // 3. Abrangência e Maestria média entre as 4 áreas (max 250 pts)
  const topicStats = sqlite.prepare(`
    SELECT u.mastery_score, t.area
    FROM user_topic_stats u
    INNER JOIN topics t ON u.topic_id = t.id
    WHERE u.user_id = ?
  `).all(userId) as { mastery_score: number; area: string }[];

  const distinctAreas = new Set(topicStats.map((s) => s.area));
  const areaCoverageFactor = distinctAreas.size / 4; // 1.0 se estudou todas as 4 áreas
  const avgMastery = topicStats.length > 0
    ? topicStats.reduce((acc, s) => acc + s.mastery_score, 0) / topicStats.length
    : 0;

  const masteryPart = Math.round(((avgMastery * 0.6) + (areaCoverageFactor * 100 * 0.4)) * 2.5);

  // 4. Consistência e regularidade recente (max 200 pts)
  const user = sqlite.prepare('SELECT streak, last_study_date FROM users WHERE id = ?').get(userId) as { streak: number; last_study_date: string | null } | undefined;
  const streak = user?.streak || 0;
  const streakScore = Math.min(100, streak * 10);

  // Dias com estudo nos últimos 14 dias
  const activeDays = sqlite.prepare(`
    SELECT count(DISTINCT date(created_at)) as count
    FROM attempts
    WHERE user_id = ? AND created_at > datetime('now', '-14 days')
  `).get(userId) as { count: number };
  const frequencyScore = Math.min(100, (activeDays.count / 10) * 100);

  const consistencyPart = Math.round((streakScore * 0.5 + frequencyScore * 0.5) * 2.0);

  // Score base de 200 pts para estudantes em atividade
  const baseScore = 200;
  const rawScore = baseScore + accuracyPart + difficultyPart + masteryPart + consistencyPart;
  const score = Math.max(100, Math.min(1000, rawScore));

  // Ligas acadêmicas
  let league = 'Bronze';
  if (score >= 900) league = 'Grão-Mestre';
  else if (score >= 800) league = 'Mestre';
  else if (score >= 700) league = 'Diamante';
  else if (score >= 600) league = 'Platina';
  else if (score >= 500) league = 'Ouro';
  else if (score >= 400) league = 'Prata';

  return {
    score,
    league,
    breakdown: {
      accuracyPart,
      difficultyPart,
      masteryPart,
      consistencyPart,
    },
  };
}
