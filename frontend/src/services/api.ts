// Em desenvolvimento (navegador), '/api' é redirecionado pelo proxy do Vite para o backend local.
// No app mobile empacotado (Capacitor) não existe esse proxy, então é obrigatório apontar
// para a URL pública do backend hospedado, definida em VITE_API_URL no momento do build.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('enem_quest_token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: `Erro na requisição (${res.status})` }));
    throw new Error(errorData.error || 'Erro inesperado.');
  }

  return res.json();
}

export const api = {
  // Autenticação
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  // Usuário
  me: () => request<User>('/user/me'),

  // Questões
  listQuestions: (params?: { discipline?: string; year?: number; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.discipline) qs.set('discipline', params.discipline);
    if (params?.year) qs.set('year', String(params.year));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return request<{ total: number; questions: Question[] }>(`/questions?${qs.toString()}`);
  },

  getQuestion: (id: number) => request<QuestionDetail>(`/questions/${id}`),

  getNextQuestion: (discipline?: string) => {
    const qs = discipline ? `?discipline=${discipline}` : '';
    return request<QuestionDetail>(`/questions/next${qs}`);
  },

  importQuestions: (params: { source?: 'enem_dev' | 'enemhub'; year: number; discipline?: string; limit?: number; page?: number }) =>
    request<{ message: string; importedCount: number }>('/questions/import', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // Tentativas / Submissão
  submitAttempt: (questionId: number, selectedAnswer: string, timeSpent: number) =>
    request<AttemptResult>('/attempts', {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedAnswer, timeSpent }),
    }),

  // Estatísticas
  stats: () => request<Stats>('/stats'),
  topicStats: () => request<TopicStat[]>('/stats/topics'),

  // Questão do Dia
  dailyQuestion: () => request<QuestionDetail & { completed: boolean; date: string }>('/daily'),

  // RPG & Gamificação
  updateAvatar: (avatar: string) =>
    request<{ success: boolean; avatar: string }>('/user/me/avatar', {
      method: 'PATCH',
      body: JSON.stringify({ avatar }),
    }),

  equipTitle: (titleId: number) =>
    request<{ success: boolean; equippedTitle: string }>('/user/me/equip-title', {
      method: 'POST',
      body: JSON.stringify({ titleId }),
    }),

  prestige: () =>
    request<{ success: boolean; newPrestige: number; message: string }>('/user/me/prestige', {
      method: 'POST',
    }),

  claimReturnMission: () =>
    request<{ success: boolean; message: string; xpGained: number }>('/user/me/claim-return-mission', {
      method: 'POST',
    }),

  getAchievements: () => request<Achievement[]>('/gamification/achievements'),
  getTitles: () => request<Title[]>('/gamification/titles'),
  getPowerScore: () => request<PowerScoreData>('/gamification/power-score'),

  // Codex dos Erros
  getCodex: (limit = 50) => request<{ errors: CodexError[]; stats: CodexStats }>(`/codex?limit=${limit}`),
  classifyError: (attemptId: number, errorReason: string, userNotes?: string) =>
    request<{ success: boolean; attemptId: number; errorReason: string; userNotes?: string }>(`/codex/${attemptId}/reason`, {
      method: 'PATCH',
      body: JSON.stringify({ errorReason, userNotes }),
    }),

  // Centro de Revisão
  getReviews: () => request<ReviewItem[]>('/reviews'),
  completeReview: (topicId: number) =>
    request<{ success: boolean; message: string; nextDate: string; nextInterval: number }>('/reviews/complete', {
      method: 'POST',
      body: JSON.stringify({ topicId }),
    }),

  // Coach IA & Prioridades
  getCoach: () => request<CoachData>('/coach'),
  getPriorities: () => request<TopicPriority[]>('/coach/priorities'),

  // Biblioteca de Conteúdos do ENEM
  getLibrary: () => request<{ areas: LibraryAreaGroup[] }>('/library'),
  getLibraryTopic: (topicId: number) => request<LibraryTopicDetail>(`/library/${topicId}`),
};

// --- Tipagens ---

