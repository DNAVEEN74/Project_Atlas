import React from 'react';
import {
    SpeedIcon,
    FunctionsIcon,
    CalculateIcon,
    TrendingUpIcon,
    CodeIcon,
    ExtensionIcon,
    QuizIcon,
    PieChartIcon,
    BoltIcon,
    WidgetsIcon,
    TableIcon,
    MenuBookIcon,
    TodayIcon,
    AddIcon,
    RemoveIcon,
    AppsIcon,
    ShowChartIcon,
    BarChartIcon,
    ExploreIcon,
    PersonIcon,
    FlipIcon
} from '@/components/icons';

// Game configuration and question generators

// === DIFFICULTY SYSTEM ===
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
    label: string;
    description: string;
    timePerQuestion: number; // seconds
    scoreMultiplier: number;
    color: string;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
    easy: {
        label: 'Beginner',
        description: 'Warm-up with smaller numbers',
        timePerQuestion: 12,
        scoreMultiplier: 1,
        color: 'from-green-500 to-emerald-500'
    },
    medium: {
        label: 'Standard',
        description: 'SSC Tier-1 exam level',
        timePerQuestion: 8,
        scoreMultiplier: 1.5,
        color: 'from-amber-500 to-orange-500'
    },
    hard: {
        label: 'Expert',
        description: 'Speed-run for pros',
        timePerQuestion: 5,
        scoreMultiplier: 2,
        color: 'from-red-500 to-rose-500'
    },
};

export interface GameQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export interface GameConfig {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    category: 'quant' | 'reasoning';
    generateQuestion: (difficulty: Difficulty) => GameQuestion;
}

// Helper functions
const shuffle = <T,>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate wrong options close to correct answer
const generateWrongOptions = (correct: number, count: number = 3): number[] => {
    const wrongs: Set<number> = new Set();
    const variance = Math.max(5, Math.abs(correct) * 0.3);
    while (wrongs.size < count) {
        const wrong = Math.round(correct + (Math.random() - 0.5) * 2 * variance);
        if (wrong !== correct && wrong >= 0) wrongs.add(wrong);
    }
    return Array.from(wrongs);
};

// QUANT GAMES

const speedTablesGame: GameConfig = {
    id: 'speed-tables',
    name: 'Speed Tables',
    description: 'Master tables with rapid-fire questions.',
    icon: <TableIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-amber-500 to-orange-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        // Scale ranges based on difficulty
        const ranges = {
            easy: { aMin: 2, aMax: 12, bMin: 2, bMax: 10 },
            medium: { aMin: 5, aMax: 20, bMin: 3, bMax: 12 },
            hard: { aMin: 12, aMax: 30, bMin: 6, bMax: 15 }
        };
        const r = ranges[difficulty];
        const a = randomInt(r.aMin, r.aMax);
        const b = randomInt(r.bMin, r.bMax);
        const correct = a * b;
        const wrongs = generateWrongOptions(correct);
        const options = shuffle([correct, ...wrongs].map(String));
        return {
            question: `${a} × ${b} = ?`,
            options,
            correctIndex: options.indexOf(String(correct))
        };
    }
};

const squareRootsGame: GameConfig = {
    id: 'square-roots',
    name: 'Square Roots',
    description: 'Instantly recognize perfect squares up to 25². Essential.',
    icon: <FunctionsIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-emerald-500 to-teal-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const ranges = { easy: { min: 1, max: 15 }, medium: { min: 5, max: 25 }, hard: { min: 15, max: 35 } };
        const r = ranges[difficulty];
        const root = randomInt(r.min, r.max);
        const square = root * root;
        const wrongs = generateWrongOptions(root);
        const options = shuffle([root, ...wrongs].map(String));
        return {
            question: `√${square} = ?`,
            options,
            correctIndex: options.indexOf(String(root))
        };
    }
};

const cubeRootsGame: GameConfig = {
    id: 'cube-roots',
    name: 'Cube Roots',
    description: 'Memorize cubes up to 12³. Key for series.',
    icon: <WidgetsIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-violet-500 to-purple-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const ranges = { easy: { min: 1, max: 8 }, medium: { min: 3, max: 12 }, hard: { min: 8, max: 20 } };
        const r = ranges[difficulty];
        const root = randomInt(r.min, r.max);
        const cube = root * root * root;
        const wrongs = generateWrongOptions(root);
        const options = shuffle([root, ...wrongs].map(String));
        return {
            question: `∛${cube} = ?`,
            options,
            correctIndex: options.indexOf(String(root))
        };
    }
};

