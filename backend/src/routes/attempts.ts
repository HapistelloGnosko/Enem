import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateXp, levelFromXp, xpProgress } from '../services/xpService';
import { calculateMastery } from '../services/masteryService';

const router = Router();

// Submeter tentativa de resposta
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { questionId, selectedAnswer, timeSpent = 0 } = req.body;

    if (!questionId || !selectedAnswer) {
      return res.status(400).json({ error: 'Parâmetros questionId e selectedAnswer são obrigatórios.' });
    }

    const question = db.getQuestionById(Number(questionId));
    if (!question) {
      return res.status(404).json({ error: 'Questão não encontrada.' });
    }

    const selectedClean = String(selectedAnswer).trim().toUpperCase();
    const correct = selectedClean === question.correct_answer.toUpperCase();

    // Contagem de tentativas anteriores nesta questão
    const prevAttemptsCount = db.countAttempts(req.userId!, question.id);
    const attemptNumber = prevAttemptsCount + 1;

    // Usuário atual
    const user = db.findUserById(req.userId!)!;
    const currentStreak = user.streak || 0;

    // Cálculo do ganho de XP
    const xpGained = calculateXp(question.difficulty, currentStreak, attemptNumber, correct);

    // Salvar tentativa
    const attemptId = db.createAttempt({
      userId: req.userId!,
      questionId: question.id,
      selectedAnswer: selectedClean,
      correct,
      timeSpent: Number(timeSpent) || 0,
      xpGained,
      attemptNumber,
    });

    // Se for a questão do dia, marca como concluída
    const today = new Date().toISOString().split('T')[0];
    db.markDailyQuestionCompleted(req.userId!, question.id, today);

    // Atualização de Streak e XP
    const lastStudy = user.last_study_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = currentStreak;
    if (correct) {
      if (lastStudy === yesterday) {
        newStreak += 1;
      } else if (lastStudy !== today) {
        newStreak = 1;
      }
    }

    const newXp = (user.xp || 0) + xpGained;
    const newLevel = levelFromXp(newXp);
    const leveledUp = newLevel > (user.level || 1);

    db.updateUser(user.id, {
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastStudyDate: today,
    });

    // Atualização de Maestria
    let oldMastery = 0;
    let newMastery = 0;
    let masteryDelta = 0;

    if (question.topic_id) {
      const stat = db.getUserTopicStat(user.id, question.topic_id);
      const oldAnswered = stat?.questions_answered ?? 0;
      const oldCorrect = stat?.correct_answers ?? 0;
      const oldWrong = stat?.wrong_answers ?? 0;
      const oldTime = stat?.average_time ?? 0;
      oldMastery = stat?.mastery_score ?? 0;

      const newAnswered = oldAnswered + 1;
      const newCorrect = oldCorrect + (correct ? 1 : 0);
      const newWrong = oldWrong + (correct ? 0 : 1);
      const newAvgTime = Math.round((oldTime * oldAnswered + Number(timeSpent)) / newAnswered);

      newMastery = calculateMastery(newCorrect, newAnswered);
      masteryDelta = newMastery - oldMastery;

      db.upsertUserTopicStat({
        userId: user.id,
        topicId: question.topic_id,
        questionsAnswered: newAnswered,
        correctAnswers: newCorrect,
        wrongAnswers: newWrong,
        masteryScore: newMastery,
        averageTime: newAvgTime,
      });
    }

    // Progresso da Missão de Retorno (se ativa)
    const { recordReturnMissionAttempt, evaluateGamificationProgress } = await import('../services/gamificationService');
    recordReturnMissionAttempt(user.id, question.difficulty);

    // Avaliação de Conquistas, Títulos e Power Score
    const unlockedRewards = evaluateGamificationProgress(user.id);

    const progress = xpProgress(newXp);

    return res.json({
      attemptId,
      correct,
      selectedAnswer: selectedClean,
      correctAnswer: question.correct_answer,
      explanation: question.explanation,
      xpGained,
      totalXp: newXp,
      leveledUp,
      newLevel,
      streak: newStreak,
      oldMastery,
      newMastery,
      masteryDelta,
      progress,
      unlockedRewards,
    });
  } catch (err) {
    console.error('[Attempt Submission Error]:', err);
    return res.status(500).json({ error: 'Erro ao registrar tentativa.' });
  }
});

export default router;
