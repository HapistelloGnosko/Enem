import { sqlite } from './index';

export function runMigrations() {
  console.log('Executando migrações no banco SQLite...');

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      streak INTEGER NOT NULL DEFAULT 0,
      last_study_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      area TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      keywords TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      discipline TEXT NOT NULL,
      language TEXT,
      context TEXT,
      statement TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      image_url TEXT,
      source TEXT NOT NULL DEFAULT 'api',
      topic_id INTEGER REFERENCES topics(id),
      subtopic TEXT,
      difficulty TEXT NOT NULL DEFAULT 'medium',
      classification_confidence TEXT DEFAULT 'low',
      explanation TEXT,
      cached_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS alternatives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL REFERENCES questions(id),
      letter TEXT NOT NULL,
      text TEXT NOT NULL,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      question_id INTEGER NOT NULL REFERENCES questions(id),
      selected_answer TEXT NOT NULL,
      correct INTEGER NOT NULL,
      time_spent INTEGER NOT NULL DEFAULT 0,
      xp_gained INTEGER NOT NULL DEFAULT 0,
      attempt_number INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_topic_stats (
      user_id INTEGER NOT NULL REFERENCES users(id),
      topic_id INTEGER NOT NULL REFERENCES topics(id),
      questions_answered INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      wrong_answers INTEGER NOT NULL DEFAULT 0,
      mastery_score REAL NOT NULL DEFAULT 0,
      average_time REAL NOT NULL DEFAULT 0,
      last_attempt_at TEXT,
      PRIMARY KEY (user_id, topic_id)
    );

    CREATE TABLE IF NOT EXISTS daily_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      question_id INTEGER NOT NULL REFERENCES questions(id),
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_questions_discipline ON questions(discipline);
    CREATE INDEX IF NOT EXISTS idx_questions_year ON questions(year);
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_question ON attempts(question_id);

    -- Novas tabelas RPG
    CREATE TABLE IF NOT EXISTS titles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Geral',
      unlock_condition_type TEXT NOT NULL,
      unlock_condition_value INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_titles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title_id INTEGER NOT NULL REFERENCES titles(id),
      unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
      equipped INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, title_id)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'QUESTÕES',
      xp_reward INTEGER NOT NULL DEFAULT 100,
      icon TEXT NOT NULL DEFAULT 'Trophy',
      target_value INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      achievement_id INTEGER NOT NULL REFERENCES achievements(id),
      unlocked_at TEXT,
      progress INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, achievement_id)
    );

    CREATE TABLE IF NOT EXISTS user_streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      study_streak INTEGER NOT NULL DEFAULT 0,
      accuracy_streak INTEGER NOT NULL DEFAULT 0,
      review_streak INTEGER NOT NULL DEFAULT 0,
      mission_streak INTEGER NOT NULL DEFAULT 0,
      last_study_date TEXT,
      return_mission_active INTEGER NOT NULL DEFAULT 0,
      return_mission_easy INTEGER NOT NULL DEFAULT 0,
      return_mission_medium INTEGER NOT NULL DEFAULT 0,
      return_mission_review INTEGER NOT NULL DEFAULT 0
    );

    -- Tabela de Repetição Espaçada / Centro de Revisão
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      topic_id INTEGER NOT NULL REFERENCES topics(id),
      last_reviewed_at TEXT,
      next_review_at TEXT NOT NULL,
      interval_days INTEGER NOT NULL DEFAULT 1,
      review_count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, topic_id)
    );

    -- Biblioteca de Conteúdos do ENEM (teoria por assunto)
    CREATE TABLE IF NOT EXISTS topic_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL UNIQUE REFERENCES topics(id),
      summary TEXT NOT NULL,
      key_points TEXT NOT NULL DEFAULT '[]',
      common_traps TEXT NOT NULL DEFAULT '[]',
      study_tip TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Adicionar colunas caso ainda não existam em users
  const userColumns = sqlite.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const existingCols = new Set(userColumns.map(c => c.name));

  if (!existingCols.has('title')) {
    sqlite.exec("ALTER TABLE users ADD COLUMN title TEXT DEFAULT 'Novato';");
  }
  if (!existingCols.has('avatar')) {
    sqlite.exec("ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT 'avatar-1';");
  }
  if (!existingCols.has('prestige')) {
    sqlite.exec("ALTER TABLE users ADD COLUMN prestige INTEGER NOT NULL DEFAULT 0;");
  }
  if (!existingCols.has('power_score')) {
    sqlite.exec("ALTER TABLE users ADD COLUMN power_score INTEGER NOT NULL DEFAULT 100;");
  }
  if (!existingCols.has('active_league')) {
    sqlite.exec("ALTER TABLE users ADD COLUMN active_league TEXT NOT NULL DEFAULT 'Bronze';");
  }

  // Adicionar colunas em attempts (Codex dos Erros)
  const attemptColumns = sqlite.prepare("PRAGMA table_info(attempts)").all() as { name: string }[];
  const existingAttemptCols = new Set(attemptColumns.map(c => c.name));

  if (!existingAttemptCols.has('error_reason')) {
    sqlite.exec("ALTER TABLE attempts ADD COLUMN error_reason TEXT;");
  }
  if (!existingAttemptCols.has('user_notes')) {
    sqlite.exec("ALTER TABLE attempts ADD COLUMN user_notes TEXT;");
  }

  console.log('Migrações concluídas com sucesso!');
}

runMigrations();

