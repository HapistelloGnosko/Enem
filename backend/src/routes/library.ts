import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getLibraryOverview, getLibraryTopicDetail } from '../services/libraryService';

const router = Router();

// Visão geral da Biblioteca: todos os assuntos do ENEM agrupados por área
router.get('/', authenticate, (req: AuthRequest, res) => {
  try {
    const areas = getLibraryOverview(req.userId!);
    return res.json({ areas });
  } catch (err) {
    console.error('[Get Library Error]:', err);
    return res.status(500).json({ error: 'Erro ao carregar a biblioteca de conteúdos.' });
  }
});

// Conteúdo completo de um assunto específico
router.get('/:topicId', authenticate, (req: AuthRequest, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    if (isNaN(topicId)) return res.status(400).json({ error: 'ID de tópico inválido.' });

    const detail = getLibraryTopicDetail(req.userId!, topicId);
    if (!detail) {
      return res.status(404).json({ error: 'Tópico não encontrado.' });
    }

    return res.json(detail);
  } catch (err) {
    console.error('[Get Library Topic Error]:', err);
    return res.status(500).json({ error: 'Erro ao carregar o conteúdo do assunto.' });
  }
});

export default router;
