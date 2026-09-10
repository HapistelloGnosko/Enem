import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { loadQuestionsFromApi } from '../services/enemService';
import { getNextRecommendedQuestion } from '../services/recommendService';

const router = Router();

// Listagem com paginação e filtros
router.get('/', authenticate, (req: AuthRequest, res) => {
  try {
    const { discipline, year, limit = '25', offset = '0' } = req.query as Record<string, string>;

    const result = db.listQuestions({
      discipline: discipline || undefined,
      year: year ? parseInt(year) : undefined,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.json(result);
  } catch (err) {
    console.error('[List Questions Error]:', err);
    return res.status(500).json({ error: 'Erro ao listar questões.' });
  }
});

// Recomenda a próxima questão estratégica
router.get('/next', authenticate, async (req: AuthRequest, res) => {
  try {
    const { discipline } = req.query as { discipline?: string };
    const questionId = await getNextRecommendedQuestion(req.userId!, discipline);

    if (!questionId) {
      return res.status(404).json({ error: 'Nenhuma questão disponível para recomendação.' });
    }

    const question = db.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Questão recomendada não encontrada.' });
    }

    const alts = db.getAlternatives(questionId);
    const topic = question.topic_id ? db.getTopicById(question.topic_id) : null;

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
    });
  } catch (err) {
    console.error('[Next Question Error]:', err);
    return res.status(500).json({ error: 'Erro ao recomendar questão.' });
  }
});

// Obter detalhes de uma questão específica
router.get('/:id', authenticate, (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    const question = db.getQuestionById(id);
    if (!question) {
      return res.status(404).json({ error: 'Questão não encontrada.' });
    }

    const alts = db.getAlternatives(id);
    const topic = question.topic_id ? db.getTopicById(question.topic_id) : null;
    const attemptCount = db.countAttempts(req.userId!, id);
    const lastAttempt = attemptCount > 0 ? db.getLastUserAttempt(req.userId!, id) : null;

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
      userAttemptCount: attemptCount,
      lastAttempt,
    });
  } catch (err) {
    console.error('[Get Question Error]:', err);
    return res.status(500).json({ error: 'Erro ao buscar questão.' });
  }
});

// Importar questões sob demanda da API do ENEM ou EnemHub
router.post('/import', authenticate, async (req: AuthRequest, res) => {
  try {
    const { source = 'enem_dev', year = 2023, discipline = 'matematica', limit = 15, page = 1 } = req.body;

    let count = 0;
    let sourceName = 'API ENEM';

    if (source === 'enemhub') {
      const { loadQuestionsFromEnemHub } = await import('../services/enemHubService');
      count = await loadQuestionsFromEnemHub(Number(year), Number(limit), Number(page));
      sourceName = 'EnemHub API (80k+ questões)';
    } else {
      count = await loadQuestionsFromApi(Number(year), discipline, Number(limit));
    }

    return res.json({
      message: `${count} questão(ões) importada(s) com sucesso de ${sourceName}.`,
      importedCount: count,
    });
  } catch (err) {
    console.error('[Import Questions Error]:', err);
    return res.status(500).json({ error: 'Erro ao importar questões da API.' });
  }
});

export default router;
