// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.resolve(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const dbPath = path.join(DATA_DIR, 'enem-quest.db');
export const sqlite = new DatabaseSync(dbPath);

// Execute pragmas
sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

// Define typed helper interfaces
export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  xp: number;
  level: number;
  streak: number;
  title?: string;
  avatar?: string;
  prestige?: number;
  power_score?: number;
  active_league?: string;
  last_study_date: string | null;
  created_at: string;
}

export interface TitleRecord {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  unlock_condition_type: string;
  unlock_condition_value: number;
  unlocked?: boolean;
  equipped?: boolean;
}

export interface AchievementRecord {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  xp_reward: number;
  icon: string;
  target_value: number;
  unlocked?: boolean;
  progress?: number;
  unlocked_at?: string | null;
}

export interface UserStreakRecord {
  id: number;
  user_id: number;
  study_streak: number;
  accuracy_streak: number;
  review_streak: number;
  mission_streak: number;
  last_study_date: string | null;
  return_mission_active: number;
  return_mission_easy: number;
  return_mission_medium: number;
  return_mission_review: number;
}

export interface TopicRecord {
  id: number;
  area: string;
  name: string;
  slug: string;
  keywords: string;
}

export interface TopicContentRecord {
  id: number;
  topic_id: number;
  summary: string;
  key_points: string;
  common_traps: string;
  study_tip: string | null;
  updated_at: string;
}

export interface QuestionRecord {
  id: number;
  year: number;
  question_number: number;
  discipline: string;
  language: string | null;
  context: string | null;
  statement: string;
  correct_answer: string;
  image_url: string | null;
  source: string;
  topic_id: number | null;
  subtopic: string | null;
  difficulty: string;
  classification_confidence: string;
  explanation: string | null;
  cached_at: string;
}

export interface AlternativeRecord {
  id: number;
  question_id: number;
  letter: string;
  text: string;
  image_url: string | null;
}

export interface AttemptRecord {
  id: number;
  user_id: number;
  question_id: number;
  selected_answer: string;
  correct: number;
  time_spent: number;
  xp_gained: number;
  attempt_number: number;
  error_reason?: string | null;
  user_notes?: string | null;
  created_at: string;
}

export interface ReviewRecord {
  id: number;
  user_id: number;
  topic_id: number;
  last_reviewed_at: string | null;
  next_review_at: string;
  interval_days: number;
  review_count: number;
  topic_name?: string;
  area?: string;
  mastery_score?: number;
}

export interface UserTopicStatRecord {
  user_id: number;
  topic_id: number;
  questions_answered: number;
  correct_answers: number;
  wrong_answers: number;
  mastery_score: number;
  average_time: number;
  last_attempt_at: string | null;
  topic_name?: string;
  area?: string;
}

export interface DailyQuestionRecord {
  id: number;
  user_id: number;
  question_id: number;
  date: string;
  completed: number;
}

