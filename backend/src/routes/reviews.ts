import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Listar assuntos pendentes de revisão hoje
router.get('/', authenticate, (req: AuthRequest, res) => {
  try {
    const dueReviews = db.getReviewsDue(req.userId!);
    return res.json(dueReviews);
  } catch (err) {
    console.error('[Get Reviews Error]:', err);
    return res.status(500).json({ error: 'Erro ao carregar revisões pendentes.' });
  }
});

// Concluir uma sessão de revisão espaçada (avança intervalo de repetição)
router.post('/complete', authenticate, (req: AuthRequest, res) => {
  try {
    const { topicId } = req.body;
    if (!topicId) {
      return res.status(400).json({ error: 'topicId é obrigatório.' });
    }

    const result = db.completeReview(req.userId!, Number(topicId));
    // Concede +50 XP por manutenção da rotina de revisão
    const user = db.findUserById(req.userId!)!;
    db.updateUser(req.userId!, { xp: (user.xp || 0) + 50 });

    return res.json({
      success: true,
      message: `Revisão concluída! Próxima repetição agendada para ${result.nextDate} (+50 XP).`,
      ...result,
    });
  } catch (err) {
    console.error('[Complete Review Error]:', err);
    return res.status(500).json({ error: 'Erro ao registrar conclusão da revisão.' });
  }
});

// Agendar manualmente uma revisão
router.post('/schedule', authenticate, (req: AuthRequest, res) => {
  try {
    const { topicId, nextReviewDate, intervalDays = 1 } = req.body;
    if (!topicId || !nextReviewDate) {
      return res.status(400).json({ error: 'topicId e nextReviewDate são obrigatórios.' });
    }

    db.scheduleReview(req.userId!, Number(topicId), nextReviewDate, Number(intervalDays));
    return res.json({ success: true, message: 'Revisão agendada com sucesso.' });
  } catch (err) {
    console.error('[Schedule Review Error]:', err);
    return res.status(500).json({ error: 'Erro ao agendar revisão.' });
  }
});

export default router;