const percentageFlashGame: GameConfig = {
    id: 'percentage-flash',
    name: 'Percentage Flash',
    description: 'Build reflexes for fraction-to-percentage conversion.',
    icon: <PieChartIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-rose-500 to-pink-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const percentOpts = { easy: [10, 20, 25, 50], medium: [5, 10, 15, 20, 25, 50, 75], hard: [12.5, 16.66, 33.33, 37.5, 62.5, 87.5] };
        const baseOpts = { easy: [100, 200, 500], medium: [80, 120, 150, 200, 500], hard: [64, 96, 144, 250, 360] };
        const percent = percentOpts[difficulty][randomInt(0, percentOpts[difficulty].length - 1)];
        const base = baseOpts[difficulty][randomInt(0, baseOpts[difficulty].length - 1)];
        const correct = Math.round((percent / 100) * base * 100) / 100;
        const wrongs = generateWrongOptions(correct);
        const options = shuffle([correct, ...wrongs].map(String));
        return {
            question: `${percent}% of ${base} = ?`,
            options,
            correctIndex: options.indexOf(String(correct))
        };
    }
};

const simplificationBlitzGame: GameConfig = {
    id: 'simplification-blitz',
    name: 'Simplification Blitz',
    description: 'Solve BODMAS problems under time pressure.',
    icon: <BoltIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-blue-500 to-cyan-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const type = randomInt(0, 3);
        let question: string;
        let correct: number;
        const scale = { easy: 1, medium: 1.5, hard: 2 }[difficulty];
        const base = { easy: 10, medium: 20, hard: 50 }[difficulty];

        if (type === 0) {
            const a = randomInt(base, base * 4); const b = randomInt(base, base * 3); const c = randomInt(base, base * 2);
            correct = a + b - c; question = `${a} + ${b} - ${c} = ?`;
        } else if (type === 1) {
            const a = randomInt(2 * scale, 12 * scale); const b = randomInt(2, 12); const c = randomInt(10, 50 * scale);
            correct = Math.round(a * b + c); question = `${Math.round(a)} × ${b} + ${c} = ?`;
        } else if (type === 2) {
            const b = randomInt(2, 10 * scale); const correct_val = randomInt(5, 20 * scale); const a = b * correct_val;
            correct = correct_val; question = `${a} ÷ ${b} = ?`;
        } else {
            const a = randomInt(2 * scale, 15 * scale); const b = randomInt(2, 10); const c = randomInt(2, 5 * scale);
            correct = Math.round((a + b) * c); question = `(${Math.round(a)} + ${b}) × ${Math.round(c)} = ?`;
        }
        const wrongs = generateWrongOptions(correct);
        const options = shuffle([correct, ...wrongs].map(String));
        return { question, options, correctIndex: options.indexOf(String(correct)) };
    }
};

// REASONING GAMES

const seriesSprintGame: GameConfig = {
    id: 'series-sprint',
    name: 'Series Sprint',
    description: 'Identify arithmetic & geometric patterns instantly.',
    icon: <TrendingUpIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-indigo-500 to-blue-500',
    category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const type = randomInt(0, 3);
        let series: number[];
        let correct: number;
        const scale = { easy: 1, medium: 2, hard: 3 }[difficulty];

        if (type === 0) {
            const start = randomInt(1, 10 * scale); const diff = randomInt(2, 4 * scale);
            series = [start, start + diff, start + 2 * diff, start + 3 * diff];
            correct = start + 4 * diff;
        } else if (type === 1) {
            const start = randomInt(2, 3 * scale); const mult = difficulty === 'hard' ? 3 : 2;
            series = [start, start * mult, start * mult * mult, start * mult * mult * mult];
            correct = start * mult * mult * mult * mult;
        } else if (type === 2) {
            const start = randomInt(1, 3 * scale);
            series = [(start) ** 2, (start + 1) ** 2, (start + 2) ** 2, (start + 3) ** 2];
            correct = (start + 4) ** 2;
        } else {
            const a = randomInt(1, 3 * scale); const b = randomInt(1, 3 * scale);
            series = [a, b, a + b, b + (a + b)];
            correct = (a + b) + (b + (a + b));
        }
        const wrongs = generateWrongOptions(correct);
        const options = shuffle([correct, ...wrongs].map(String));
        return { question: `${series.join(', ')}, ?`, options, correctIndex: options.indexOf(String(correct)) };
    }
};

