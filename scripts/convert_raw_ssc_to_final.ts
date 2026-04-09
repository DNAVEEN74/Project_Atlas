import fs from 'fs';
import path from 'path';
import { normalizePatternCode } from '../src/lib/patternUtils';

type RawOption = {
    id?: string;
    text?: string;
};

type RawQuestion = {
    content?: {
        text?: string;
        options?: RawOption[];
        correct_option_id?: string;
    };
    source?: {
        section?: string;
        question_number?: number;
    };
};

type FinalQuestion = {
    text: string;
    image: string;
    options: Array<{ id: string; text: string; image: string }>;
    correct_option: 'A' | 'B' | 'C' | 'D';
    solution: string;
    subject: 'QUANT' | 'REASONING';
    pattern: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    source: {
        exam: string;
        year: number;
        shift: string;
    };
    stats: {
        attempt_count: number;
        accuracy_rate: number;
        avg_time_ms: number;
    };
    is_live: boolean;
    needs_review: boolean;
};

const letterMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
    opt_1: 'A',
    opt_2: 'B',
    opt_3: 'C',
    opt_4: 'D'
};

function parseArgs() {
    const args = process.argv.slice(2);
    const out: Record<string, string> = {};
    for (let i = 0; i < args.length; i += 2) {
        const k = args[i];
        const v = args[i + 1];
        if (k?.startsWith('--') && v) out[k.slice(2)] = v;
    }

    const required = ['input', 'quant-out', 'reasoning-out', 'shift'];
    for (const key of required) {
        if (!out[key]) {
            console.error(
                'Usage: npx tsx scripts/convert_raw_ssc_to_final.ts --input <raw.json> --quant-out <quant.json> --reasoning-out <reasoning.json> --shift "<shift>" [--exam "SSC CGL 2024"] [--year 2024]'
            );
            process.exit(1);
        }
    }
    return {
        input: out['input'],
        quantOut: out['quant-out'],
        reasoningOut: out['reasoning-out'],
        shift: out['shift'],
        exam: out['exam'] || 'SSC CGL 2024',
        year: Number(out['year'] || 2024)
    };
}

function cleanText(s: string): string {
    let t = String(s || '');
    const reps: Array<[string, string]> = [
        ['â€˜', "'"],
        ['â€™', "'"],
        ['â€œ', '"'],
        ['â€�', '"'],
        ['â€“', '-'],
        ['â€”', '-'],
        ['âˆ’', '-'],
        ['Ã—', 'x'],
        ['Ã·', '/'],
        ['â‚¹', 'Rs '],
        ['₹', 'Rs '],
        ['Â°', '°'],
        ['Ã', ''],
        ['Â', ''],
        ['\f', ' ']
    ];

    for (const [a, b] of reps) t = t.split(a).join(b);

    t = t.replace(/\[IMAGE REQUIRED - Upload question image\]/gi, '[IMAGE]');
    t = t.replace(/\[IMAGE OPTION - Upload option image\]/gi, '[IMAGE]');
    t = t.replace(/\[Missing - Verify in PDF\]/gi, '[IMAGE]');
    t = t.replace(/\s+/g, ' ').trim();
    return t;
}

function inferSubject(sectionRaw: string): 'QUANT' | 'REASONING' {
    const s = String(sectionRaw || '').toUpperCase();
    if (s.includes('REASONING') || s.includes('GENERAL INTELLIGENCE')) return 'REASONING';
    return 'QUANT';
}

