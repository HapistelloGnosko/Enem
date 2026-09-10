import { sqlite, db } from '../db/index';
import { INITIAL_TITLES, INITIAL_ACHIEVEMENTS } from '../db/rpgData';
import { calculatePowerScore } from './powerScoreService';

export interface UnlockedReward {
  type: 'title' | 'achievement';
  name: string;
  description: string;
  xpReward?: number;
}

/**
 * Inicializa dados de RPG (títulos e conquistas essenciais) no banco caso ainda não existam.
 */
export function seedRpgTables() {
  const insertTitle = sqlite.prepare(`
    INSERT OR IGNORE INTO titles (slug, name, description, category, unlock_condition_type, unlock_condition_value)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const t of INITIAL_TITLES) {
    insertTitle.run(t.slug, t.name, t.description, t.category, t.unlockConditionType, t.unlockConditionValue);
  }

  const insertAchievement = sqlite.prepare(`
    INSERT OR IGNORE INTO achievements (slug, name, description, category, xp_reward, icon, target_value)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of INITIAL_ACHIEVEMENTS) {
    insertAchievement.run(a.slug, a.name, a.description, a.category, a.xpReward, a.icon, a.targetValue);
  }
}

/**
 * Garante que o usuário possua ao menos o título "Novato" desbloqueado e equipado.
 */
export function ensureInitialUserRpgState(userId: number) {
  const novato = sqlite.prepare('SELECT id FROM titles WHERE slug = ?').get('novato') as { id: number } | undefined;
  if (novato) {
    sqlite.prepare(`
      INSERT OR IGNORE INTO user_titles (user_id, title_id, equipped)
      VALUES (?, ?, 1)
    `).run(userId, novato.id);
  }

  // Garante registro de streaks
  sqlite.prepare(`
    INSERT OR IGNORE INTO user_streaks (user_id, study_streak, accuracy_streak, review_streak, mission_streak)
    VALUES (?, 0, 0, 0, 0)
  `).run(userId);
}

/**
 * Verifica e desbloqueia conquistas e títulos pendentes após uma tentativa ou ação do estudante.
 */
