import { normalizePatternCodeStrict, normalizePatternToken } from './patternUtils';

export const TOPIC_TO_PATTERN_CODE: Record<string, string> = {
    // QUANTITATIVE APTITUDE
    'Percentage': 'percentage',
    'Profit & Loss': 'profit_loss',
    'Simple Interest': 'simple_interest',
    'Compound Interest': 'compound_interest',
    'Ratio & Proportion': 'ratio_proportion',
    'Mixtures & Alligation': 'mixture_alligation',
    'Mixture & Alligation': 'mixture_alligation',
    'Partnership': 'partnership',
    'Average': 'average',
    'Time & Work': 'time_work',
    'Pipe & Cistern': 'pipes_cistern',
    'Pipes & Cistern': 'pipes_cistern',
    'Time Speed Distance': 'speed_distance_time',
    'Speed Distance Time': 'speed_distance_time',
    'Boat & Stream': 'boat_stream',
    'Number System': 'number_system',
    'HCF & LCM': 'hcf_lcm',
    'Simplification': 'simplification',
    'Power Indices Surds': 'power_indices',
    'Power & Indices': 'power_indices',
    'Algebra': 'algebra',
    'Trigonometry': 'trigonometry',
    'Height & Distance': 'height_distance',
    'Geometry': 'geometry',
    'Mensuration 2D': 'mensuration_2d',
    'Mensuration 3D': 'mensuration_3d',
    'Coordinate Geometry': 'coordinate_geometry',
    'Data Interpretation': 'data_interpretation',
    'Statistics': 'statistics',

    // REASONING
    'Coding Decoding': 'coding_decoding',
    'Coding-Decoding': 'coding_decoding',
    'Analogy': 'analogy',
    'Classification': 'classification',
    'Series': 'series',
    'Missing Number': 'missing_number',
    'Blood Relation': 'blood_relations',
    'Blood Relations': 'blood_relations',
    'Direction Sense': 'direction_sense',
    'Distance & Direction': 'direction_sense',
    'Syllogism': 'syllogism',
    'Order & Ranking': 'order_ranking',
    'Sitting Arrangement': 'sitting_arrangement',
    'Clock & Calendar': 'clock_calendar',
    'Venn Diagram': 'venn_diagram',
    'Dice & Cube': 'dice_cube',
    'Figure Counting': 'counting_figures',
    'Counting Figures': 'counting_figures',
    'Mirror & Water Image': 'mirror_water_image',
    'Paper Cutting': 'paper_cutting',
    'Paper Cutting & Folding': 'paper_cutting',
    'Embedded Figure': 'embedded_figures',
    'Embedded Figures': 'embedded_figures',
    'Matrix': 'matrix',
    'Statement & Conclusion': 'statement_conclusion',
    'Mathematical Operation': 'mathematical_operation',
    'Word Formation': 'word_formation'
};

export const PATTERN_CODE_TO_TOPIC: Record<string, string> = Object.entries(TOPIC_TO_PATTERN_CODE).reduce((acc, [topic, code]) => {
    acc[code] = topic;
    return acc;
}, {} as Record<string, string>);

export const getPatternCode = (topic: string): string => {
    if (TOPIC_TO_PATTERN_CODE[topic]) return TOPIC_TO_PATTERN_CODE[topic];
    const normalized = normalizePatternToken(topic);
    return normalizePatternCodeStrict(normalized) || normalized;
};

export const getTopicName = (code: string | undefined | null): string => {
    if (!code) return 'Unknown Topic';
    const normalized = normalizePatternCodeStrict(code) || normalizePatternToken(code);
    return PATTERN_CODE_TO_TOPIC[normalized] || normalized.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
