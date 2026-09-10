import { db, TopicRecord } from '../db/index';

const API_BASE = 'https://api.enem.dev/v1';

export interface ApiAlternative {
  letter: string;
  text: string;
  file?: string | null;
  isCorrect: boolean;
}

export interface ApiQuestion {
  title: string;
  year: number;
  index: number;
  discipline: string;
  language?: string | null;
  context?: string | null;
  files?: string[];
  alternativesIntroduction?: string;
  alternatives: ApiAlternative[];
}

let cachedTopics: Array<{ id: number; area: string; slug: string; keywords: string[] }> | null = null;

function getTaxonomyTopics() {
  if (cachedTopics) return cachedTopics;
  const rows = db.getAllTopics();
  cachedTopics = rows.map((t) => ({
    id: t.id,
    area: t.area,
    slug: t.slug,
    keywords: JSON.parse(t.keywords || '[]') as string[],
  }));
  return cachedTopics;
}

/**
 * Classificação pedagógica automática usando palavras-chave e contexto
 */
export function classifyQuestion(
  fullText: string,
  discipline: string
): { topicId: number | null; confidence: 'low' | 'high' } {
  try {
    const allTopics = getTaxonomyTopics();
    const lower = fullText.toLowerCase();

    // Filtra tópicos da área correspondente
    const areaTopics = allTopics.filter((t) => t.area === discipline);
    const candidateTopics = areaTopics.length > 0 ? areaTopics : allTopics;

    let bestMatch: { topicId: number; hits: number } | null = null;

    for (const topic of candidateTopics) {
      let hits = 0;
      for (const kw of topic.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          hits++;
        }
      }

      if (hits > 0 && (!bestMatch || hits > bestMatch.hits)) {
        bestMatch = { topicId: topic.id, hits };
      }
    }

    if (!bestMatch) {
      return { topicId: null, confidence: 'low' };
    }

    return {
      topicId: bestMatch.topicId,
      confidence: bestMatch.hits >= 2 ? 'high' : 'low',
    };
  } catch {
    return { topicId: null, confidence: 'low' };
  }
}

/**
 * Salva questão da API no banco local e classifica
 */
export function importApiQuestion(data: ApiQuestion): number {
  const correctAlt = data.alternatives.find((a) => a.isCorrect);
  if (!correctAlt) {
    throw new Error('Questão sem alternativa correta identificada.');
  }

  // Verifica se já existe em cache
  const existing = db.findQuestionByYearAndIndex(data.year, data.index);
  if (existing) {
    return existing.id;
  }

  const combinedText = [
    data.context ?? '',
    data.alternativesIntroduction ?? '',
    ...data.alternatives.map((a) => a.text),
  ].join(' ');

  const { topicId, confidence } = classifyQuestion(combinedText, data.discipline);

  // Estimativa de dificuldade com base na extensão e complexidade
  const totalLength = combinedText.length;
  let difficulty = 'medium';
  if (totalLength < 350) difficulty = 'easy';
  else if (totalLength > 1200) difficulty = 'hard';

  const statementText = data.alternativesIntroduction || data.context || `ENEM ${data.year} - Questão ${data.index}`;

  const qId = db.createQuestion({
    year: data.year,
    questionNumber: data.index,
    discipline: data.discipline,
    language: data.language ?? null,
    context: data.context ?? null,
    statement: statementText,
    correctAnswer: correctAlt.letter.toUpperCase(),
    imageUrl: data.files?.[0] ?? null,
    source: 'api.enem.dev',
    topicId,
    difficulty,
    classificationConfidence: confidence,
  });

  for (const alt of data.alternatives) {
    db.createAlternative(qId, alt.letter.toUpperCase(), alt.text, alt.file ?? null);
  }

  return qId;
}

/**
 * Importa um lote de questões de uma disciplina/ano
 */
export async function loadQuestionsFromApi(
  year: number = 2023,
  discipline: string = 'matematica',
  limit: number = 15
): Promise<number> {
  try {
    let offset = 0;
    if (discipline === 'matematica') offset = 135;
    else if (discipline === 'ciencias-natureza') offset = 90;
    else if (discipline === 'ciencias-humanas') offset = 45;
    else if (discipline === 'linguagens') offset = 0;

    const url = `${API_BASE}/exams/${year}/questions?limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[enemService] Erro ao consultar API: ${res.status}`);
      return 0;
    }

    const data = await res.json() as any;
    const list: ApiQuestion[] = data.questions || (Array.isArray(data) ? data : []);

    let importedCount = 0;
    for (const item of list) {
      try {
        importApiQuestion(item);
        importedCount++;
      } catch (err) {
        // Ignora erros em questões individuais
      }
    }

    return importedCount;
  } catch (err) {
    console.warn('[enemService] Falha de conexão com a API do ENEM:', err);
    return 0;
  }
}