export function evaluateGamificationProgress(userId: number): UnlockedReward[] {
  const rewards: UnlockedReward[] = [];

  // Estatísticas do usuário
  const user = db.findUserById(userId);
  if (!user) return rewards;

  const stats = db.getUserStats(userId);
  const topicStats = db.getUserTopicStatsList(userId);
  const highestMastery = topicStats.reduce((max, t) => Math.max(max, t.mastery_score), 0);

  // 1. Conquistas
  const allAchievements = sqlite.prepare('SELECT * FROM achievements').all() as {
    id: number;
    slug: string;
    name: string;
    description: string;
    category: string;
    xp_reward: number;
    target_value: number;
  }[];

  const unlockedMap = new Set(
    (sqlite.prepare('SELECT achievement_id FROM user_achievements WHERE user_id = ? AND unlocked_at IS NOT NULL').all(userId) as { achievement_id: number }[])
      .map((r) => r.achievement_id)
  );

  const unlockAchievementStmt = sqlite.prepare(`
    INSERT INTO user_achievements (user_id, achievement_id, unlocked_at, progress)
    VALUES (?, ?, datetime('now'), ?)
    ON CONFLICT(user_id, achievement_id) DO UPDATE SET
      unlocked_at = excluded.unlocked_at,
      progress = excluded.progress
  `);

  for (const ach of allAchievements) {
    if (unlockedMap.has(ach.id)) continue;

    let progress = 0;
    let unlocked = false;

    switch (ach.slug) {
      case 'primeira-questao':
        progress = Math.min(stats.total, 1);
        unlocked = stats.total >= 1;
        break;
      case '10-questoes':
        progress = Math.min(stats.total, 10);
        unlocked = stats.total >= 10;
        break;
      case '50-questoes':
        progress = Math.min(stats.total, 50);
        unlocked = stats.total >= 50;
        break;
      case '100-questoes':
        progress = Math.min(stats.total, 100);
        unlocked = stats.total >= 100;
        break;
      case '500-questoes':
        progress = Math.min(stats.total, 500);
        unlocked = stats.total >= 500;
        break;
      case 'streak-3':
        progress = Math.min(user.streak, 3);
        unlocked = user.streak >= 3;
        break;
      case 'streak-7':
        progress = Math.min(user.streak, 7);
        unlocked = user.streak >= 7;
        break;
      case 'streak-14':
        progress = Math.min(user.streak, 14);
        unlocked = user.streak >= 14;
        break;
      case 'streak-30':
        progress = Math.min(user.streak, 30);
        unlocked = user.streak >= 30;
        break;
      case 'precisao-80':
        progress = stats.accuracy;
        unlocked = stats.total >= 20 && stats.accuracy >= 80;
        break;
      case 'precisao-90':
        progress = stats.accuracy;
        unlocked = stats.total >= 30 && stats.accuracy >= 90;
        break;
      case 'maestria-80':
        progress = Math.round(highestMastery);
        unlocked = highestMastery >= 80;
        break;
    }

    if (unlocked) {
      unlockAchievementStmt.run(userId, ach.id, progress);
      // Concede XP da conquista
      if (ach.xp_reward > 0) {
        db.updateUser(userId, { xp: (user.xp || 0) + ach.xp_reward });
      }
      rewards.push({
        type: 'achievement',
        name: ach.name,
        description: ach.description,
        xpReward: ach.xp_reward,
      });
    }
  }

  // 2. Títulos
  const allTitles = sqlite.prepare('SELECT * FROM titles').all() as {
    id: number;
    slug: string;
    name: string;
    description: string;
    unlock_condition_type: string;
    unlock_condition_value: number;
  }[];

  const unlockedTitlesMap = new Set(
    (sqlite.prepare('SELECT title_id FROM user_titles WHERE user_id = ?').all(userId) as { title_id: number }[])
      .map((r) => r.title_id)
  );

  const unlockTitleStmt = sqlite.prepare(`
    INSERT OR IGNORE INTO user_titles (user_id, title_id, unlocked_at, equipped)
    VALUES (?, ?, datetime('now'), 0)
  `);

  for (const t of allTitles) {
    if (unlockedTitlesMap.has(t.id)) continue;

    let meetsCondition = false;
    switch (t.unlock_condition_type) {
      case 'default':
        meetsCondition = true;
        break;
      case 'questions_count':
        meetsCondition = stats.total >= t.unlock_condition_value;
        break;
      case 'streak':
        meetsCondition = user.streak >= t.unlock_condition_value;
        break;
      case 'accuracy':
        meetsCondition = stats.total >= 20 && stats.accuracy >= t.unlock_condition_value;
        break;
      case 'mastery':
        meetsCondition = highestMastery >= t.unlock_condition_value;
        break;
      case 'level':
        meetsCondition = user.level >= t.unlock_condition_value;
        break;
      case 'area_mastery': {
        const areaMap: Record<string, string> = {
          'mestre-matematica': 'matematica',
          'mestre-natureza': 'ciencias-natureza',
          'mestre-humanas': 'ciencias-humanas',
          'mestre-linguagens': 'linguagens',
        };
        const targetArea = areaMap[t.slug];
        if (targetArea) {
          const areaTopics = topicStats.filter((ts) => ts.area === targetArea);
          const areaAvg = areaTopics.length > 0 ? areaTopics.reduce((acc, c) => acc + c.mastery_score, 0) / areaTopics.length : 0;
          meetsCondition = areaAvg >= t.unlock_condition_value;
        }
        break;
      }
    }

    if (meetsCondition) {
      unlockTitleStmt.run(userId, t.id);
      rewards.push({
        type: 'title',
        name: t.name,
        description: t.description,
      });
    }
  }

  // 3. Atualiza Power Score e Liga
  const { score, league } = calculatePowerScore(userId);
  sqlite.prepare('UPDATE users SET power_score = ?, active_league = ? WHERE id = ?').run(score, league, userId);

  return rewards;
}

/**
 * Detecção e Gerenciamento do Mecanismo de Retorno ao Treino.
 */