const codingRushGame: GameConfig = {
    id: 'coding-rush',
    name: 'Coding Rush',
    description: 'Decode letter shifting logic rapidly.',
    icon: <CodeIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-fuchsia-500 to-pink-500',
    category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const words = { easy: ['CAT', 'DOG', 'BAT'], medium: ['APPLE', 'MANGO', 'TIGER', 'HOUSE'], hard: ['ELEPHANT', 'COMPUTER', 'SOLUTION'] };
        const word = words[difficulty][randomInt(0, words[difficulty].length - 1)];
        const shift = { easy: randomInt(1, 2), medium: randomInt(1, 3), hard: randomInt(2, 5) }[difficulty];
        const encode = (w: string, s: number) => w.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + s) % 26) + 65)).join('');
        const correct = encode(word, shift);
        const wrongs = [encode(word, shift + 1), encode(word, shift - 1 < 0 ? 25 : shift - 1), encode(word, shift + 2)].filter(w => w !== correct);
        const options = shuffle([correct, ...wrongs.slice(0, 3)]);
        return { question: `If A→${String.fromCharCode(65 + shift)}, then ${word} = ?`, options, correctIndex: options.indexOf(correct) };
    }
};

const analogyExpressGame: GameConfig = {
    id: 'analogy-express',
    name: 'Analogy Express',
    description: 'Find relationships between word pairs.',
    icon: <ExtensionIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-orange-500 to-red-500',
    category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const allPairs = [
            { pair: ['Bird', 'Nest'], relation: ['Bee', 'Hive'], wrongs: ['Honey', 'Flower', 'Wing'] },
            { pair: ['Book', 'Read'], relation: ['Food', 'Eat'], wrongs: ['Cook', 'Drink', 'Sleep'] },
            { pair: ['Eye', 'See'], relation: ['Ear', 'Hear'], wrongs: ['Nose', 'Touch', 'Speak'] },
            { pair: ['Doctor', 'Hospital'], relation: ['Teacher', 'School'], wrongs: ['Student', 'Book', 'College'] },
            { pair: ['Fish', 'Water'], relation: ['Bird', 'Sky'], wrongs: ['Nest', 'Tree', 'Feather'] },
            { pair: ['Pen', 'Write'], relation: ['Knife', 'Cut'], wrongs: ['Sharp', 'Metal', 'Slice'] },
            { pair: ['Author', 'Book'], relation: ['Composer', 'Symphony'], wrongs: ['Music', 'Piano', 'Conductor'] },
            { pair: ['Electricity', 'Wire'], relation: ['Water', 'Pipe'], wrongs: ['Tank', 'Flow', 'Liquid'] },
        ];
        const pairPool = { easy: allPairs.slice(0, 3), medium: allPairs.slice(0, 6), hard: allPairs }[difficulty];
        const selected = pairPool[randomInt(0, pairPool.length - 1)];
        const options = shuffle([selected.relation[1], ...selected.wrongs]);
        return { question: `${selected.pair[0]} : ${selected.pair[1]} :: ${selected.relation[0]} : ?`, options, correctIndex: options.indexOf(selected.relation[1]) };
    }
};

const oddOneOutGame: GameConfig = {
    id: 'odd-one-out',
    name: 'Odd One Out',
    description: 'Spot the anomaly in a group instantly.',
    icon: <QuizIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-green-500 to-emerald-500',
    category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const allGroups = [
            { items: ['Apple', 'Mango', 'Banana', 'Carrot'], odd: 'Carrot' },
            { items: ['2', '4', '6', '9'], odd: '9' },
            { items: ['Dog', 'Cat', 'Crow', 'Lion'], odd: 'Crow' },
            { items: ['Red', 'Blue', 'Circle', 'Green'], odd: 'Circle' },
            { items: ['January', 'March', 'Monday', 'July'], odd: 'Monday' },
            { items: ['Guitar', 'Piano', 'Painting', 'Drums'], odd: 'Painting' },
            { items: ['36', '49', '64', '72'], odd: '72' },
            { items: ['Run', 'Walk', 'Chair', 'Jump'], odd: 'Chair' },
            { items: ['121', '144', '169', '__(196)__'], odd: '__(196)__' }, // hard: trap option
        ];
        const pool = { easy: allGroups.slice(0, 4), medium: allGroups.slice(0, 8), hard: allGroups }[difficulty];
        const selected = pool[randomInt(0, pool.length - 1)];
        const options = shuffle([...selected.items]);
        return { question: `Find the odd one out`, options, correctIndex: options.indexOf(selected.odd) };
    }
};

