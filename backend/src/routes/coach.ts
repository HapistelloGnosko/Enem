import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateCoachDiagnosis } from '../services/coachService';
import { calculateTopicPriorities } from '../services/priorityEngine';

const router = Router();

// Obter diagnóstico completo e plano de treino diário do Coach IA
router.get('/', authenticate, (req: AuthRequest, res) => {
  try {
    const diagnosis = generateCoachDiagnosis(req.userId!);
    return res.json(diagnosis);
  } catch (err) {
    console.error('[Coach Diagnosis Error]:', err);
    return res.status(500).json({ error: 'Erro ao gerar diagnóstico do Coach.' });
  }
});

// Listar prioridades pedagógicas de todos os assuntos
router.get('/priorities', authenticate, (req: AuthRequest, res) => {
  try {
    const priorities = calculateTopicPriorities(req.userId!);
    return res.json(priorities);
  } catch (err) {
    console.error('[Coach Priorities Error]:', err);
    return res.status(500).json({ error: 'Erro ao calcular prioridades pedagógicas.' });
  }
});

export default router;
