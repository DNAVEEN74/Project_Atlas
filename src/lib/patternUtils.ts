export type CanonicalSubject = 'QUANT' | 'REASONING';

export const CANONICAL_PATTERNS_BY_SUBJECT: Record<CanonicalSubject, string[]> = {
    QUANT: [
        'percentage',
        'profit_loss',
        'simple_interest',
        'compound_interest',
        'ratio_proportion',
        'mixture_alligation',
        'partnership',
        'average',
        'time_work',
        'pipes_cistern',
        'speed_distance_time',
        'boat_stream',
        'number_system',
        'hcf_lcm',
        'simplification',
        'power_indices',
        'algebra',
        'trigonometry',
        'height_distance',
        'geometry',
        'mensuration_2d',
        'mensuration_3d',
        'coordinate_geometry',
        'data_interpretation'
    ],
    REASONING: [
        'analogy',
        'classification',
        'coding_decoding',
        'series',
        'missing_number',
        'blood_relations',
        'direction_sense',
        'order_ranking',
        'sitting_arrangement',
        'syllogism',
        'venn_diagram',
        'dice_cube',
        'clock_calendar',
        'counting_figures',
        'mirror_water_image',
        'paper_cutting',
        'embedded_figures',
        'matrix',
        'statement_conclusion',
        'mathematical_operation',
        'word_formation'
    ]
};

export const CANONICAL_PATTERN_CODES = [
    ...CANONICAL_PATTERNS_BY_SUBJECT.QUANT,
    ...CANONICAL_PATTERNS_BY_SUBJECT.REASONING
];

const CANONICAL_SET = new Set<string>(CANONICAL_PATTERN_CODES);

const ALIAS_TO_CANONICAL: Record<string, string> = {
    // QUANT aliases
    profit_and_loss: 'profit_loss',
    ratio_and_proportion: 'ratio_proportion',
    alligation: 'mixture_alligation',
    mixtures_alligation: 'mixture_alligation',
    time_and_work: 'time_work',
    pipes_and_cistern: 'pipes_cistern',
    pipe_cistern: 'pipes_cistern',
    time_speed_distance: 'speed_distance_time',
    power_indices_surds: 'power_indices',
    linear_equation: 'algebra',
    linear_equations: 'algebra',
    divisibility: 'number_system',
    arithmetic: 'simplification',
    ages: 'algebra',
    discount: 'profit_loss',
    variation: 'ratio_proportion',
    probability: 'number_system',

    // REASONING aliases
    blood_relation: 'blood_relations',
    blood_relations_coding: 'blood_relations',
    distance_direction: 'direction_sense',
    mirror_image: 'mirror_water_image',
    dice: 'dice_cube',
    dice_cubes: 'dice_cube',
    cubes_and_dice: 'dice_cube',
    figure_counting: 'counting_figures',
    paper_folding: 'paper_cutting',
    paper_cutting_folding: 'paper_cutting',
    embedded_figure: 'embedded_figures',
    operator_interchange: 'mathematical_operation',
    mathematical_operations: 'mathematical_operation',
    logical_analogy: 'analogy',
    letter_analogy: 'analogy',
    number_analogy: 'analogy',
    set_analogy: 'analogy',
    odd_one_out: 'classification',
    odd_pair: 'classification',
    non_verbal_reasoning: 'classification',
    figure_based_reasoning: 'classification',
    logical_reasoning: 'classification',
    arrangement: 'sitting_arrangement',
    alphabetical_order: 'word_formation',
    alphabetical_arrangement: 'word_formation',
    alphabet_recall: 'word_formation',
    word_arrangement: 'word_formation',
    letter_series: 'series',
    number_series: 'series',
    figure_series: 'series',
    logical_sequence: 'series',
    non_verbal_series: 'series',
    pattern_completion: 'series',
    number_logic: 'series',
    calendar: 'clock_calendar',

    // Noise token
    unknown: ''
};

export function normalizePatternToken(value: string): string {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/_+/g, '_');
}

export function normalizeSubject(subjectRaw: string | null | undefined): CanonicalSubject | '' {
    const s = String(subjectRaw || '').trim().toUpperCase();
    if (s === 'QUANT' || s === 'QUANTITATIVE APTITUDE') return 'QUANT';
    if (s.includes('REASONING')) return 'REASONING';
    return '';
}

export function normalizePatternCodeStrict(rawPattern: string | null | undefined): string {
    const token = normalizePatternToken(rawPattern || '');
    if (!token) return '';
    if (CANONICAL_SET.has(token)) return token;
    const mapped = ALIAS_TO_CANONICAL[token];
    if (mapped && CANONICAL_SET.has(mapped)) return mapped;
    return '';
}

export function normalizePatternCode(
    rawPattern: string | null | undefined,
    subjectRaw?: string | null
): string {
    const strict = normalizePatternCodeStrict(rawPattern);
    if (strict) return strict;

    const subject = normalizeSubject(subjectRaw);
    if (subject === 'QUANT') return 'algebra';
    if (subject === 'REASONING') return 'classification';
    return '';
}

export function isCanonicalPatternCode(rawPattern: string | null | undefined): boolean {
    return !!normalizePatternCodeStrict(rawPattern);
}

