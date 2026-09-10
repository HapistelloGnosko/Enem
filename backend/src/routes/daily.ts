import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { loadQuestionsFromApi } from '../services/enemService';

const router = Router();

// Obter questão do dia
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Verifica se já existe questão atribuída para hoje
    let daily = db.getDailyQuestion(req.userId!, today);

    if (!daily) {
      // Busca questões locais
      let allQuestions = db.listQuestions({ limit: 100 }).questions;

      if (allQuestions.length === 0) {
        // Importa da API se o banco estiver vazio
        await loadQuestionsFromApi(2023, 'matematica', 5);
        allQuestions = db.listQuestions({ limit: 100 }).questions;
      }

      if (allQuestions.length === 0) {
        return res.status(404).json({ error: 'Nenhuma questão disponível para a Questão do Dia.' });
      }

      // Escolhe questão aleatória
      const chosen = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      daily = db.createDailyQuestion(req.userId!, chosen.id, today);
    }

    // Carrega detalhes completos
    const question = db.getQuestionById(daily.question_id);
    if (!question) {
      return res.status(404).json({ error: 'Questão do dia não encontrada.' });
    }

    const alts = db.getAlternatives(daily.question_id);
    const topic = question.topic_id ? db.getTopicById(question.topic_id) : null;
    const isCompleted = daily.completed === 1 || db.hasUserAnsweredQuestionToday(req.userId!, daily.question_id, today);
    const lastAttempt = isCompleted ? db.getLastUserAttempt(req.userId!, daily.question_id) : null;

    return res.json({
      id: question.id,
      year: question.year,
      questionNumber: question.question_number,
      discipline: question.discipline,
      language: question.language,
      context: question.context,
      statement: question.statement,
      correctAnswer: question.correct_answer,
      imageUrl: question.image_url,
      difficulty: question.difficulty,
      topicId: question.topic_id,
      explanation: question.explanation,
      alternatives: alts,
      topic,
      completed: isCompleted,
      date: daily.date,
      lastAttempt,
    });
  } catch (err) {
    console.error('[Daily Question Error]:', err);
    return res.status(500).json({ error: 'Erro ao carregar a questão do dia.' });
  }
});

export default router;
