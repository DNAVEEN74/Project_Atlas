
export const DIFFICULTY_CONFIG = {
    EASY: { label: 'Easy', timePerQ: 40 },
    MEDIUM: { label: 'Medium', timePerQ: 30 },
    HARD: { label: 'Hard', timePerQ: 25 },
    MIXED: { label: 'Mixed', timePerQ: 30 }
} as const;

export type Difficulty = keyof typeof DIFFICULTY_CONFIG;
