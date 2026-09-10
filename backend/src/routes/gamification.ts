import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculatePowerScore } from '../services/powerScoreService';

const router = Router();

// Listar todas as conquistas e o progresso do usuário
router.get('/achievements', authenticate, (req: AuthRequest, res) => {
  try {
    const achievements = db.getUserAchievements(req.userId!);
    return res.json(achievements);
  } catch (err) {
    console.error('[Get Achievements Error]:', err);
    return res.status(500).json({ error: 'Erro ao listar conquistas.' });
  }
});

// Listar todos os títulos e status de desbloqueio
router.get('/titles', authenticate, (req: AuthRequest, res) => {
  try {
    const titles = db.getUserTitles(req.userId!);
    return res.json(titles);
  } catch (err) {
    console.error('[Get Titles Error]:', err);
    return res.status(500).json({ error: 'Erro ao listar títulos.' });
  }
});

// Detalhamento do ENEM Power Score
router.get('/power-score', authenticate, (req: AuthRequest, res) => {
  try {
    const powerScoreData = calculatePowerScore(req.userId!);
    return res.json(powerScoreData);
  } catch (err) {
    console.error('[Get Power Score Error]:', err);
    return res.status(500).json({ error: 'Erro ao calcular Power Score.' });
  }
});

export default router;