export const db = {
  // Users
  findUserByEmail(email: string): UserRecord | undefined {
    const stmt = sqlite.prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    return stmt.get(email) as UserRecord | undefined;
  },

  findUserById(id: number): UserRecord | undefined {
    const stmt = sqlite.prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    return stmt.get(id) as UserRecord | undefined;
  },

  createUser(name: string, email: string, passwordHash: string): UserRecord {
    const stmt = sqlite.prepare(`
      INSERT INTO users (name, email, password_hash, xp, level, streak)
      VALUES (?, ?, ?, 0, 1, 0)
    `);
    const info = stmt.run(name, email, passwordHash);
    return this.findUserById(Number(info.lastInsertRowid))!;
  },

  updateUser(id: number, data: {
    xp?: number;
    level?: number;
    streak?: number;
    title?: string;
    avatar?: string;
    prestige?: number;
    powerScore?: number;
    activeLeague?: string;
    lastStudyDate?: string;
  }) {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.xp !== undefined) { fields.push('xp = ?'); params.push(data.xp); }
    if (data.level !== undefined) { fields.push('level = ?'); params.push(data.level); }
    if (data.streak !== undefined) { fields.push('streak = ?'); params.push(data.streak); }
    if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
    if (data.avatar !== undefined) { fields.push('avatar = ?'); params.push(data.avatar); }
    if (data.prestige !== undefined) { fields.push('prestige = ?'); params.push(data.prestige); }
    if (data.powerScore !== undefined) { fields.push('power_score = ?'); params.push(data.powerScore); }
    if (data.activeLeague !== undefined) { fields.push('active_league = ?'); params.push(data.activeLeague); }
    if (data.lastStudyDate !== undefined) { fields.push('last_study_date = ?'); params.push(data.lastStudyDate); }

    if (fields.length > 0) {
      params.push(id);
      sqlite.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    }
  },

  // RPG: Títulos
  getUserTitles(userId: number): TitleRecord[] {
    return sqlite.prepare(`
      SELECT t.*,
             CASE WHEN ut.id IS NOT NULL THEN 1 ELSE 0 END as unlocked,
             COALESCE(ut.equipped, 0) as equipped
      FROM titles t
      LEFT JOIN user_titles ut ON t.id = ut.title_id AND ut.user_id = ?
      ORDER BY t.id ASC
    `).all(userId) as unknown as TitleRecord[];
  },

  equipUserTitle(userId: number, titleId: number): boolean {
    const unlocked = sqlite.prepare('SELECT id FROM user_titles WHERE user_id = ? AND title_id = ?').get(userId, titleId);
    if (!unlocked) return false;

    // Desequipar todos
    sqlite.prepare('UPDATE user_titles SET equipped = 0 WHERE user_id = ?').run(userId);
    // Equipar o selecionado
    sqlite.prepare('UPDATE user_titles SET equipped = 1 WHERE user_id = ? AND title_id = ?').run(userId, titleId);

    // Atualizar no perfil do usuário
    const titleObj = sqlite.prepare('SELECT name FROM titles WHERE id = ?').get(titleId) as { name: string } | undefined;
    if (titleObj) {
      sqlite.prepare('UPDATE users SET title = ? WHERE id = ?').run(titleObj.name, userId);
    }
    return true;
  },

  // RPG: Conquistas
  getUserAchievements(userId: number): AchievementRecord[] {
    return sqlite.prepare(`
      SELECT a.*,
             CASE WHEN ua.unlocked_at IS NOT NULL THEN 1 ELSE 0 END as unlocked,
             COALESCE(ua.progress, 0) as progress,
             ua.unlocked_at
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
      ORDER BY a.id ASC
    `).all(userId) as unknown as AchievementRecord[];
  },

  // Topics
  getAllTopics(): TopicRecord[] {
    return sqlite.prepare('SELECT * FROM topics').all() as unknown as TopicRecord[];
  },

  getTopicById(id: number): TopicRecord | undefined {
    return sqlite.prepare('SELECT * FROM topics WHERE id = ?').get(id) as TopicRecord | undefined;
  },

  findTopicBySlug(slug: string): TopicRecord | undefined {
    return sqlite.prepare('SELECT * FROM topics WHERE slug = ?').get(slug) as TopicRecord | undefined;
  },

  insertTopic(area: string, name: string, slug: string, keywords: string): number {
    const stmt = sqlite.prepare(`
      INSERT OR IGNORE INTO topics (area, name, slug, keywords)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(area, name, slug, keywords);
    return Number(info.lastInsertRowid);
  },

  // Biblioteca de Conteúdos (topic_content)
  getTopicContent(topicId: number): TopicContentRecord | undefined {
    return sqlite.prepare('SELECT * FROM topic_content WHERE topic_id = ?').get(topicId) as TopicContentRecord | undefined;
  },

  upsertTopicContent(data: {
    topicId: number;
    summary: string;
    keyPoints: string;
    commonTraps: string;
    studyTip?: string | null;
  }): void {
    sqlite.prepare(`
      INSERT INTO topic_content (topic_id, summary, key_points, common_traps, study_tip, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(topic_id) DO UPDATE SET
        summary = excluded.summary,
        key_points = excluded.key_points,
        common_traps = excluded.common_traps,
        study_tip = excluded.study_tip,
        updated_at = datetime('now')
    `).run(data.topicId, data.summary, data.keyPoints, data.commonTraps, data.studyTip ?? null);
  },

  countQuestionsByTopic(topicId: number): number {
    const row = sqlite.prepare('SELECT count(*) as total FROM questions WHERE topic_id = ?').get(topicId) as { total: number };
    return row.total;
  },

  // Questions
  listQuestions(options?: { discipline?: string; year?: number; limit?: number; offset?: number }): { questions: QuestionRecord[]; total: number } {
    const where: string[] = [];
    const params: any[] = [];

    if (options?.discipline) {
      where.push('discipline = ?');
      params.push(options.discipline);
    }
    if (options?.year) {
      where.push('year = ?');
      params.push(options.year);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countRow = sqlite.prepare(`SELECT count(*) as total FROM questions ${whereClause}`).get(...params) as { total: number };

    const limit = options?.limit || 25;
    const offset = options?.offset || 0;
    params.push(limit, offset);

    const questions = sqlite.prepare(`
      SELECT * FROM questions ${whereClause} ORDER BY year DESC, question_number ASC LIMIT ? OFFSET ?
    `).all(...params) as unknown as QuestionRecord[];

    return { questions, total: countRow.total };
  },

  getQuestionById(id: number): QuestionRecord | undefined {
    return sqlite.prepare('SELECT * FROM questions WHERE id = ?').get(id) as QuestionRecord | undefined;
  },

  findQuestionByYearAndIndex(year: number, index: number): QuestionRecord | undefined {
    return sqlite.prepare('SELECT * FROM questions WHERE year = ? AND question_number = ?').get(year, index) as QuestionRecord | undefined;
  },

  createQuestion(data: {
    year: number;
    questionNumber: number;
    discipline: string;
    language?: string | null;
    context?: string | null;
    statement: string;
    correctAnswer: string;
    imageUrl?: string | null;
    source?: string;
    topicId?: number | null;
    subtopic?: string | null;
    difficulty?: string;
    classificationConfidence?: string;
    explanation?: string | null;
  }): number {
    const stmt = sqlite.prepare(`
      INSERT INTO questions (
        year, question_number, discipline, language, context, statement,
        correct_answer, image_url, source, topic_id, subtopic, difficulty,
        classification_confidence, explanation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      data.year,
      data.questionNumber,
      data.discipline,
      data.language || null,
      data.context || null,
      data.statement,
      data.correctAnswer,
      data.imageUrl || null,
      data.source || 'api',
      data.topicId || null,
      data.subtopic || null,
      data.difficulty || 'medium',
      data.classificationConfidence || 'low',
      data.explanation || null
    );

    return Number(info.lastInsertRowid);
  },

  // Alternatives
  getAlternatives(questionId: number): AlternativeRecord[] {
    return sqlite.prepare('SELECT * FROM alternatives WHERE question_id = ? ORDER BY letter ASC').all(questionId) as unknown as AlternativeRecord[];
  },

  createAlternative(questionId: number, letter: string, text: string, imageUrl?: string | null): number {
    const stmt = sqlite.prepare(`
      INSERT INTO alternatives (question_id, letter, text, image_url)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(questionId, letter, text, imageUrl || null);
    return Number(info.lastInsertRowid);
  },

  // Attempts
  createAttempt(data: {
    userId: number;
    questionId: number;
    selectedAnswer: string;
    correct: boolean;
    timeSpent: number;
    xpGained: number;
    attemptNumber: number;
  }): number {
    const stmt = sqlite.prepare(`
      INSERT INTO attempts (user_id, question_id, selected_answer, correct, time_spent, xp_gained, attempt_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      data.userId,
      data.questionId,
      data.selectedAnswer,
      data.correct ? 1 : 0,
      data.timeSpent,
      data.xpGained,
      data.attemptNumber
    );
    return Number(info.lastInsertRowid);
  },

  countAttempts(userId: number, questionId: number): number {
    const row = sqlite.prepare('SELECT count(*) as count FROM attempts WHERE user_id = ? AND question_id = ?').get(userId, questionId) as { count: number };
    return row.count;
  },

  getRecentCorrectQuestionIds(userId: number, days = 7): number[] {
    const rows = sqlite.prepare(`
      SELECT DISTINCT question_id FROM attempts
      WHERE user_id = ? AND correct = 1 AND created_at > datetime('now', '-${days} days')
    `).all(userId) as unknown as { question_id: number }[];
    return rows.map(r => r.question_id);
  },

  getUserStats(userId: number) {
    const totalRow = sqlite.prepare('SELECT count(*) as total, sum(case when correct = 1 then 1 else 0 end) as correct FROM attempts WHERE user_id = ?').get(userId) as { total: number; correct: number | null };
    const total = totalRow.total || 0;
    const correct = totalRow.correct || 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const daily = sqlite.prepare(`
      SELECT date(created_at) as date, count(*) as total, sum(case when correct = 1 then 1 else 0 end) as correct
      FROM attempts
      WHERE user_id = ? AND created_at > datetime('now', '-14 days')
      GROUP BY date(created_at)
      ORDER BY date(created_at) ASC
    `).all(userId) as unknown as { date: string; total: number; correct: number }[];

    const byDiscipline = sqlite.prepare(`
      SELECT q.discipline, count(*) as total, sum(case when a.correct = 1 then 1 else 0 end) as correct
      FROM attempts a
      INNER JOIN questions q ON a.question_id = q.id
      WHERE a.user_id = ?
      GROUP BY q.discipline
    `).all(userId) as unknown as { discipline: string; total: number; correct: number }[];

    return { total, correct, accuracy, daily, byDiscipline };
  },

  // User Topic Stats
  getUserTopicStat(userId: number, topicId: number): UserTopicStatRecord | undefined {
    return sqlite.prepare('SELECT * FROM user_topic_stats WHERE user_id = ? AND topic_id = ?').get(userId, topicId) as UserTopicStatRecord | undefined;
  },

  getUserTopicStatsList(userId: number): (UserTopicStatRecord & { topic_name: string; area: string })[] {
    return sqlite.prepare(`
      SELECT u.*, t.name as topic_name, t.area
      FROM user_topic_stats u
      INNER JOIN topics t ON u.topic_id = t.id
      WHERE u.user_id = ?
      ORDER BY u.mastery_score DESC
    `).all(userId) as unknown as (UserTopicStatRecord & { topic_name: string; area: string })[];
  },

  upsertUserTopicStat(data: {
    userId: number;
    topicId: number;
    questionsAnswered: number;
    correctAnswers: number;
    wrongAnswers: number;
    masteryScore: number;
    averageTime: number;
  }) {
    sqlite.prepare(`
      INSERT INTO user_topic_stats (
        user_id, topic_id, questions_answered, correct_answers, wrong_answers,
        mastery_score, average_time, last_attempt_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id, topic_id) DO UPDATE SET
        questions_answered = excluded.questions_answered,
        correct_answers = excluded.correct_answers,
        wrong_answers = excluded.wrong_answers,
        mastery_score = excluded.mastery_score,
        average_time = excluded.average_time,
        last_attempt_at = datetime('now')
    `).run(
      data.userId,
      data.topicId,
      data.questionsAnswered,
      data.correctAnswers,
      data.wrongAnswers,
      data.masteryScore,
      data.averageTime
    );
  },

  // Daily Questions
  getDailyQuestion(userId: number, date: string): DailyQuestionRecord | undefined {
    return sqlite.prepare('SELECT * FROM daily_questions WHERE user_id = ? AND date = ?').get(userId, date) as DailyQuestionRecord | undefined;
  },

  createDailyQuestion(userId: number, questionId: number, date: string): DailyQuestionRecord {
    const info = sqlite.prepare(`
      INSERT INTO daily_questions (user_id, question_id, date, completed)
      VALUES (?, ?, ?, 0)
    `).run(userId, questionId, date);
    return {
      id: Number(info.lastInsertRowid),
      user_id: userId,
      question_id: questionId,
      date,
      completed: 0,
    };
  },

  hasUserAnsweredQuestionToday(userId: number, questionId: number, date: string): boolean {
    const row = sqlite.prepare(`
      SELECT count(*) as count FROM attempts
      WHERE user_id = ? AND question_id = ? AND date(created_at) = ?
    `).get(userId, questionId, date) as { count: number };
    return row.count > 0;
  },

  markDailyQuestionCompleted(userId: number, questionId: number, date: string) {
    sqlite.prepare(`
      UPDATE daily_questions SET completed = 1
      WHERE user_id = ? AND question_id = ? AND date = ?
    `).run(userId, questionId, date);
  },

  getLastUserAttempt(userId: number, questionId: number): AttemptRecord | undefined {
    return sqlite.prepare(`
      SELECT * FROM attempts
      WHERE user_id = ? AND question_id = ?
      ORDER BY id DESC LIMIT 1
    `).get(userId, questionId) as AttemptRecord | undefined;
  },

  // Codex dos Erros
  updateAttemptReason(attemptId: number, userId: number, errorReason: string, userNotes?: string) {
    sqlite.prepare(`
      UPDATE attempts
      SET error_reason = ?, user_notes = COALESCE(?, user_notes)
      WHERE id = ? AND user_id = ?
    `).run(errorReason, userNotes || null, attemptId, userId);
  },

  getCodexErrors(userId: number, limit = 50): any[] {
    return sqlite.prepare(`
      SELECT a.id as attempt_id, a.selected_answer, a.time_spent, a.created_at, a.error_reason, a.user_notes,
             q.id as question_id, q.year, q.question_number, q.discipline, q.statement, q.correct_answer, q.explanation, q.difficulty,
             t.id as topic_id, t.name as topic_name, t.area
      FROM attempts a
      INNER JOIN questions q ON a.question_id = q.id
      LEFT JOIN topics t ON q.topic_id = t.id
      WHERE a.user_id = ? AND a.correct = 0
      ORDER BY a.id DESC
      LIMIT ?
    `).all(userId, limit);
  },

  getCodexStats(userId: number) {
    const totalErrorsRow = sqlite.prepare('SELECT count(*) as count FROM attempts WHERE user_id = ? AND correct = 0').get(userId) as { count: number };
    const totalErrors = totalErrorsRow.count;

    // Erros por motivo classificado
    const byReason = sqlite.prepare(`
      SELECT COALESCE(error_reason, 'Não Classificado') as reason, count(*) as count
      FROM attempts
      WHERE user_id = ? AND correct = 0
      GROUP BY COALESCE(error_reason, 'Não Classificado')
      ORDER BY count DESC
    `).all(userId) as { reason: string; count: number }[];

    // Erros por tópico (detecção de padrões e recorrência)
    const byTopic = sqlite.prepare(`
      SELECT t.id as topic_id, t.name as topic_name, t.area, count(*) as error_count
      FROM attempts a
      INNER JOIN questions q ON a.question_id = q.id
      INNER JOIN topics t ON q.topic_id = t.id
      WHERE a.user_id = ? AND a.correct = 0
      GROUP BY t.id
      ORDER BY error_count DESC
      LIMIT 6
    `).all(userId) as { topic_id: number; topic_name: string; area: string; error_count: number }[];

    // Padrões detectados: assuntos com 3 ou mais erros recentes
    const recurrentPatterns = byTopic.filter((t) => t.error_count >= 3);

    return {
      totalErrors,
      byReason,
      byTopic,
      recurrentPatterns,
    };
  },

  // Centro de Revisão & Repetição Espaçada
  getReviewsDue(userId: number): ReviewRecord[] {
    const today = new Date().toISOString().split('T')[0];
    return sqlite.prepare(`
      SELECT r.*, t.name as topic_name, t.area, COALESCE(uts.mastery_score, 0) as mastery_score
      FROM reviews r
      INNER JOIN topics t ON r.topic_id = t.id
      LEFT JOIN user_topic_stats uts ON uts.user_id = r.user_id AND uts.topic_id = r.topic_id
      WHERE r.user_id = ? AND date(r.next_review_at) <= date(?)
      ORDER BY r.next_review_at ASC
    `).all(userId, today) as unknown as ReviewRecord[];
  },

  scheduleReview(userId: number, topicId: number, nextReviewDate: string, intervalDays = 1) {
    sqlite.prepare(`
      INSERT INTO reviews (user_id, topic_id, next_review_at, interval_days, review_count)
      VALUES (?, ?, ?, ?, 0)
      ON CONFLICT(user_id, topic_id) DO UPDATE SET
        next_review_at = excluded.next_review_at,
        interval_days = excluded.interval_days
    `).run(userId, topicId, nextReviewDate, intervalDays);
  },

  completeReview(userId: number, topicId: number) {
    const row = sqlite.prepare('SELECT * FROM reviews WHERE user_id = ? AND topic_id = ?').get(userId, topicId) as ReviewRecord | undefined;
    const currentInterval = row?.interval_days || 1;
    const currentCount = (row?.review_count || 0) + 1;

    // Progressão clássica de repetição espaçada: 1 dia -> 3 dias -> 7 dias -> 14 dias -> 30 dias
    let nextInterval = 3;
    if (currentInterval === 1) nextInterval = 3;
    else if (currentInterval <= 3) nextInterval = 7;
    else if (currentInterval <= 7) nextInterval = 14;
    else nextInterval = 30;

    const nextDate = new Date(Date.now() + nextInterval * 86400000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    sqlite.prepare(`
      INSERT INTO reviews (user_id, topic_id, last_reviewed_at, next_review_at, interval_days, review_count)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, topic_id) DO UPDATE SET
        last_reviewed_at = excluded.last_reviewed_at,
        next_review_at = excluded.next_review_at,
        interval_days = excluded.interval_days,
        review_count = excluded.review_count
    `).run(userId, topicId, today, nextDate, nextInterval, currentCount);

    return { nextDate, nextInterval };
  }
};