// ... existing games ...

const alphabetRecallGame: GameConfig = {
    id: 'alphabet-recall',
    name: 'Alphabet Recall',
    description: 'Master letter positions for Coding-Decoding.',
    icon: <CodeIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-pink-500 to-rose-500',
    category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const typeOpts = { easy: [false], medium: [false, true], hard: [true] }; // Reverse at hard
        const isReverse = typeOpts[difficulty][randomInt(0, typeOpts[difficulty].length - 1)];
        const letterCode = randomInt(65, 90); // A-Z
        const letter = String.fromCharCode(letterCode);
        const correct = isReverse ? (91 - letterCode) : (letterCode - 64);
        const wrongs = new Set<number>(); while (wrongs.size < 3) { const w = randomInt(1, 26); if (w !== correct) wrongs.add(w); }
        const options = shuffle([correct, ...Array.from(wrongs)].map(String));
        return { question: isReverse ? `Reverse Rank of '${letter}'?` : `Rank of '${letter}'?`, options, correctIndex: options.indexOf(String(correct)) };
    }
};

const divisibilityDashGame: GameConfig = {
    id: 'divisibility-dash',
    name: 'Divisibility Dash',
    description: 'Rapidly check divisibility rules (3, 4, 8, 9, 11).',
    icon: <CalculateIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-cyan-500 to-blue-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const divPool = { easy: [2, 3, 5], medium: [3, 4, 8, 9], hard: [7, 8, 9, 11] };
        const rangePool = { easy: { min: 10, max: 999 }, medium: { min: 100, max: 9999 }, hard: { min: 1000, max: 99999 } };
        const divisors = divPool[difficulty];
        const divisor = divisors[randomInt(0, divisors.length - 1)];
        const isDivisible = Math.random() > 0.5;
        let number = randomInt(rangePool[difficulty].min, rangePool[difficulty].max);
        const remainder = number % divisor;
        if (isDivisible) { number -= remainder; } else { if (remainder === 0) number += 1; }
        const options = shuffle(['Yes', 'No']);
        return { question: `Is ${number} divisible by ${divisor}?`, options, correctIndex: options.indexOf(isDivisible ? 'Yes' : 'No') };
    }
};

// ... existing games ...

const unitDigitGame: GameConfig = {
    id: 'unit-digit-hunter',
    name: 'Unit Digit Hunter',
    description: 'Find the last digit of the expression.',
    icon: <FunctionsIcon sx={{ fontSize: 'inherit' }} />, // Reusing FunctionsIcon or similar
    color: 'from-violet-500 to-fuchsia-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const termCount = { easy: 2, medium: 3, hard: 4 }[difficulty];
        const termRange = { easy: { min: 10, max: 50 }, medium: { min: 10, max: 99 }, hard: { min: 50, max: 999 } }[difficulty];
        const terms: number[] = []; for (let i = 0; i < termCount; i++) terms.push(randomInt(termRange.min, termRange.max));
        let question = `${terms[0]}`; let currentUnit = terms[0] % 10;
        for (let i = 1; i < terms.length; i++) {
            const op = Math.random() > 0.3 ? '×' : '+';
            question += ` ${op} ${terms[i]}`;
            currentUnit = op === '×' ? (currentUnit * (terms[i] % 10)) % 10 : (currentUnit + (terms[i] % 10)) % 10;
        }
        const wrongs = new Set<number>(); while (wrongs.size < 3) { const w = randomInt(0, 9); if (w !== currentUnit) wrongs.add(w); }
        const options = shuffle([currentUnit, ...Array.from(wrongs)].map(String));
        return { question: `${question} = ...?`, options, correctIndex: options.indexOf(String(currentUnit)) };
    }
};