export function checkReturnMission(userId: number): {
  active: boolean;
  daysAway: number;
  easyProgress: number;
  mediumProgress: number;
  reviewProgress: number;
  completed: boolean;
} {
  const user = db.findUserById(userId);
  if (!user) {
    return { active: false, daysAway: 0, easyProgress: 0, mediumProgress: 0, reviewProgress: 0, completed: false };
  }

  let streakRow = sqlite.prepare('SELECT * FROM user_streaks WHERE user_id = ?').get(userId) as any;
  if (!streakRow) {
    sqlite.prepare('INSERT INTO user_streaks (user_id) VALUES (?)').run(userId);
    streakRow = sqlite.prepare('SELECT * FROM user_streaks WHERE user_id = ?').get(userId);
  }

  let daysAway = 0;
  if (user.last_study_date) {
    const lastDate = new Date(user.last_study_date).getTime();
    const now = Date.now();
    daysAway = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
  }

  // Se ficou 3 ou mais dias longe e ainda não tem missão de retorno ativa, ativa automaticamente
  if (daysAway >= 3 && !streakRow.return_mission_active) {
    sqlite.prepare(`
      UPDATE user_streaks SET
        return_mission_active = 1,
        return_mission_easy = 0,
        return_mission_medium = 0,
        return_mission_review = 0
      WHERE user_id = ?
    `).run(userId);
    streakRow.return_mission_active = 1;
    streakRow.return_mission_easy = 0;
    streakRow.return_mission_medium = 0;
    streakRow.return_mission_review = 0;
  }

  const isCompleted =
    streakRow.return_mission_easy >= 3 &&
    streakRow.return_mission_medium >= 2 &&
    streakRow.return_mission_review >= 1;

  return {
    active: streakRow.return_mission_active === 1,
    daysAway,
    easyProgress: streakRow.return_mission_easy,
    mediumProgress: streakRow.return_mission_medium,
    reviewProgress: streakRow.return_mission_review,
    completed: isCompleted,
  };
}

/**
 * Registra progresso na Missão de Retorno.
 */
export function recordReturnMissionAttempt(userId: number, difficulty: string) {
  const streakRow = sqlite.prepare('SELECT * FROM user_streaks WHERE user_id = ?').get(userId) as any;
  if (!streakRow || !streakRow.return_mission_active) return;

  if (difficulty === 'easy' && streakRow.return_mission_easy < 3) {
    sqlite.prepare('UPDATE user_streaks SET return_mission_easy = return_mission_easy + 1 WHERE user_id = ?').run(userId);
  } else if (difficulty === 'medium' && streakRow.return_mission_medium < 2) {
    sqlite.prepare('UPDATE user_streaks SET return_mission_medium = return_mission_medium + 1 WHERE user_id = ?').run(userId);
  } else if ((difficulty === 'hard' || difficulty === 'very_hard') && streakRow.return_mission_review < 1) {
    sqlite.prepare('UPDATE user_streaks SET return_mission_review = return_mission_review + 1 WHERE user_id = ?').run(userId);
  }
}

/**
 * Conclui a Missão de Retorno e concede recompensa de +150 XP.
 */
export function claimReturnMissionReward(userId: number): { success: boolean; xpGained: number } {
  const mission = checkReturnMission(userId);
  if (!mission.active || !mission.completed) {
    return { success: false, xpGained: 0 };
  }

  // Conclui e reseta
  sqlite.prepare(`
    UPDATE user_streaks SET
      return_mission_active = 0,
      return_mission_easy = 0,
      return_mission_medium = 0,
      return_mission_review = 0
    WHERE user_id = ?
  `).run(userId);

  const user = db.findUserById(userId);
  if (user) {
    db.updateUser(userId, { xp: (user.xp || 0) + 150 });
  }

  return { success: true, xpGained: 150 };
}

/**
 * Sistema de Prestígio (I a V)
 * Ao atingir nível >= 50 ou sob comando, reinicia o nível para 1 mantendo histórico e títulos.
 */
export function upgradeUserPrestige(userId: number): { success: boolean; newPrestige: number; message: string } {
  const user = db.findUserById(userId);
  if (!user) return { success: false, newPrestige: 0, message: 'Usuário não encontrado.' };

  const currentPrestige = user.prestige || 0;
  if (currentPrestige >= 5) {
    return { success: false, newPrestige: 5, message: 'Você já atingiu o nível máximo de Prestígio (Prestígio V).' };
  }

  const newPrestige = currentPrestige + 1;
  sqlite.prepare(`
    UPDATE users SET
      prestige = ?,
      level = 1,
      xp = 0
    WHERE id = ?
  `).run(newPrestige, userId);

  return {
    success: true,
    newPrestige,
    message: `Ascensão confirmada! Você agora ostenta PRESTÍGIO ${['I', 'II', 'III', 'IV', 'V'][newPrestige - 1]}.`,
  };
}
