import { Router } from 'express';
import { db } from '../db/index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { xpProgress } from '../services/xpService';
import { checkReturnMission, claimReturnMissionReward, upgradeUserPrestige } from '../services/gamificationService';
import { calculatePowerScore } from '../services/powerScoreService';

const router = Router();

router.get('/me', authenticate, (req: AuthRequest, res) => {
  try {
    const user = db.findUserById(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const progress = xpProgress(user.xp);
    const returnMission = checkReturnMission(user.id);
    const powerScoreData = calculatePowerScore(user.id);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      streak: user.streak,
      title: user.title || 'Novato',
      avatar: user.avatar || 'avatar-1',
      prestige: user.prestige || 0,
      powerScore: powerScoreData.score,
      activeLeague: powerScoreData.league,
      lastStudyDate: user.last_study_date,
      createdAt: user.created_at,
      returnMission,
      ...progress,
    });
  } catch (err) {
    console.error('[User Me Error]:', err);
    return res.status(500).json({ error: 'Erro ao carregar dados do usuário.' });
  }
});

// Atualizar avatar
router.patch('/me/avatar', authenticate, (req: AuthRequest, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ error: 'Avatar não especificado.' });
    }

    db.updateUser(req.userId!, { avatar });
    return res.json({ success: true, avatar });
  } catch (err) {
    console.error('[Update Avatar Error]:', err);
    return res.status(500).json({ error: 'Erro ao atualizar avatar.' });
  }
});

// Equipar título
router.post('/me/equip-title', authenticate, (req: AuthRequest, res) => {
  try {
    const { titleId } = req.body;
    if (!titleId) {
      return res.status(400).json({ error: 'titleId é obrigatório.' });
    }

    const success = db.equipUserTitle(req.userId!, Number(titleId));
    if (!success) {
      return res.status(400).json({ error: 'Título bloqueado ou não encontrado.' });
    }

    const user = db.findUserById(req.userId!)!;
    return res.json({ success: true, equippedTitle: user.title });
  } catch (err) {
    console.error('[Equip Title Error]:', err);
    return res.status(500).json({ error: 'Erro ao equipar título.' });
  }
});

// Fazer Prestígio
router.post('/me/prestige', authenticate, (req: AuthRequest, res) => {
  try {
    const result = upgradeUserPrestige(req.userId!);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    return res.json(result);
  } catch (err) {
    console.error('[Prestige Error]:', err);
    return res.status(500).json({ error: 'Erro ao realizar prestígio.' });
  }
});

// Resgatar Recompensa de Missão de Retorno
router.post('/me/claim-return-mission', authenticate, (req: AuthRequest, res) => {
  try {
    const result = claimReturnMissionReward(req.userId!);
    if (!result.success) {
      return res.status(400).json({ error: 'Missão de retorno incompleta ou não encontrada.' });
    }
    return res.json({
      success: true,
      message: 'Parabéns pelo retorno ao foco! +150 XP concedido.',
      xpGained: result.xpGained,
    });
  } catch (err) {
    console.error('[Claim Return Mission Error]:', err);
    return res.status(500).json({ error: 'Erro ao resgatar recompensa.' });
  }
});

export default router;