const dictionaryOrderGame: GameConfig = {
    id: 'dictionary-order',
    name: 'Dictionary Order',
    description: 'Which word comes FIRST in the dictionary?',
    icon: <MenuBookIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-teal-500 to-green-500',
    category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const allPools = [
            ['Apple', 'Apply', 'Apart', 'April'],
            ['Brake', 'Break', 'Bread', 'Brick'],
            ['Cast', 'Cart', 'Case', 'Cave'],
            ['Dear', 'Deer', 'Deep', 'Deal'],
            ['Eager', 'Eagle', 'Early', 'Earth'],
            ['Fair', 'Face', 'Fall', 'Fail'],
            ['Game', 'Gate', 'Gaze', 'Gear'],
            ['Hair', 'Half', 'Hall', 'Hand'],
            ['Imagination', 'Immaculate', 'Immediate', 'Immigration'],
            ['Jurisprudence', 'Jurisdiction', 'Justification', 'Juvenile']
        ];
        const poolRange = { easy: allPools.slice(0, 4), medium: allPools.slice(0, 8), hard: allPools }[difficulty];
        const words = shuffle(poolRange[randomInt(0, poolRange.length - 1)]);
        const correct = [...words].sort()[0];
        return { question: `First in Dictionary: ${words.join(', ')}`, options: words, correctIndex: words.indexOf(correct) };
    }
};

const calendarCrunchGame: GameConfig = {
    id: 'calendar-crunch',
    name: 'Calendar Crunch',
    description: 'Calculate the day of the week.',
    icon: <TodayIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-orange-500 to-red-500',
    category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const startDayIndex = randomInt(0, 6);
        const offsetRange = { easy: { min: 7, max: 30 }, medium: { min: 20, max: 100 }, hard: { min: 50, max: 365 } }[difficulty];
        const offset = randomInt(offsetRange.min, offsetRange.max);
        const correct = days[(startDayIndex + offset) % 7];
        const wrongs = new Set<string>(); while (wrongs.size < 3) { const w = days[randomInt(0, 6)]; if (w !== correct) wrongs.add(w); }
        const options = shuffle([correct, ...Array.from(wrongs)]);
        return { question: `If today is ${days[startDayIndex]}, what day is it after ${offset} days?`, options, correctIndex: options.indexOf(correct) };
    }
};

// ... existing games ...

const additionSprintGame: GameConfig = {
    id: 'addition-sprint',
    name: 'Addition Sprint',
    description: 'Rapidly add 2-3 digit numbers.',
    icon: <AddIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-blue-500 to-indigo-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const range = { easy: { min: 10, max: 99 }, medium: { min: 50, max: 500 }, hard: { min: 100, max: 999 } }[difficulty];
        const A = randomInt(range.min, range.max); const B = randomInt(range.min, range.max);
        const correct = A + B;
        const wrongs = new Set<number>(); while (wrongs.size < 3) { let w = correct + randomInt(-20, 20); if (w !== correct && w > 0) wrongs.add(w); }
        const options = shuffle([correct, ...Array.from(wrongs)].map(String));
        return { question: `${A} + ${B} = ?`, options, correctIndex: options.indexOf(String(correct)) };
    }
};

const subtractionSprintGame: GameConfig = {
    id: 'subtraction-sprint',
    name: 'Subtraction Sprint',
    description: 'Rapidly subtract 2-3 digit numbers.',
    icon: <RemoveIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-orange-500 to-amber-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const range = { easy: { min: 20, max: 99 }, medium: { min: 100, max: 500 }, hard: { min: 200, max: 999 } }[difficulty];
        const A = randomInt(range.min, range.max); const B = randomInt(Math.floor(range.min / 2), A - 10);
        const correct = A - B;
        const wrongs = new Set<number>(); while (wrongs.size < 3) { let w = correct + randomInt(-20, 20); if (w !== correct && w > 0) wrongs.add(w); }
        const options = shuffle([correct, ...Array.from(wrongs)].map(String));
        return { question: `${A} - ${B} = ?`, options, correctIndex: options.indexOf(String(correct)) };
    }
};

