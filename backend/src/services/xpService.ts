const XP_TABLE: Record<string, number> = {
  easy: 50,
  medium: 75,
  hard: 100,
  very_hard: 125,
};

// Formula matching the specification:
// Nível 1 → 0 XP
// Nível 2 → 500 XP
// Nível 3 → 1.100 XP
// Nível 4 → 1.800 XP
// XP total cumulativo necessário para alcançar o nível N:
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * level * level + 350 * level - 400;
}

export function levelFromXp(xp: number): number {
  if (xp <= 0) return 1;
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level++;
    if (level >= 100) break;
  }
  return level;
}

export function calculateXp(
  difficulty: string,
  streak: number,
  attemptNumber: number,
  correct: boolean
): number {
  if (!correct) return 0;

  let base = XP_TABLE[difficulty] ?? 75;

  // Anti-farm: repetidas tentativas da mesma questão geram XP reduzido ou zero
  if (attemptNumber === 2) {
    base = Math.floor(base * 0.5);
  } else if (attemptNumber >= 3) {
    return 0;
  }

  // Bônus por sequência (streak)
  let multiplier = 1.0;
  if (streak >= 10) multiplier = 1.3;
  else if (streak >= 5) multiplier = 1.2;
  else if (streak >= 3) multiplier = 1.1;

  return Math.floor(base * multiplier);
}

export function xpProgress(xp: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
} {
  const level = levelFromXp(xp);
  const currentLevelFloor = xpForLevel(level);
  const nextLevelFloor = xpForLevel(level + 1);
  const currentXp = xp - currentLevelFloor;
  const needed = nextLevelFloor - currentLevelFloor;
  const progress = Math.min(100, Math.max(0, Math.floor((currentXp / needed) * 100)));

  return { level, currentXp, nextLevelXp: needed, progress };
}
