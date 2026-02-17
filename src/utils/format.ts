
export const formatTopicName = (slug: string): string => {
    if (!slug) return '';

    // Manual overrides for specific cases
    const overrides: Record<string, string> = {
        'profit_loss': 'Profit & Loss',
        'speed_distance_time': 'Speed, Distance & Time',
        'time_work': 'Time & Work',
        'simple_interest': 'Simple Interest',
        'compound_interest': 'Compound Interest',
        'ratio_proportion': 'Ratio & Proportion',
        'data_interpretation': 'Data Interpretation',
        'number_system': 'Number System',
        'mixture_alligation': 'Mixture & Alligation',
        'mathematical_operations': 'Mathematical Operations',
        'embedded_figures': 'Embedded Figures',
        'blood_relation': 'Blood Relation',
        'coding_decoding': 'Coding & Decoding'
    };

    if (overrides[slug]) return overrides[slug];

    // Fallback: Replace underscores with spaces and capitalize
    return slug
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const formatTime = (ms: number): string => {
    if (!ms || isNaN(ms)) return '-';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
};

export const formatDate = (dateString: string | Date): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
