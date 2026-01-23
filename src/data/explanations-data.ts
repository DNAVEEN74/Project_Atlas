// Explanations Data - Master data file for all pattern explanations
// Contains metadata, SEO info, and pattern categorization

export interface PatternInfo {
    slug: string;
    name: string;
    code: string;
    category: 'quant' | 'reasoning';
    icon: string;
    description: string;
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    questionsInExam: string;

    // Curriculum fields
    phase: number;          // 1-5 for Quant, 1-4 for Reasoning (Clusters)
    order: number;          // Global order for sorting
    prerequisites: string[]; // slugs of required topics
}

// Quantitative Aptitude Patterns (24)
export const quantPatterns: PatternInfo[] = [
    // Phase 1: Foundation
    {
        slug: 'number-system',
        name: 'Number System',
        code: 'QUANT_NS',
        category: 'quant',
        icon: 'NumbersIcon',
        description: 'Understand types of numbers, divisibility rules, remainders, and number properties.',
        seo: {
            title: 'Number System - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master number system concepts with divisibility rules, remainders, and solved examples for SSC CGL 2025.',
            keywords: ['number system', 'divisibility rules', 'remainder theorem', 'SSC CGL numbers', 'prime numbers']
        },
        difficulty: 'beginner',
        questionsInExam: '3-4 questions per exam',
        phase: 1,
        order: 1,
        prerequisites: []
    },
    {
        slug: 'simplification',
        name: 'Simplification',
        code: 'QUANT_SIMP',
        category: 'quant',
        icon: 'CalculateIcon',
        description: 'Master BODMAS rule and quick calculation techniques for complex expressions.',
        seo: {
            title: 'Simplification - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master simplification with BODMAS rule, calculation tricks, and solved examples for SSC CGL 2025.',
            keywords: ['simplification', 'BODMAS', 'calculation tricks', 'SSC CGL simplification', 'quick calculation']
        },
        difficulty: 'beginner',
        questionsInExam: '2-3 questions per exam',
        phase: 1,
        order: 2,
        prerequisites: []
    },
    {
        slug: 'percentage',
        name: 'Percentage',
        code: 'QUANT_PERC',
        category: 'quant',
        icon: 'PercentIcon',
        description: 'Master percentage calculations, conversions, and real-world applications essential for SSC CGL.',
        seo: {
            title: 'Percentage - Complete Guide for SSC CGL | PrepLeague',
            description: 'Learn percentage concepts from basics to advanced with formulas, shortcuts, and solved examples. Master percentage calculations for SSC CGL 2025.',
            keywords: ['percentage', 'percentage formula', 'percentage tricks', 'SSC CGL percentage', 'percentage shortcuts']
        },
        difficulty: 'beginner',
        questionsInExam: '2-3 questions per exam',
        phase: 1,
        order: 3,
        prerequisites: ['simplification']
    },
    {
        slug: 'ratio-proportion',
        name: 'Ratio & Proportion',
        code: 'QUANT_RATIO',
        category: 'quant',
        icon: 'BalanceIcon',
        description: 'Understand ratio, proportion, and their applications in comparing quantities and solving word problems.',
        seo: {
            title: 'Ratio and Proportion - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master ratio and proportion concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['ratio and proportion', 'ratio formula', 'proportion tricks', 'SSC CGL ratio', 'ratio problems']
        },
        difficulty: 'beginner',
        questionsInExam: '2-3 questions per exam',
        phase: 1,
        order: 4,
        prerequisites: ['simplification']
    },

    // Phase 2: Percentage Family
    {
        slug: 'profit-loss',
        name: 'Profit & Loss',
        code: 'QUANT_PL',
        category: 'quant',
        icon: 'TrendingUpIcon',
        description: 'Understand profit, loss, discount, and marked price concepts with practical business applications.',
        seo: {
            title: 'Profit and Loss - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master profit and loss concepts with formulas, shortcuts, and solved examples. Learn discount calculations for SSC CGL 2025.',
            keywords: ['profit and loss', 'profit loss formula', 'discount percentage', 'SSC CGL profit loss', 'marked price']
        },
        difficulty: 'beginner',
        questionsInExam: '2-3 questions per exam',
        phase: 2,
        order: 5,
        prerequisites: ['percentage']
    },
    {
        slug: 'simple-interest',
        name: 'Simple Interest',
        code: 'QUANT_SI',
        category: 'quant',
        icon: 'AccountBalanceIcon',
        description: 'Learn simple interest calculations with formulas and shortcuts for banking-related problems.',
        seo: {
            title: 'Simple Interest - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master simple interest concepts with formulas, tricks, and solved examples. Learn SI calculations for SSC CGL 2025.',
            keywords: ['simple interest', 'SI formula', 'simple interest tricks', 'SSC CGL simple interest', 'interest calculation']
        },
        difficulty: 'beginner',
        questionsInExam: '1-2 questions per exam',
        phase: 2,
        order: 6,
        prerequisites: ['percentage']
    },
    {
        slug: 'compound-interest',
        name: 'Compound Interest',
        code: 'QUANT_CI',
        category: 'quant',
        icon: 'ShowChartIcon',
        description: 'Master compound interest with formulas for different compounding periods and comparison with SI.',
        seo: {
            title: 'Compound Interest - Complete Guide for SSC CGL | PrepLeague',
            description: 'Learn compound interest concepts with formulas, shortcuts, and solved examples. Master CI calculations for SSC CGL 2025.',
            keywords: ['compound interest', 'CI formula', 'compound interest tricks', 'SSC CGL compound interest', 'CI vs SI']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 2,
        order: 7,
        prerequisites: ['percentage', 'simple-interest']
    },

    // Phase 3: Ratio Family
    {
        slug: 'partnership',
        name: 'Partnership',
        code: 'QUANT_PART',
        category: 'quant',
        icon: 'HandshakeIcon',
        description: 'Understand profit sharing in business partnerships based on investment and time.',
        seo: {
            title: 'Partnership - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master partnership concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['partnership', 'partnership formula', 'profit sharing', 'SSC CGL partnership', 'business partnership']
        },
        difficulty: 'intermediate',
        questionsInExam: '1 question per exam',
        phase: 3,
        order: 8,
        prerequisites: ['ratio-proportion']
    },
    {
        slug: 'mixtures-alligation',
        name: 'Mixtures & Alligation',
        code: 'QUANT_MIX',
        category: 'quant',
        icon: 'BlenderIcon',
        description: 'Learn alligation rule and mixture problems for combining quantities at different prices or concentrations.',
        seo: {
            title: 'Mixtures and Alligation - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master mixture and alligation concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['mixtures and alligation', 'alligation rule', 'mixture problems', 'SSC CGL mixtures', 'alligation formula']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 3,
        order: 9,
        prerequisites: ['ratio-proportion', 'average']
    },
    {
        slug: 'average',
        name: 'Average',
        code: 'QUANT_AVG',
        category: 'quant',
        icon: 'EqualizerIcon',
        description: 'Master average calculations including weighted average, average speed, and age-based problems.',
        seo: {
            title: 'Average - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master average concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['average', 'average formula', 'weighted average', 'SSC CGL average', 'average problems']
        },
        difficulty: 'beginner',
        questionsInExam: '2-3 questions per exam',
        phase: 3,
        order: 10,
        prerequisites: ['simplification']
    },
    {
        slug: 'time-work',
        name: 'Time & Work',
        code: 'QUANT_TW',
        category: 'quant',
        icon: 'EngineeringIcon',
        description: 'Learn to solve work efficiency problems using LCM method and work-rate concepts.',
        seo: {
            title: 'Time and Work - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master time and work concepts with formulas, LCM method, and solved examples for SSC CGL 2025.',
            keywords: ['time and work', 'work formula', 'LCM method', 'SSC CGL time work', 'efficiency problems']
        },
        difficulty: 'intermediate',
        questionsInExam: '2-3 questions per exam',
        phase: 3,
        order: 11,
        prerequisites: ['ratio-proportion', 'simplification']
    },
    {
        slug: 'pipe-cistern',
        name: 'Pipe & Cistern',
        code: 'QUANT_PC',
        category: 'quant',
        icon: 'PlumbingIcon',
        description: 'Apply time and work concepts to pipe filling and emptying problems.',
        seo: {
            title: 'Pipe and Cistern - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master pipe and cistern concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['pipe and cistern', 'pipe formula', 'cistern problems', 'SSC CGL pipes', 'tank filling']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 3,
        order: 12,
        prerequisites: ['time-work']
    },
    {
        slug: 'time-speed-distance',
        name: 'Time Speed Distance',
        code: 'QUANT_TSD',
        category: 'quant',
        icon: 'SpeedIcon',
        description: 'Master motion problems including relative speed, trains, and average speed calculations.',
        seo: {
            title: 'Time Speed Distance - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master TSD concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['time speed distance', 'TSD formula', 'relative speed', 'SSC CGL TSD', 'train problems']
        },
        difficulty: 'intermediate',
        questionsInExam: '2-3 questions per exam',
        phase: 3,
        order: 13,
        prerequisites: ['ratio-proportion']
    },
    {
        slug: 'boat-stream',
        name: 'Boat & Stream',
        code: 'QUANT_BS',
        category: 'quant',
        icon: 'DirectionsBoatIcon',
        description: 'Solve problems involving motion in water with upstream and downstream concepts.',
        seo: {
            title: 'Boat and Stream - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master boat and stream concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['boat and stream', 'upstream downstream', 'boat formula', 'SSC CGL boat', 'stream speed']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 3,
        order: 14,
        prerequisites: ['time-speed-distance']
    },

    // Phase 4: Advanced Maths
    {
        slug: 'algebra',
        name: 'Algebra',
        code: 'QUANT_ALG',
        category: 'quant',
        icon: 'FunctionsIcon',
        description: 'Master algebraic identities, equations, and polynomial factorization techniques.',
        seo: {
            title: 'Algebra - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master algebra with identities, equations, and solved examples for SSC CGL 2025.',
            keywords: ['algebra', 'algebraic identities', 'polynomial', 'SSC CGL algebra', 'factorization']
        },
        difficulty: 'intermediate',
        questionsInExam: '3-4 questions per exam',
        phase: 4,
        order: 15,
        prerequisites: ['simplification', 'power-indices-surds']
    },
    {
        slug: 'trigonometry',
        name: 'Trigonometry',
        code: 'QUANT_TRIG',
        category: 'quant',
        icon: 'ChangeHistoryIcon',
        description: 'Learn trigonometric ratios, identities, and their applications in problem-solving.',
        seo: {
            title: 'Trigonometry - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master trigonometry with ratios, identities, and solved examples for SSC CGL 2025.',
            keywords: ['trigonometry', 'trigonometric ratios', 'trig identities', 'SSC CGL trigonometry', 'sin cos tan']
        },
        difficulty: 'intermediate',
        questionsInExam: '3-4 questions per exam',
        phase: 4,
        order: 16,
        prerequisites: ['geometry', 'algebra']
    },
    {
        slug: 'height-distance',
        name: 'Height & Distance',
        code: 'QUANT_HD',
        category: 'quant',
        icon: 'HeightIcon',
        description: 'Apply trigonometry to solve real-world height and distance problems.',
        seo: {
            title: 'Height and Distance - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master height and distance with trigonometric applications and solved examples for SSC CGL 2025.',
            keywords: ['height and distance', 'angle of elevation', 'angle of depression', 'SSC CGL height', 'tower problems']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 17,
        prerequisites: ['trigonometry']
    },
    {
        slug: 'geometry',
        name: 'Geometry',
        code: 'QUANT_GEO',
        category: 'quant',
        icon: 'CategoryIcon',
        description: 'Master geometric shapes, theorems, and properties of triangles, circles, and quadrilaterals.',
        seo: {
            title: 'Geometry - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master geometry with theorems, properties, and solved examples for SSC CGL 2025.',
            keywords: ['geometry', 'triangles', 'circles', 'SSC CGL geometry', 'geometric theorems']
        },
        difficulty: 'advanced',
        questionsInExam: '4-5 questions per exam',
        phase: 4,
        order: 18,
        prerequisites: []
    },
    {
        slug: 'mensuration-2d',
        name: 'Mensuration 2D',
        code: 'QUANT_M2D',
        category: 'quant',
        icon: 'CropSquareIcon',
        description: 'Calculate area and perimeter of 2D shapes including circles, triangles, and polygons.',
        seo: {
            title: 'Mensuration 2D - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master 2D mensuration with area and perimeter formulas for SSC CGL 2025.',
            keywords: ['mensuration 2D', 'area formulas', 'perimeter', 'SSC CGL mensuration', '2D shapes']
        },
        difficulty: 'intermediate',
        questionsInExam: '2-3 questions per exam',
        phase: 4,
        order: 19,
        prerequisites: ['geometry']
    },
    {
        slug: 'mensuration-3d',
        name: 'Mensuration 3D',
        code: 'QUANT_M3D',
        category: 'quant',
        icon: 'ViewInArIcon',
        description: 'Calculate volume and surface area of 3D solids like cubes, spheres, and cones.',
        seo: {
            title: 'Mensuration 3D - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master 3D mensuration with volume and surface area formulas for SSC CGL 2025.',
            keywords: ['mensuration 3D', 'volume formulas', 'surface area', 'SSC CGL 3D', 'solid shapes']
        },
        difficulty: 'intermediate',
        questionsInExam: '2-3 questions per exam',
        phase: 4,
        order: 20,
        prerequisites: ['mensuration-2d']
    },
    {
        slug: 'coordinate-geometry',
        name: 'Coordinate Geometry',
        code: 'QUANT_CG',
        category: 'quant',
        icon: 'GridOnIcon',
        description: 'Learn distance, section formula, and line equations in coordinate plane.',
        seo: {
            title: 'Coordinate Geometry - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master coordinate geometry with distance formula, slope, and solved examples for SSC CGL 2025.',
            keywords: ['coordinate geometry', 'distance formula', 'slope', 'SSC CGL coordinate', 'section formula']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 21,
        prerequisites: ['algebra', 'geometry']
    },
    {
        slug: 'power-indices-surds',
        name: 'Power Indices Surds',
        code: 'QUANT_PIS',
        category: 'quant',
        icon: 'SuperscriptIcon',
        description: 'Understand exponents, surds, and rationalization techniques for complex calculations.',
        seo: {
            title: 'Power Indices and Surds - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master indices and surds with formulas, rationalization, and solved examples for SSC CGL 2025.',
            keywords: ['surds', 'indices', 'exponents', 'SSC CGL surds', 'rationalization']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 22,
        prerequisites: ['number-system']
    },
    {
        slug: 'hcf-lcm',
        name: 'HCF & LCM',
        code: 'QUANT_HCF',
        category: 'quant',
        icon: 'JoinInnerIcon',
        description: 'Learn to find HCF and LCM using different methods and solve real-world problems.',
        seo: {
            title: 'HCF and LCM - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master HCF and LCM concepts with formulas, shortcuts, and solved examples for SSC CGL 2025.',
            keywords: ['HCF LCM', 'HCF formula', 'LCM formula', 'SSC CGL HCF', 'highest common factor']
        },
        difficulty: 'beginner',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 23,
        prerequisites: ['number-system']
    },

    // Phase 5: Data Interpretation
    {
        slug: 'data-interpretation',
        name: 'Data Interpretation',
        code: 'QUANT_DI',
        category: 'quant',
        icon: 'BarChartIcon',
        description: 'Analyze bar graphs, pie charts, line graphs, and tabular data efficiently.',
        seo: {
            title: 'Data Interpretation - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master data interpretation with graph analysis techniques for SSC CGL 2025.',
            keywords: ['data interpretation', 'bar graph', 'pie chart', 'SSC CGL DI', 'table analysis']
        },
        difficulty: 'intermediate',
        questionsInExam: '5-8 questions per exam',
        phase: 5,
        order: 24,
        prerequisites: ['percentage', 'ratio-proportion', 'average']
    }
];

// Reasoning Patterns (17)
export const reasoningPatterns: PatternInfo[] = [
    // Cluster 1: Alphabet & Coding
    {
        slug: 'coding-decoding',
        name: 'Coding-Decoding',
        code: 'REAS_CODE',
        category: 'reasoning',
        icon: 'LockIcon',
        description: 'Decode messages using letter shifting, position-based, and symbol coding patterns.',
        seo: {
            title: 'Coding-Decoding - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master coding-decoding with all patterns, tricks, and solved examples for SSC CGL 2025.',
            keywords: ['coding decoding', 'letter coding', 'number coding', 'SSC CGL coding', 'cipher reasoning']
        },
        difficulty: 'intermediate',
        questionsInExam: '2-3 questions per exam',
        phase: 1,
        order: 1,
        prerequisites: []
    },
    {
        slug: 'series',
        name: 'Series',
        code: 'REAS_SER',
        category: 'reasoning',
        icon: 'LinearScaleIcon',
        description: 'Identify patterns in number, letter, and alpha-numeric series.',
        seo: {
            title: 'Series - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master series patterns with number and letter series tricks for SSC CGL 2025.',
            keywords: ['series reasoning', 'number series', 'letter series', 'SSC CGL series', 'pattern recognition']
        },
        difficulty: 'intermediate',
        questionsInExam: '2-3 questions per exam',
        phase: 1,
        order: 2,
        prerequisites: []
    },
    {
        slug: 'analogy',
        name: 'Analogy',
        code: 'REAS_ANAL',
        category: 'reasoning',
        icon: 'CompareArrowsIcon',
        description: 'Identify relationships between pairs of words, letters, or numbers.',
        seo: {
            title: 'Analogy - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master analogy concepts with types, patterns, and solved examples for SSC CGL 2025.',
            keywords: ['analogy', 'word analogy', 'number analogy', 'SSC CGL analogy', 'reasoning analogy']
        },
        difficulty: 'beginner',
        questionsInExam: '2-3 questions per exam',
        phase: 1,
        order: 3,
        prerequisites: []
    },
    {
        slug: 'classification',
        name: 'Classification',
        code: 'REAS_CLASS',
        category: 'reasoning',
        icon: 'CategoryIcon',
        description: 'Find the odd one out based on common properties or patterns.',
        seo: {
            title: 'Classification - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master classification concepts with odd one out tricks for SSC CGL 2025.',
            keywords: ['classification', 'odd one out', 'reasoning classification', 'SSC CGL classification']
        },
        difficulty: 'beginner',
        questionsInExam: '2-3 questions per exam',
        phase: 1,
        order: 4,
        prerequisites: []
    },
    {
        slug: 'missing-number',
        name: 'Missing Number',
        code: 'REAS_MISS',
        category: 'reasoning',
        icon: 'HelpOutlineIcon',
        description: 'Find missing numbers in tables and figures using mathematical patterns.',
        seo: {
            title: 'Missing Number - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master missing number problems with pattern recognition for SSC CGL 2025.',
            keywords: ['missing number', 'figure reasoning', 'table reasoning', 'SSC CGL missing', 'number puzzle']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 1,
        order: 5,
        prerequisites: ['arithmetic-basics']
    },

    // Cluster 2: Visual Reasoning
    {
        slug: 'counting-figures',
        name: 'Counting Figures',
        code: 'REAS_CNT',
        category: 'reasoning',
        icon: 'GridViewIcon',
        description: 'Count triangles, squares, and other geometric shapes in complex figures.',
        seo: {
            title: 'Counting Figures - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master figure counting with formulas and techniques for SSC CGL 2025.',
            keywords: ['counting figures', 'count triangles', 'figure reasoning', 'SSC CGL counting', 'shape counting']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 2,
        order: 6,
        prerequisites: []
    },
    {
        slug: 'mirror-water-image',
        name: 'Mirror & Water Image',
        code: 'REAS_MIR',
        category: 'reasoning',
        icon: 'FlipIcon',
        description: 'Find mirror and water reflections of letters, numbers, and figures.',
        seo: {
            title: 'Mirror and Water Image - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master mirror and water image concepts with letter patterns for SSC CGL 2025.',
            keywords: ['mirror image', 'water image', 'reflection reasoning', 'SSC CGL mirror', 'image problems']
        },
        difficulty: 'beginner',
        questionsInExam: '1-2 questions per exam',
        phase: 2,
        order: 7,
        prerequisites: []
    },
    {
        slug: 'paper-cutting',
        name: 'Paper Cutting',
        code: 'REAS_PAP',
        category: 'reasoning',
        icon: 'ContentCutIcon',
        description: 'Visualize paper folding and cutting patterns to find the unfolded result.',
        seo: {
            title: 'Paper Cutting - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master paper folding and cutting patterns for SSC CGL 2025.',
            keywords: ['paper cutting', 'paper folding', 'visual reasoning', 'SSC CGL paper', 'cut patterns']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 2,
        order: 8,
        prerequisites: []
    },
    {
        slug: 'embedded-figures',
        name: 'Embedded Figures',
        code: 'REAS_EMB',
        category: 'reasoning',
        icon: 'LayersIcon',
        description: 'Find hidden figures embedded within complex geometric patterns.',
        seo: {
            title: 'Embedded Figures - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master embedded figure identification for SSC CGL 2025.',
            keywords: ['embedded figures', 'hidden figures', 'figure reasoning', 'SSC CGL embedded', 'visual patterns']
        },
        difficulty: 'beginner',
        questionsInExam: '1-2 questions per exam',
        phase: 2,
        order: 9,
        prerequisites: []
    },
    {
        slug: 'dice-cube',
        name: 'Dice & Cube',
        code: 'REAS_DICE',
        category: 'reasoning',
        icon: 'CasinoIcon',
        description: 'Solve problems related to dice opposite faces and cube cutting patterns.',
        seo: {
            title: 'Dice and Cube - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master dice and cube problems with opposite face rules for SSC CGL 2025.',
            keywords: ['dice cube', 'opposite faces', 'cube cutting', 'SSC CGL dice', 'dice reasoning']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 2,
        order: 10,
        prerequisites: []
    },

    // Cluster 3: Analytical Logic
    {
        slug: 'syllogism',
        name: 'Syllogism',
        code: 'REAS_SYLL',
        category: 'reasoning',
        icon: 'AccountTreeIcon',
        description: 'Draw logical conclusions from given statements using Venn diagram method.',
        seo: {
            title: 'Syllogism - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master syllogism with Venn diagram method and logical conclusions for SSC CGL 2025.',
            keywords: ['syllogism', 'logical reasoning', 'venn diagram method', 'SSC CGL syllogism', 'statements conclusions']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 3,
        order: 11,
        prerequisites: ['venn-diagram']
    },
    {
        slug: 'venn-diagram',
        name: 'Venn Diagram',
        code: 'REAS_VENN',
        category: 'reasoning',
        icon: 'DonutLargeIcon',
        description: 'Represent relationships between different groups using overlapping circles.',
        seo: {
            title: 'Venn Diagram - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master Venn diagrams with relationship representation for SSC CGL 2025.',
            keywords: ['venn diagram', 'set theory', 'logical venn', 'SSC CGL venn', 'circle diagrams']
        },
        difficulty: 'beginner',
        questionsInExam: '1-2 questions per exam',
        phase: 3,
        order: 12,
        prerequisites: []
    },
    {
        slug: 'statement-conclusion',
        name: 'Statement & Conclusion',
        code: 'REAS_STMT',
        category: 'reasoning',
        icon: 'QuestionAnswerIcon',
        description: 'Evaluate logical conclusions drawn from given statements.',
        seo: {
            title: 'Statement and Conclusion - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master statement-conclusion reasoning for SSC CGL 2025.',
            keywords: ['statement conclusion', 'logical reasoning', 'verbal reasoning', 'SSC CGL statement']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 3,
        order: 13,
        prerequisites: ['syllogism']
    },

    // Cluster 4: Real-world Logic
    {
        slug: 'blood-relations',
        name: 'Blood Relations',
        code: 'REAS_BLD',
        category: 'reasoning',
        icon: 'FamilyRestroomIcon',
        description: 'Solve family tree problems and identify relationships between family members.',
        seo: {
            title: 'Blood Relations - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master blood relations with family tree techniques for SSC CGL 2025.',
            keywords: ['blood relations', 'family tree', 'relationship reasoning', 'SSC CGL blood', 'family relations']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 14,
        prerequisites: []
    },
    {
        slug: 'direction-sense',
        name: 'Direction Sense',
        code: 'REAS_DIR',
        category: 'reasoning',
        icon: 'ExploreIcon',
        description: 'Solve problems involving directions, distances, and navigation.',
        seo: {
            title: 'Direction Sense - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master direction sense with compass directions and distance calculations for SSC CGL 2025.',
            keywords: ['direction sense', 'compass directions', 'distance reasoning', 'SSC CGL direction', 'navigation']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 15,
        prerequisites: []
    },
    {
        slug: 'order-ranking',
        name: 'Order & Ranking',
        code: 'REAS_ORD',
        category: 'reasoning',
        icon: 'FormatListNumberedIcon',
        description: 'Determine positions and ranks in linear arrangements.',
        seo: {
            title: 'Order and Ranking - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master order and ranking with position formulas for SSC CGL 2025.',
            keywords: ['order ranking', 'position formula', 'ranking reasoning', 'SSC CGL ranking', 'linear arrangement']
        },
        difficulty: 'beginner',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 16,
        prerequisites: []
    },
    {
        slug: 'sitting-arrangement',
        name: 'Sitting Arrangement',
        code: 'REAS_SIT',
        category: 'reasoning',
        icon: 'EventSeatIcon',
        description: 'Solve linear and circular seating arrangement problems.',
        seo: {
            title: 'Sitting Arrangement - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master sitting arrangement with linear and circular patterns for SSC CGL 2025.',
            keywords: ['sitting arrangement', 'circular arrangement', 'seating reasoning', 'SSC CGL sitting', 'arrangement puzzles']
        },
        difficulty: 'advanced',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 17,
        prerequisites: ['order-ranking']
    },
    {
        slug: 'clock-calendar',
        name: 'Clock & Calendar',
        code: 'REAS_CLK',
        category: 'reasoning',
        icon: 'ScheduleIcon',
        description: 'Calculate angles between clock hands and find days/dates in calendar problems.',
        seo: {
            title: 'Clock and Calendar - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master clock angle formulas and calendar tricks for SSC CGL 2025.',
            keywords: ['clock calendar', 'clock angles', 'calendar reasoning', 'SSC CGL clock', 'day calculation']
        },
        difficulty: 'intermediate',
        questionsInExam: '1-2 questions per exam',
        phase: 4,
        order: 18,
        prerequisites: ['number-system']
    },
    {
        slug: 'matrix',
        name: 'Matrix',
        code: 'REAS_MAT',
        category: 'reasoning',
        icon: 'AppsIcon',
        description: 'Select the correct group of numbers based on matrix patterns.',
        seo: {
            title: 'Matrix Reasoning - Complete Guide for SSC CGL | PrepLeague',
            description: 'Master matrix pattern problems for SSC CGL 2025.',
            keywords: ['matrix reasoning', 'matrix patterns', 'number matrix', 'SSC CGL matrix']
        },
        difficulty: 'beginner',
        questionsInExam: '1 question per exam',
        phase: 1, // Moving Matrix to cluster 1 as it's number based
        order: 19,
        prerequisites: []
    }
];

// Combined all patterns
export const allPatterns: PatternInfo[] = [...quantPatterns, ...reasoningPatterns];

// Helper function to get pattern by slug
export function getPatternBySlug(slug: string): PatternInfo | undefined {
    return allPatterns.find(p => p.slug === slug);
}

// Helper function to get all slugs (for static generation)
export function getAllPatternSlugs(): string[] {
    return allPatterns.map(p => p.slug);
}