function inferPattern(subject: 'QUANT' | 'REASONING', text: string, hasImage: boolean): string {
    const t = text.toLowerCase();

    if (hasImage && subject === 'REASONING') return 'classification';
    if (hasImage && subject === 'QUANT') return 'algebra';

    if (subject === 'REASONING') {
        if (t.includes('mother') || t.includes('father') || t.includes('brother') || t.includes('sister') || t.includes('wife')) return 'blood_relations';
        if (t.includes('mirror') || t.includes('water image')) return 'mirror_water_image';
        if (t.includes('dice') || t.includes('cube')) return 'dice_cube';
        if (t.includes('how many triangles') || t.includes('how many figures')) return 'counting_figures';
        if (t.includes('coded as') || t.includes('code language') || t.includes('coding')) return 'coding_decoding';
        if (t.includes('statement') && t.includes('conclusion')) return 'statement_conclusion';
        if (t.includes('syllogism')) return 'syllogism';
        if (t.includes('interchange') || t.includes('operation')) return 'mathematical_operation';
        if (t.includes('series') || t.includes('sequentially')) return 'series';
        if (t.includes('alphabet') || t.includes('word') || t.includes('dictionary')) return 'word_formation';
        if (t.includes('direction') || t.includes('north') || t.includes('south') || t.includes('east') || t.includes('west')) return 'direction_sense';
        if (t.includes('rank') || t.includes('order')) return 'order_ranking';
        if (t.includes('sitting') || t.includes('seating')) return 'sitting_arrangement';
        if (t.includes('venn')) return 'venn_diagram';
        if (t.includes('clock') || t.includes('calendar') || t.includes('day') || t.includes('date')) return 'clock_calendar';
        if (t.includes('paper cutting') || t.includes('paper folding')) return 'paper_cutting';
        if (t.includes('embedded')) return 'embedded_figures';
        if (t.includes('matrix')) return 'matrix';
        if (t.includes('analogy') || t.includes('related to')) return 'analogy';
        if (t.includes('odd one out') || t.includes('different') || t.includes('not belong')) return 'classification';
        if (/\d/.test(t) && t.includes('missing')) return 'missing_number';
        return 'classification';
    }

    if (t.includes('simple interest') || (t.includes('p.a.') && t.includes('interest'))) return 'simple_interest';
    if (t.includes('compound interest')) return 'compound_interest';
    if (t.includes('profit') || t.includes('loss') || t.includes('discount') || t.includes('marked price')) return 'profit_loss';
    if (t.includes('table') || t.includes('pie chart') || t.includes('bar graph') || t.includes('survey report') || t.includes('histogram')) return 'data_interpretation';
    if (t.includes('divisible') || t.includes('hcf') || t.includes('lcm')) return 'number_system';
    if (t.includes('ratio') || t.includes('proportion') || t.includes('mean proportional')) return 'ratio_proportion';
    if (t.includes('equation') || t.includes('linear') || t.includes('quadratic') || t.includes('polynomial')) return 'algebra';
    if (t.includes('speed') || t.includes('distance') || t.includes('train') || t.includes('boat') || t.includes('stream')) return 'speed_distance_time';
    if (t.includes('mixture') || t.includes('alligation')) return 'mixture_alligation';
    if (t.includes('partnership')) return 'partnership';
    if (t.includes('time') && t.includes('work')) return 'time_work';
    if (t.includes('pipe') && t.includes('cistern')) return 'pipes_cistern';
    if (t.includes('age') || t.includes('years old')) return 'algebra';
    if (t.includes('circle') || t.includes('triangle') || t.includes('chord') || t.includes('angle')) return 'geometry';
    if (t.includes('volume') || t.includes('cylinder') || t.includes('cone') || t.includes('sphere') || t.includes('cube')) return 'mensuration_3d';
    if (t.includes('area') || t.includes('perimeter')) return 'mensuration_2d';
    if (t.includes('trigonometry') || t.includes('sin ') || t.includes('cos ') || t.includes('tan ')) return 'trigonometry';
    if (t.includes('percentage')) return 'percentage';
    if (t.includes('average')) return 'average';
    if (t.includes('simplify') || t.includes('simplification')) return 'simplification';
    return 'algebra';
}

function inferDifficulty(subject: 'QUANT' | 'REASONING', pattern: string, text: string, hasImage: boolean): 'EASY' | 'MEDIUM' | 'HARD' {
    if (hasImage) return subject === 'REASONING' ? 'HARD' : 'MEDIUM';

    const hard = new Set(['counting_figures', 'syllogism', 'mensuration_3d', 'trigonometry', 'time_work']);
    const med = new Set([
        'coding_decoding',
        'analogy',
        'classification',
        'ratio_proportion',
        'algebra',
        'speed_distance_time',
        'mixture_alligation',
        'blood_relations',
        'statement_conclusion'
    ]);

    if (hard.has(pattern)) return 'HARD';
    if (med.has(pattern) || text.length > 220) return 'MEDIUM';
    return 'EASY';
}

function answerLine(letter: 'A' | 'B' | 'C' | 'D', optText: string) {
    return `**Answer:** Option ${letter}${optText && optText !== '[IMAGE]' ? ` (${optText})` : ''}.`;
}