export interface ReturnMission {
  active: boolean;
  daysAway: number;
  easyProgress: number;
  mediumProgress: number;
  reviewProgress: number;
  completed: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  title?: string;
  avatar?: string;
  prestige?: number;
  powerScore?: number;
  activeLeague?: string;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
  lastStudyDate?: string | null;
  createdAt?: string;
  returnMission?: ReturnMission;
}

export interface Title {
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

export interface Achievement {
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

export interface PowerScoreData {
  score: number;
  league: string;
  breakdown: {
    accuracyPart: number;
    difficultyPart: number;
    masteryPart: number;
    consistencyPart: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Alternative {
  id: number;
  questionId: number;
  letter: string;
  text: string;
  imageUrl?: string | null;
}

export interface Question {
  id: number;
  year: number;
  questionNumber: number;
  discipline: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  topicId?: number | null;
  imageUrl?: string | null;
}

export interface QuestionDetail extends Question {
  context?: string | null;
  language?: string | null;
  correctAnswer: string;
  explanation?: string | null;
  alternatives: Alternative[];
  topic?: { id: number; name: string; area: string } | null;
  userAttemptCount?: number;
  lastAttempt?: {
    id: number;
    selected_answer: string;
    correct: number;
    time_spent: number;
    xp_gained: number;
    created_at: string;
  } | null;
}

export interface AttemptResult {
  attemptId?: number;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation?: string | null;
  xpGained: number;
  totalXp: number;
  leveledUp: boolean;
  newLevel: number;
  streak: number;
  oldMastery: number;
  newMastery: number;
  masteryDelta: number;
  progress: {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    progress: number;
  };
  unlockedRewards?: Array<{
    type: 'title' | 'achievement';
    name: string;
    description: string;
    xpReward?: number;
  }>;
}

export interface Stats {
  total: number;
  correct: number;
  accuracy: number;
  daily: Array<{ date: string; total: number; correct: number }>;
  byDiscipline: Array<{ discipline: string; total: number; correct: number }>;
}

export interface TopicStat {
  topicId: number;
  topicName: string;
  area: string;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  masteryScore: number;
  averageTime: number;
  lastAttemptAt?: string | null;
}

export interface CodexError {
  attempt_id: number;
  selected_answer: string;
  time_spent: number;
  created_at: string;
  error_reason?: string | null;
  user_notes?: string | null;
  question_id: number;
  year: number;
  question_number: number;
  discipline: string;
  statement: string;
  correct_answer: string;
  explanation?: string | null;
  difficulty: string;
  topic_id?: number | null;
  topic_name?: string | null;
  area?: string | null;
}

export interface CodexStats {
  totalErrors: number;
  byReason: Array<{ reason: string; count: number }>;
  byTopic: Array<{ topic_id: number; topic_name: string; area: string; error_count: number }>;
  recurrentPatterns: Array<{ topic_id: number; topic_name: string; area: string; error_count: number }>;
}

export interface ReviewItem {
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

export interface CoachData {
  coreAnswers: Array<{
    question: string;
    category: string;
    answer: string;
    recommendation: string;
    actionUrl?: string;
  }>;
  dailyPlan: {
    title: string;
    totalMinutes: number;
    primaryFocus: string;
    blocks: Array<{
      title: string;
      durationMinutes: number;
      description: string;
      action: string;
      url: string;
    }>;
  };
  summaryMetrics: {
    worstArea: string;
    worstTopic: string;
    bestTopic: string;
    dominantErrorReason: string;
    speedDiagnosis: string;
    evolutionStatus: string;
  };
}

export interface TopicPriority {
  topicId: number;
  topicName: string;
  area: string;
  masteryScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  priorityScore: number;
  priorityLevel: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO' | 'DOMINADO';
  recommendationReason: string;
}

export interface LibraryTopicSummary {
  id: number;
  slug: string;
  name: string;
  area: string;
  summary: string | null;
  masteryScore: number;
  questionsAnswered: number;
  cachedQuestionsCount: number;
  hasContent: boolean;
}

export interface LibraryAreaGroup {
  area: string;
  areaLabel: string;
  topics: LibraryTopicSummary[];
}

export interface LibraryTopicDetail extends LibraryTopicSummary {
  keyPoints: string[];
  commonTraps: string[];
  studyTip: string | null;
}
