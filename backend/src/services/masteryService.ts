/**
 * Sistema de Maestria (0 a 100)
 *
 * Não depende apenas de porcentagem bruta de acertos.
 * Inicialmente combina:
 * - Taxa de acerto (acertos / total)
 * - Fator de confiança pelo volume amostral (penaliza assuntos com poucas questões resolvidas)
 * - Bônus de consistência
 */

export function calculateMastery(
  correctAnswers: number,
  totalAnswers: number
): number {
  if (totalAnswers === 0) return 0;

  const rawAccuracy = (correctAnswers / totalAnswers) * 100;

  // Fator de confiança: atinge 1.0 a partir de 10 questões resolvidas
  const volumeFactor = Math.min(totalAnswers / 10, 1.0);

  // Score ponderado
  const calculated = Math.round(rawAccuracy * volumeFactor);

  return Math.min(100, Math.max(0, calculated));
}

export function getMasteryLabel(score: number): string {
  if (score >= 80) return 'Dominado';
  if (score >= 60) return 'Consistente';
  if (score >= 40) return 'Em Desenvolvimento';
  if (score >= 20) return 'Iniciando';
  return 'Fraco';
}

export function getMasteryBadgeClass(score: number): string {
  if (score >= 80) return 'text-success bg-success/10 border-success/20';
  if (score >= 60) return 'text-neon-blue bg-neon-blue/10 border-neon-blue/20';
  if (score >= 40) return 'text-warning bg-warning/10 border-warning/20';
  return 'text-error bg-error/10 border-error/20';
}
