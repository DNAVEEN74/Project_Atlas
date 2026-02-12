export const TOPIC_TO_PATTERN_CODE: Record<string, string> = {
    // QUANTITATIVE APTITUDE
    'Percentage': 'percentage',
    'Profit & Loss': 'profit_loss',
    'Simple Interest': 'simple_interest',
    'Compound Interest': 'compound_interest',
    'Ratio & Proportion': 'ratio_proportion',
    'Mixtures & Alligation': 'mixtures_alligation',
    'Partnership': 'partnership',
    'Average': 'average',
    'Time & Work': 'time_work',
    'Pipe & Cistern': 'pipe_cistern',
    'Time Speed Distance': 'time_speed_distance',
    'Boat & Stream': 'boat_stream',
    'Number System': 'number_system',
    'HCF & LCM': 'hcf_lcm',
    'Simplification': 'simplification',
    'Power Indices Surds': 'power_indices_surds',
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
    'Analogy': 'analogy',
    'Classification': 'classification',
    'Series': 'series',
    'Missing Number': 'missing_number',
    'Blood Relation': 'blood_relation',
    'Distance & Direction': 'distance_direction',
    'Syllogism': 'syllogism',
    'Order & Ranking': 'order_ranking',
    'Sitting Arrangement': 'sitting_arrangement',
    'Clock & Calendar': 'clock_calendar',
    'Venn Diagram': 'venn_diagram',
    'Dice & Cube': 'dice_cube',
    'Figure Counting': 'figure_counting',
    'Mirror & Water Image': 'mirror_water_image',
    'Paper Cutting & Folding': 'paper_cutting_folding',
    'Embedded Figure': 'embedded_figure',
    'Matrix': 'matrix',
    'Mathematical Operation': 'mathematical_operation',
    'Word Formation': 'word_formation'
};

export const PATTERN_CODE_TO_TOPIC: Record<string, string> = Object.entries(TOPIC_TO_PATTERN_CODE).reduce((acc, [topic, code]) => {
    acc[code] = topic;
    return acc;
}, {} as Record<string, string>);

export const getPatternCode = (topic: string): string => {
    return TOPIC_TO_PATTERN_CODE[topic] || topic.toLowerCase().replace(/ /g, '_');
};

export const getTopicName = (code: string | undefined | null): string => {
    if (!code) return 'Unknown Topic';
    return PATTERN_CODE_TO_TOPIC[code] || code.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
