import { db } from '../db/index';

const AREA_LABELS: Record<string, string> = {
  matematica: 'Matemática',
  'ciencias-natureza': 'Ciências da Natureza',
  'ciencias-humanas': 'Ciências Humanas',
  linguagens: 'Linguagens',
};

const AREA_ORDER = ['matematica', 'ciencias-natureza', 'ciencias-humanas', 'linguagens'];

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

/**
 * Monta a visão geral da Biblioteca: todos os tópicos da taxonomia,
 * agrupados por área, com resumo, domínio (mastery) do usuário e
 * quantas questões já estão cacheadas localmente para aquele tópico.
 */
export function getLibraryOverview(userId: number): LibraryAreaGroup[] {
  const topics = db.getAllTopics();
  const statsList = db.getUserTopicStatsList(userId);
  const statsByTopic = new Map(statsList.map((s) => [s.topic_id, s]));

  const groupsByArea = new Map<string, LibraryTopicSummary[]>();

  for (const topic of topics) {
    const content = db.getTopicContent(topic.id);
    const stat = statsByTopic.get(topic.id);
    const cachedQuestionsCount = db.countQuestionsByTopic(topic.id);

    const summaryItem: LibraryTopicSummary = {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      area: topic.area,
      summary: content?.summary ?? null,
      masteryScore: stat?.mastery_score ?? 0,
      questionsAnswered: stat?.questions_answered ?? 0,
      cachedQuestionsCount,
      hasContent: !!content,
    };

    if (!groupsByArea.has(topic.area)) {
      groupsByArea.set(topic.area, []);
    }
    groupsByArea.get(topic.area)!.push(summaryItem);
  }

  const orderedAreas = [
    ...AREA_ORDER.filter((a) => groupsByArea.has(a)),
    ...[...groupsByArea.keys()].filter((a) => !AREA_ORDER.includes(a)),
  ];

  return orderedAreas.map((area) => ({
    area,
    areaLabel: AREA_LABELS[area] || area,
    topics: groupsByArea.get(area)!.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
  }));
}

export function getLibraryTopicDetail(userId: number, topicId: number): LibraryTopicDetail | null {
  const topic = db.getTopicById(topicId);
  if (!topic) return null;

  const content = db.getTopicContent(topicId);
  const stat = db.getUserTopicStat(userId, topicId);
  const cachedQuestionsCount = db.countQuestionsByTopic(topicId);

  return {
    id: topic.id,
    slug: topic.slug,
    name: topic.name,
    area: topic.area,
    summary: content?.summary ?? null,
    masteryScore: stat?.mastery_score ?? 0,
    questionsAnswered: stat?.questions_answered ?? 0,
    cachedQuestionsCount,
    hasContent: !!content,
    keyPoints: content ? (JSON.parse(content.key_points) as string[]) : [],
    commonTraps: content ? (JSON.parse(content.common_traps) as string[]) : [],
    studyTip: content?.study_tip ?? null,
  };
}