function solutionFor(subject: 'QUANT' | 'REASONING', pattern: string, letter: 'A' | 'B' | 'C' | 'D', optText: string, hasImage: boolean): string {
    if (hasImage) {
        return `**Step 1:** This is image/table dependent, so read the full visual from the PDF.\n**Step 2:** Apply the relevant ${subject === 'QUANT' ? 'mathematical' : 'logical'} rule on that visual.\n**Step 3:** Match the derived result with the keyed option.\n${answerLine(letter, optText)}`;
    }

    if (subject === 'REASONING') {
        if (pattern === 'blood_relations') return `**Step 1:** Decode each relation statement in order and build the family chain.\n**Step 2:** Track from the reference person to the asked person.\n**Step 3:** Select the option that gives that exact relation.\n${answerLine(letter, optText)}`;
        if (pattern === 'coding_decoding') return `**Step 1:** Identify the transformation rule from the given coded examples.\n**Step 2:** Apply the same rule to the asked word/term.\n**Step 3:** Choose the option matching the transformed code.\n${answerLine(letter, optText)}`;
        if (pattern === 'series') return `**Step 1:** Check positional/alphabet/number progression between terms.\n**Step 2:** Derive the next required transformation.\n**Step 3:** Pick the option that follows the same pattern.\n${answerLine(letter, optText)}`;
        return `**Step 1:** Identify the core reasoning relation in the given data.\n**Step 2:** Eliminate options violating that relation.\n**Step 3:** Choose the only logically consistent option.\n${answerLine(letter, optText)}`;
    }

    if (pattern === 'profit_loss') return `**Step 1:** Set up CP/SP equations using given percentages.\n**Step 2:** Compute the required value with consistent percentage conversion.\n**Step 3:** Match with the correct option.\n${answerLine(letter, optText)}`;
    if (pattern === 'simple_interest' || pattern === 'compound_interest') return `**Step 1:** Write the correct interest formula.\n**Step 2:** Substitute the given principal/rate/time values.\n**Step 3:** Compute and match the result with options.\n${answerLine(letter, optText)}`;
    if (pattern === 'speed_distance_time') return `**Step 1:** Use Distance = Speed x Time (or relative speed where needed).\n**Step 2:** Convert all units to a common format.\n**Step 3:** Solve and select the matching option.\n${answerLine(letter, optText)}`;
    if (pattern === 'data_interpretation') return `**Step 1:** Read the exact numbers from the chart/table.\n**Step 2:** Perform the asked arithmetic/ratio/percentage operation.\n**Step 3:** Compare computed value with options.\n${answerLine(letter, optText)}`;
    return `**Step 1:** Identify the governing formula/relation for this topic.\n**Step 2:** Substitute values and simplify carefully.\n**Step 3:** Select the option matching the final result.\n${answerLine(letter, optText)}`;
}

function convertOne(row: RawQuestion, shift: string, exam: string, year: number): FinalQuestion | null {
    const subject = inferSubject(String(row?.source?.section || ''));

    let text = cleanText(String(row?.content?.text || ''));
    if (!text) text = '[IMAGE]';

    const rawOptions = Array.isArray(row?.content?.options) ? row!.content!.options! : [];
    const options = rawOptions.slice(0, 4).map((opt, idx) => {
        let t = cleanText(String(opt?.text || ''));
        if (!t || t === '-' || t.toLowerCase() === 'null') t = '[IMAGE]';
        return {
            id: (['A', 'B', 'C', 'D'][idx] as 'A' | 'B' | 'C' | 'D'),
            text: t,
            image: ''
        };
    });
    while (options.length < 4) {
        options.push({
            id: ['A', 'B', 'C', 'D'][options.length] as 'A' | 'B' | 'C' | 'D',
            text: '[IMAGE]',
            image: ''
        });
    }

    const correct = letterMap[String(row?.content?.correct_option_id || '')] || 'A';
    const correctText = options[correct.charCodeAt(0) - 65]?.text || '';
    const hasImage = text.includes('[IMAGE]') || options.some((o) => o.text === '[IMAGE]');

    let pattern = inferPattern(subject, text, hasImage);
    pattern = normalizePatternCode(pattern, subject);
    if (!pattern) pattern = subject === 'QUANT' ? 'algebra' : 'classification';

    const difficulty = inferDifficulty(subject, pattern, text, hasImage);

    return {
        text,
        image: '',
        options: options.slice(0, 4),
        correct_option: correct,
        solution: solutionFor(subject, pattern, correct, correctText, hasImage),
        subject,
        pattern,
        difficulty,
        source: {
            exam,
            year,
            shift
        },
        stats: {
            attempt_count: 0,
            accuracy_rate: 0,
            avg_time_ms: 0
        },
        is_live: false,
        needs_review: true
    };
}

function main() {
    const args = parseArgs();
    const rawText = fs.readFileSync(path.resolve(args.input), 'utf8').replace(/^\uFEFF/, '');
    const raw = JSON.parse(rawText) as RawQuestion[];

    if (!Array.isArray(raw)) {
        console.error('Input JSON must be an array');
        process.exit(1);
    }

    const converted = raw
        .map((q) => convertOne(q, args.shift, args.exam, args.year))
        .filter((q): q is FinalQuestion => !!q);

    const quant = converted.filter((q) => q.subject === 'QUANT');
    const reasoning = converted.filter((q) => q.subject === 'REASONING');

    fs.mkdirSync(path.dirname(path.resolve(args.quantOut)), { recursive: true });
    fs.mkdirSync(path.dirname(path.resolve(args.reasoningOut)), { recursive: true });
    fs.writeFileSync(path.resolve(args.quantOut), `${JSON.stringify(quant, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.resolve(args.reasoningOut), `${JSON.stringify(reasoning, null, 2)}\n`, 'utf8');

    console.log(`Wrote ${args.quantOut} (${quant.length})`);
    console.log(`Wrote ${args.reasoningOut} (${reasoning.length})`);
}

main();

