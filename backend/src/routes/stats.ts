import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Estatísticas globais do usuário
router.get('/', authenticate, (req: AuthRequest, res) => {
  try {
    const stats = db.getUserStats(req.userId!);
    return res.json(stats);
  } catch (err) {
    console.error('[Stats Error]:', err);
    return res.status(500).json({ error: 'Erro ao obter estatísticas.' });
  }
});

// Lista de maestria detalhada por tópicos
router.get('/topics', authenticate, (req: AuthRequest, res) => {
  try {
    const stats = db.getUserTopicStatsList(req.userId!);
    const formatted = stats.map((s) => ({
      topicId: s.topic_id,
      topicName: s.topic_name,
      area: s.area,
      questionsAnswered: s.questions_answered,
      correctAnswers: s.correct_answers,
      wrongAnswers: s.wrong_answers,
      masteryScore: s.mastery_score,
      averageTime: s.average_time,
      lastAttemptAt: s.last_attempt_at,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('[Topic Stats Error]:', err);
    return res.status(500).json({ error: 'Erro ao obter maestria por tópicos.' });
  }
});

export default router;
