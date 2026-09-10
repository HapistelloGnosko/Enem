import { db } from '../db/index';
import { classifyQuestion } from './enemService';

const ENEMHUB_API_BASE = 'https://api.enemhub.com.br/v1/enem';
const ENEMHUB_API_KEY = process.env.ENEMHUB_API_KEY || 'ehub_enem_XPV8VCBmyBs2JhhfY3cIMuafTiY0iwZZBpel8lRw2xs';

export interface EnemHubAlternative {
  id?: string;
  letter: string;
  text: string;
  isCorrect?: boolean;
}

export interface EnemHubQuestion {
  id: string;
  externalId?: string;
  year: number;
  difficulty: string;
  statement: string;
  correctAlternative: string;
  subject?: {
    name: string;
    area: string;
  };
  alternatives: EnemHubAlternative[];
}

function cleanHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function mapSubjectToDiscipline(subjectName?: string): string {
  if (!subjectName) return 'matematica';
  const s = subjectName.toLowerCase();

  if (s.includes('matemática') || s.includes('matematica')) return 'matematica';
  if (s.includes('física') || s.includes('fisica') || s.includes('química') || s.includes('quimica') || s.includes('biologia')) {
    return 'ciencias-natureza';
  }
  if (s.includes('história') || s.includes('historia') || s.includes('geografia') || s.includes('filosofia') || s.includes('sociologia')) {
    return 'ciencias-humanas';
  }
  return 'linguagens';
}

function mapDifficulty(diff?: string): string {
  if (!diff) return 'medium';
  const d = diff.toLowerCase();
  if (d.includes('fácil') || d.includes('facil')) return 'easy';
  if (d.includes('difícil') || d.includes('dificil')) return 'hard';
  return 'medium';
}

export function importEnemHubQuestion(item: EnemHubQuestion, questionNumberFallback: number): number {
  const cleanStatement = cleanHtml(item.statement);
  const discipline = mapSubjectToDiscipline(item.subject?.name);
  const difficulty = mapDifficulty(item.difficulty);

  const qNumber = parseInt(item.externalId || '') || questionNumberFallback;

  // Verifica se já existe questão correspondente
  const existing = db.findQuestionByYearAndIndex(item.year, qNumber);
  if (existing) {
    return existing.id;
  }

  // Classificação automática usando texto e o assunto fornecido pela API
  const classificationText = `${cleanStatement} ${item.subject?.name || ''} ${item.subject?.area || ''}`;
  const { topicId, confidence } = classifyQuestion(classificationText, discipline);

  // Extrai imagem se houver tag <img> no statement original
  let imageUrl: string | null = null;
  const imgMatch = item.statement.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) {
    imageUrl = imgMatch[1];
  }

  const qId = db.createQuestion({
    year: item.year,
    questionNumber: qNumber,
    discipline,
    statement: cleanStatement,
    correctAnswer: item.correctAlternative.toUpperCase(),
    imageUrl,
    source: 'api.enemhub.com.br',
    topicId,
    subtopic: item.subject?.area || null,
    difficulty,
    classificationConfidence: confidence || 'high',
    explanation: null,
  });

  for (const alt of item.alternatives) {
    const cleanAltText = cleanHtml(alt.text);
    db.createAlternative(qId, alt.letter.toUpperCase(), cleanAltText);
  }

  return qId;
}

export async function loadQuestionsFromEnemHub(
  year: number = 2023,
  limit: number = 20,
  page: number = 1
): Promise<number> {
  try {
    const url = `${ENEMHUB_API_BASE}/questions?year=${year}&limit=${limit}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        'X-API-Key': ENEMHUB_API_KEY,
      },
    });

    if (!res.ok) {
      console.warn(`[EnemHub API] Status: ${res.status}`);
      return 0;
    }

    const data = await res.json() as { data?: EnemHubQuestion[] };
    const list = data.data || [];

    let importedCount = 0;
    let fallbackIndex = (page - 1) * limit + 1;

    for (const item of list) {
      try {
        importEnemHubQuestion(item, fallbackIndex++);
        importedCount++;
      } catch (err) {
        // Ignora erros de questões isoladas
      }
    }

    return importedCount;
  } catch (err) {
    console.error('[EnemHub API Error]:', err);
    return 0;
  }
}