const squaresFlashGame: GameConfig = {
    id: 'squares-flash',
    name: 'Squares Flash',
    description: 'What is x²? (11-40)',
    icon: <AppsIcon sx={{ fontSize: 'inherit' }} />,
    color: 'from-purple-500 to-pink-500',
    category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const range = { easy: { min: 11, max: 20 }, medium: { min: 15, max: 35 }, hard: { min: 25, max: 50 } }[difficulty];
        const N = randomInt(range.min, range.max); const correct = N * N;
        const wrongs = new Set<number>(); while (wrongs.size < 3) { const off = randomInt(1, 4); const wN = N + (randomInt(0, 1) ? off : -off); const w = wN * wN; if (w !== correct && w > 0) wrongs.add(w); else wrongs.add(correct + 10); }
        const options = shuffle([correct, ...Array.from(wrongs)].map(String));
        return { question: `${N}² = ?`, options, correctIndex: options.indexOf(String(correct)) };
    }
};

// --- CHUNK 2: CONVERSION GAMES ---

const FRACTION_MAP = [
    { f: '1/2', d: '0.5', p: '50%' },
    { f: '1/3', d: '0.33', p: '33.33%' },
    { f: '2/3', d: '0.66', p: '66.66%' },
    { f: '1/4', d: '0.25', p: '25%' },
    { f: '3/4', d: '0.75', p: '75%' },
    { f: '1/5', d: '0.2', p: '20%' },
    { f: '1/8', d: '0.125', p: '12.5%' },
    { f: '3/8', d: '0.375', p: '37.5%' },
    { f: '5/8', d: '0.625', p: '62.5%' },
    { f: '7/8', d: '0.875', p: '87.5%' },
];

const fractionToDecimalGame: GameConfig = {
    id: 'fraction-decimal', name: 'Fraction to Decimal', description: 'Convert Fraction to Decimal.',
    icon: <PieChartIcon sx={{ fontSize: 'inherit' }} />, color: 'from-green-500 to-emerald-500', category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const pool = { easy: FRACTION_MAP.slice(0, 5), medium: FRACTION_MAP.slice(0, 8), hard: FRACTION_MAP }[difficulty];
        const item = pool[randomInt(0, pool.length - 1)];
        const wrongs = new Set<string>(); while (wrongs.size < 3) { const w = pool[randomInt(0, pool.length - 1)].d; if (w !== item.d) wrongs.add(w); }
        const options = shuffle([item.d, ...Array.from(wrongs)]);
        return { question: `${item.f} = ?`, options, correctIndex: options.indexOf(item.d) };
    }
};

const decimalToFractionGame: GameConfig = {
    id: 'decimal-fraction', name: 'Decimal to Fraction', description: 'Convert Decimal to Fraction.',
    icon: <PieChartIcon sx={{ fontSize: 'inherit' }} />, color: 'from-emerald-500 to-teal-500', category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const pool = { easy: FRACTION_MAP.slice(0, 5), medium: FRACTION_MAP.slice(0, 8), hard: FRACTION_MAP }[difficulty];
        const item = pool[randomInt(0, pool.length - 1)];
        const wrongs = new Set<string>(); while (wrongs.size < 3) { const w = pool[randomInt(0, pool.length - 1)].f; if (w !== item.f) wrongs.add(w); }
        const options = shuffle([item.f, ...Array.from(wrongs)]);
        return { question: `${item.d} = ?`, options, correctIndex: options.indexOf(item.f) };
    }
};

const ratioSimplificationGame: GameConfig = {
    id: 'ratio-simplification', name: 'Ratio Simplification', description: 'Simplify the ratio.',
    icon: <ShowChartIcon sx={{ fontSize: 'inherit' }} />, color: 'from-cyan-500 to-sky-500', category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const multRange = { easy: { min: 2, max: 5 }, medium: { min: 2, max: 12 }, hard: { min: 5, max: 20 } }[difficulty];
        const m = randomInt(multRange.min, multRange.max), a = randomInt(1, 10), b = randomInt(1, 10);
        const A = a * m, B = b * m;
        const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
        const g = gcd(A, B), rA = A / g, rB = B / g;
        const correct = `${rA}:${rB}`;
        const wrongs = new Set<string>(); while (wrongs.size < 3) { const w = `${rA + randomInt(-2, 2) || 1}:${rB + randomInt(-2, 2) || 1}`; if (w !== correct) wrongs.add(w); }
        const options = shuffle([correct, ...Array.from(wrongs)]);
        return { question: `${A} : ${B} = ?`, options, correctIndex: options.indexOf(correct) };
    }
};

