export interface TitleSeed {
  slug: string;
  name: string;
  description: string;
  category: string;
  unlockConditionType: 'default' | 'questions_count' | 'streak' | 'accuracy' | 'mastery' | 'level' | 'area_mastery';
  unlockConditionValue: number;
}

export interface AchievementSeed {
  slug: string;
  name: string;
  description: string;
  category: string;
  xpReward: number;
  icon: string;
  targetValue: number;
}

export const INITIAL_TITLES: TitleSeed[] = [
  { slug: 'novato', name: 'Novato', description: 'Iniciou a jornada de preparação tática para o ENEM.', category: 'Geral', unlockConditionType: 'default', unlockConditionValue: 0 },
  { slug: 'aprendiz', name: 'Aprendiz', description: 'Resolveu suas primeiras 5 questões.', category: 'Progresso', unlockConditionType: 'questions_count', unlockConditionValue: 5 },
  { slug: 'estrategista', name: 'Estrategista', description: 'Manteve 5 dias consecutivos de foco e estudo.', category: 'Consistência', unlockConditionType: 'streak', unlockConditionValue: 5 },
  { slug: 'analista', name: 'Analista', description: 'Alcançou 70% de precisão geral em pelo menos 20 questões.', category: 'Precisão', unlockConditionType: 'accuracy', unlockConditionValue: 70 },
  { slug: 'pesquisador', name: 'Pesquisador', description: 'Resolveu 50 questões catalogadas.', category: 'Progresso', unlockConditionType: 'questions_count', unlockConditionValue: 50 },
  { slug: 'especialista', name: 'Especialista', description: 'Alcançou maestria de 80 pontos em qualquer assunto.', category: 'Domínio', unlockConditionType: 'mastery', unlockConditionValue: 80 },
  { slug: 'mestre-matematica', name: 'Mestre da Matemática', description: 'Alcançou maestria superior a 75 em tópicos de Matemática.', category: 'Área', unlockConditionType: 'area_mastery', unlockConditionValue: 75 },
  { slug: 'mestre-natureza', name: 'Mestre da Natureza', description: 'Alcançou maestria superior a 75 em tópicos de Ciências da Natureza.', category: 'Área', unlockConditionType: 'area_mastery', unlockConditionValue: 75 },
  { slug: 'mestre-humanas', name: 'Mestre das Humanas', description: 'Alcançou maestria superior a 75 em tópicos de Ciências Humanas.', category: 'Área', unlockConditionType: 'area_mastery', unlockConditionValue: 75 },
  { slug: 'mestre-linguagens', name: 'Mestre de Linguagens', description: 'Alcançou maestria superior a 75 em tópicos de Linguagens.', category: 'Área', unlockConditionType: 'area_mastery', unlockConditionValue: 75 },
  { slug: 'implacavel', name: 'Implacável', description: 'Alcançou uma sequência de 15 dias de estudo.', category: 'Consistência', unlockConditionType: 'streak', unlockConditionValue: 15 },
  { slug: 'grao-mestre', name: 'Grão-Mestre', description: 'Atingiu o Nível 20 no ENEM Quest.', category: 'Elite', unlockConditionType: 'level', unlockConditionValue: 20 },
];

export const INITIAL_ACHIEVEMENTS: AchievementSeed[] = [
  { slug: 'primeira-questao', name: 'PRIMEIRO PASSO', description: 'Resolva sua primeira questão no sistema.', category: 'QUESTÕES', xpReward: 100, icon: 'Zap', targetValue: 1 },
  { slug: '10-questoes', name: 'CADÊNCIA INICIAL', description: 'Resolva 10 questões no total.', category: 'QUESTÕES', xpReward: 150, icon: 'BookOpen', targetValue: 10 },
  { slug: '50-questoes', name: 'CONSTRUÇÃO DE HÁBITO', description: 'Resolva 50 questões no total.', category: 'QUESTÕES', xpReward: 300, icon: 'Layers', targetValue: 50 },
  { slug: '100-questoes', name: 'CENTENÁRIO', description: 'Resolva 100 questões no total.', category: 'QUESTÕES', xpReward: 500, icon: 'Award', targetValue: 100 },
  { slug: '500-questoes', name: 'VETERANO DE GUERRA', description: 'Resolva 500 questões no total.', category: 'QUESTÕES', xpReward: 1000, icon: 'Shield', targetValue: 500 },
  { slug: 'streak-3', name: 'INÍCIO DE DISCIPLINA', description: 'Mantenha 3 dias consecutivos de treino.', category: 'CONSISTÊNCIA', xpReward: 150, icon: 'Flame', targetValue: 3 },
  { slug: 'streak-7', name: 'DISCIPLINA DE FERRO', description: 'Estude por 7 dias consecutivos.', category: 'CONSISTÊNCIA', xpReward: 300, icon: 'Flame', targetValue: 7 },
  { slug: 'streak-14', name: 'RITMO INQUEBRÁVEL', description: 'Estude por 14 dias consecutivos.', category: 'CONSISTÊNCIA', xpReward: 600, icon: 'Flame', targetValue: 14 },
  { slug: 'streak-30', name: 'FOCO ABSOLUTO', description: 'Estude por 30 dias consecutivos.', category: 'CONSISTÊNCIA', xpReward: 1500, icon: 'Sparkles', targetValue: 30 },
  { slug: 'precisao-80', name: 'PRECISÃO TÁTICA', description: 'Alcance 80% de precisão geral (mínimo de 20 questões).', category: 'DESEMPENHO', xpReward: 250, icon: 'Target', targetValue: 80 },
  { slug: 'precisao-90', name: 'MESTRE DO DETALHE', description: 'Alcance 90% de precisão geral (mínimo de 30 questões).', category: 'DESEMPENHO', xpReward: 500, icon: 'Target', targetValue: 90 },
  { slug: 'maestria-80', name: 'DOMÍNIO INICIAL', description: 'Alcance 80 ou mais de maestria em qualquer assunto.', category: 'ÁREAS', xpReward: 300, icon: 'Trophy', targetValue: 80 },
  { slug: 'retorno-honrado', name: 'FÊNIX', description: 'Complete uma Missão de Retorno após dias ausente.', category: 'DESAFIOS', xpReward: 200, icon: 'RotateCcw', targetValue: 1 },
];
