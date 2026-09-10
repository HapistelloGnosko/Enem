import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Listar erros catalogados e estatísticas do Codex
router.get('/', authenticate, (req: AuthRequest, res) => {
  try {
    const { limit = '50' } = req.query as { limit?: string };
    const errors = db.getCodexErrors(req.userId!, Number(limit));
    const stats = db.getCodexStats(req.userId!);

    return res.json({
      errors,
      stats,
    });
  } catch (err) {
    console.error('[Codex List Error]:', err);
    return res.status(500).json({ error: 'Erro ao carregar Codex dos Erros.' });
  }
});

// Classificar motivo do erro e salvar anotações pessoais
router.patch('/:attemptId/reason', authenticate, (req: AuthRequest, res) => {
  try {
    const attemptId = Number(req.params.attemptId);
    const { errorReason, userNotes } = req.body;

    if (!errorReason) {
      return res.status(400).json({ error: 'errorReason é obrigatório.' });
    }

    db.updateAttemptReason(attemptId, req.userId!, errorReason, userNotes);
    return res.json({ success: true, attemptId, errorReason, userNotes });
  } catch (err) {
    console.error('[Update Error Reason Error]:', err);
    return res.status(500).json({ error: 'Erro ao classificar motivo do erro.' });
  }
});

export default router;