const averageQuickSolveGame: GameConfig = {
    id: 'average-quick', name: 'Average Quick Solve', description: 'Find the average.',
    icon: <BarChartIcon sx={{ fontSize: 'inherit' }} />, color: 'from-sky-500 to-blue-500', category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const avgRange = { easy: { min: 10, max: 30 }, medium: { min: 20, max: 60 }, hard: { min: 30, max: 100 } }[difficulty];
        const count = { easy: 3, medium: 4, hard: 5 }[difficulty];
        const avg = randomInt(avgRange.min, avgRange.max);
        const nums: number[] = []; for (let i = 0; i < count - 1; i++) nums.push(avg + randomInt(-15, 15));
        nums.push(avg * count - nums.reduce((s, n) => s + n, 0));
        const shuffledNums = shuffle(nums);
        const wrongs = new Set<number>(); while (wrongs.size < 3) { const w = avg + randomInt(-5, 5); if (w !== avg) wrongs.add(w); }
        const options = shuffle([avg, ...Array.from(wrongs)].map(String));
        return { question: `Avg of ${shuffledNums.join(', ')}?`, options, correctIndex: options.indexOf(String(avg)) };
    }
};

const profitLossFlashGame: GameConfig = {
    id: 'profit-loss', name: 'Profit/Loss Flash', description: 'Calculate Profit/Loss %.',
    icon: <TrendingUpIcon sx={{ fontSize: 'inherit' }} />, color: 'from-blue-500 to-indigo-500', category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const cpRange = { easy: { min: 50, max: 200 }, medium: { min: 100, max: 500 }, hard: { min: 200, max: 1000 } }[difficulty];
        const percents = { easy: [10, 20, 25, 50], medium: [5, 10, 15, 20, 25, 50], hard: [5, 10, 15, 20, 25, 30, 40, 50] };
        const cp = randomInt(cpRange.min / 10, cpRange.max / 10) * 10;
        const profitP = percents[difficulty][randomInt(0, percents[difficulty].length - 1)], isP = Math.random() > 0.5;
        const sp = isP ? cp + (cp * profitP / 100) : cp - (cp * profitP / 100);
        const correct = isP ? `${profitP}% P` : `${profitP}% L`;
        const wrongs = new Set<string>(); while (wrongs.size < 3) { const w = `${Math.abs(profitP + randomInt(-5, 5) * 5)}% ${Math.random() > 0.5 ? 'P' : 'L'}`; if (w !== correct) wrongs.add(w); }
        const options = shuffle([correct, ...Array.from(wrongs)]);
        return { question: `CP=${cp}, SP=${sp}`, options, correctIndex: options.indexOf(correct) };
    }
};

const timeSpeedGame: GameConfig = {
    id: 'time-speed', name: 'Time & Speed', description: 'Convert km/h to m/s.',
    icon: <SpeedIcon sx={{ fontSize: 'inherit' }} />, color: 'from-indigo-500 to-violet-500', category: 'quant',
    generateQuestion: (difficulty: Difficulty) => {
        const facRange = { easy: { min: 1, max: 5 }, medium: { min: 1, max: 8 }, hard: { min: 2, max: 12 } }[difficulty];
        const f = randomInt(facRange.min, facRange.max), kmh = f * 18, ms = f * 5;
        const wrongs = new Set<number>(); while (wrongs.size < 3) { const w = ms + randomInt(-4, 4); if (w !== ms && w > 0) wrongs.add(w); }
        const options = shuffle([ms, ...Array.from(wrongs)].map(String));
        return { question: `${kmh} km/h = ? m/s`, options, correctIndex: options.indexOf(String(ms)) };
    }
};

// --- CHUNK 3: REASONING GAMES ---

