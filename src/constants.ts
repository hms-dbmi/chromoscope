import { ThemeDeep } from 'gosling.js/dist/src/core/utils/theme';

// Zooming variables
export const ZOOM_PADDING = 200;
export const ZOOM_DURATION = 500;

// Spacing variables
export const SCROLL_BAR_WIDTH = 12;
export const GOSLING_VIS_COMPONENT_PADDING = 3;
export const CLINICAL_PANEL_OPEN_WIDTH = 250;
export const CLINICAL_PANEL_CLOSED_WIDTH = 45;

// Copy variables
export const FEEDBACK_EMAIL_ADDRESS = 'dominik_glodzik@hms.harvard.edu';

export const consistentSv = {
    DUP: 'Duplication',
    TRA: 'Translocation',
    DEL: 'Deletion',
    t2tINV: 'Inversion (TtT)',
    h2hINV: 'Inversion (HtH)'
};

export const WHOLE_CHROMOSOME_STR = 'Whole Genome';

export const CHROMOSOMES = [
    'chr1',
    'chr2',
    'chr3',
    'chr4',
    'chr5',
    'chr6',
    'chr7',
    'chr8',
    'chr9',
    'chr10',
    'chr11',
    'chr12',
    'chr13',
    'chr14',
    'chr15',
    'chr16',
    'chr17',
    'chr18',
    'chr19',
    'chr20',
    'chr21',
    'chr22',
    'chrX',
    'chrY'
];

export const THEME: ThemeDeep = {
    base: 'light',
    root: {
        background: 'white',
        titleAlign: 'middle',
        titleColor: 'black',
        titleFontSize: 18,
        titleFontFamily: 'Arial',
        titleFontWeight: 'normal',
        subtitleAlign: 'middle',
        subtitleColor: 'gray',
        subtitleFontSize: 14,
        subtitleFontWeight: 'normal',
        subtitleFontFamily: 'Arial'
    },
    legend: {
        labelFontFamily: 'Arial'
    },
    axis: {
        labelFontFamily: 'Arial',
        labelFontSize: 14
    }
} as const;