const directionSenseGame: GameConfig = {
    id: 'direction-sense', name: 'Direction Sense', description: 'Track turns & find final direction.',
    icon: <ExploreIcon sx={{ fontSize: 'inherit' }} />, color: 'from-rose-500 to-pink-500', category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const dirs = ['North', 'East', 'South', 'West'];
        const turns = ['Left', 'Right', 'About-Turn'];
        const start = randomInt(0, 3); let current = start;
        const numTurns = { easy: 2, medium: randomInt(3, 4), hard: randomInt(4, 6) }[difficulty];
        const steps: string[] = [];
        for (let i = 0; i < numTurns; i++) {
            const turn = turns[randomInt(0, 2)];
            steps.push(turn);
            if (turn === 'Left') current = (current + 3) % 4;
            else if (turn === 'Right') current = (current + 1) % 4;
            else current = (current + 2) % 4;
        }
        const correct = dirs[current]; const wrongs = dirs.filter(d => d !== correct);
        const options = shuffle([correct, ...wrongs.slice(0, 3)]);
        return { question: `Start ${dirs[start]}, ${steps.join(', ')} → ?`, options, correctIndex: options.indexOf(correct) };
    }
};

const bloodRelationGame: GameConfig = {
    id: 'blood-relation', name: 'Blood Relation', description: 'Decode family relationships.',
    icon: <PersonIcon sx={{ fontSize: 'inherit' }} />, color: 'from-pink-500 to-fuchsia-500', category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const allRelations = [
            { q: "A's father's son", a: "Brother/A" },
            { q: "A's mother's daughter", a: "Sister/A" },
            { q: "A's brother's father", a: "Father" },
            { q: "A's father's father", a: "Grandfather" },
            { q: "A's mother's mother", a: "Grandmother" },
            { q: "A's son's sister", a: "Daughter" },
            { q: "A's daughter's brother", a: "Son" },
            { q: "A's uncle's son", a: "Cousin" },
            { q: "A's father's brother's wife", a: "Aunt" },
            { q: "A's mother's sister's husband", a: "Uncle" },
        ];
        const pool = { easy: allRelations.slice(0, 4), medium: allRelations.slice(0, 8), hard: allRelations }[difficulty];
        const item = pool[randomInt(0, pool.length - 1)];
        const allAnswers = ['Brother/A', 'Sister/A', 'Father', 'Mother', 'Grandfather', 'Grandmother', 'Son', 'Daughter', 'Uncle', 'Aunt', 'Cousin'];
        const wrongs = allAnswers.filter(a => a !== item.a).slice(0, 3);
        const options = shuffle([item.a, ...wrongs]);
        return { question: `${item.q} is A's?`, options, correctIndex: options.indexOf(item.a) };
    }
};

const mirrorImageGame: GameConfig = {
    id: 'mirror-image', name: 'Mirror Image', description: 'Identify the correct mirror image.',
    icon: <FlipIcon sx={{ fontSize: 'inherit' }} />, color: 'from-fuchsia-500 to-purple-500', category: 'reasoning',
    generateQuestion: (difficulty: Difficulty) => {
        const allPatterns = ['ABC', 'XYZ', '123', 'QUIZ', 'TEST', 'WORD', '2024', 'EXAM', 'MIRROR', 'REVERSE'];
        const pool = { easy: allPatterns.slice(0, 4), medium: allPatterns.slice(0, 8), hard: allPatterns }[difficulty];
        const original = pool[randomInt(0, pool.length - 1)];
        const mirrored = original.split('').reverse().join('');
        const wrongs = new Set<string>(); while (wrongs.size < 3) { const shuffled = shuffle(original.split('')).join(''); if (shuffled !== mirrored && shuffled !== original) wrongs.add(shuffled); }
        const options = shuffle([mirrored, ...Array.from(wrongs)]);
        return { question: `Mirror of "${original}"?`, options, correctIndex: options.indexOf(mirrored) };
    }
};

// Export all games
export const GAMES: GameConfig[] = [
    speedTablesGame, squareRootsGame, squaresFlashGame, cubeRootsGame,
    percentageFlashGame, simplificationBlitzGame, additionSprintGame, subtractionSprintGame,
    divisibilityDashGame, unitDigitGame, fractionToDecimalGame, decimalToFractionGame,
    ratioSimplificationGame, averageQuickSolveGame, profitLossFlashGame, timeSpeedGame,
    seriesSprintGame, codingRushGame, alphabetRecallGame, analogyExpressGame,
    oddOneOutGame, dictionaryOrderGame, calendarCrunchGame,
    directionSenseGame, bloodRelationGame, mirrorImageGame,
];

export const QUANT_GAMES = GAMES.filter(g => g.category === 'quant');
export const REASONING_GAMES = GAMES.filter(g => g.category === 'reasoning');
