function driver(sampleId, url, width, height, mode) {
    return {
        id: `${sampleId}-${mode}-driver`,
        title: 'Putative Driver',
        data: {
            url,
            type: 'csv',
            separator: '	',
            chromosomeField: 'chr',
            genomicFields: ['pos']
        },
        dataTransform: [
            {
                type: 'replace',
                field: 'biallelic',
                replace: [
                    { from: 'yes', to: '\u2299 ' },
                    { from: 'no', to: '\xB7 ' },
                    { from: 'Yes', to: '\u2299 ' },
                    { from: 'No', to: '\xB7 ' },
                    { from: void 0, to: '' }
                ],
                newField: 'prefix'
            },
            { type: 'concat', fields: ['prefix', 'gene'], newField: 'geneWithPrefix', separator: '' }
        ],
        mark: 'text',
        x: { field: 'pos', type: 'genomic' },
        text: { field: 'geneWithPrefix', type: 'nominal' },
        color: { value: 'black' },
        row: { field: 'row', type: 'nominal' },
        style: { textFontWeight: 'normal' },
        size: { value: mode === 'top' ? 10 : 14 },
        tooltip: [
            { field: 'pos', alt: 'Position', type: 'genomic' },
            { field: 'ref', alt: 'REF', type: 'nominal' },
            { field: 'alt', alt: 'ALT', type: 'nominal' },
            { field: 'category', alt: 'Category', type: 'nominal' },
            { field: 'top_category', alt: 'Top Category', type: 'nominal' },
            { field: 'biallelic', alt: 'Biallelic', type: 'nominal' },
            { field: 'transcript_consequence', alt: 'Transcript Consequence', type: 'nominal' },
            { field: 'protein_mutation', alt: 'Protein Mutation', type: 'nominal' },
            { field: 'allele_fraction', alt: 'Allele Fraction', type: 'nominal' },
            { field: 'mutation_type', alt: 'Mutation Type', type: 'nominal' }
        ],
        width,
        height
    };
}

function cnv(sampleId, cnvUrl, width, height, mode, cnFields = ['total_cn', 'major_cn', 'minor_cn']) {
    const [total_cn, major_cn, minor_cn] = cnFields;
    return {
        id: `${sampleId}-${mode}-cnv`,
        title: mode === 'small' ? '' : 'Copy Number Variants',
        style: { background: '#FFFFFF' },
        data: {
            separator: '	',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['start', 'end']
        },
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        alignment: 'overlay',
        tracks: [
            {
                y: { field: total_cn, type: 'quantitative', axis: 'right', grid: true, range: [0 + 10, height - 10] },
                color: { value: '#808080' }
            }
        ],
        tooltip: [
            { field: total_cn, type: 'quantitative' },
            { field: major_cn, type: 'quantitative' },
            { field: minor_cn, type: 'quantitative' }
        ],
        size: { value: 5 },
        stroke: { value: '#808080' },
        strokeWidth: { value: 1 },
        opacity: { value: 0.7 },
        width,
        height
    };
}

function coverage(option, isLeft) {
    const { id, bam, bai, width, svReads, crossChr, bpIntervals } = option;
    return {
        id: `${id}-bottom-${isLeft ? 'left' : 'right'}-coverage`,
        title: 'Coverage',
        data: {
            type: 'bam',
            url: bam,
            indexUrl: bai
        },
        dataTransform: [
            {
                type: 'coverage',
                startField: 'start',
                endField: 'end'
            }
        ],
        mark: 'bar',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        y: {
            field: 'coverage',
            type: 'quantitative',
            axis: 'right',
            grid: true
        },
        color: { value: 'lightgray' },
        stroke: { value: 'gray' },
        width,
        height: 80
    };
}

function gain(sampleId, cnvUrl, width, height, mode, cnFields = ['total_cn', 'major_cn', 'minor_cn']) {
    const [total_cn, major_cn, minor_cn] = cnFields;
    return {
        id: `${sampleId}-${mode}-gain`,
        title: mode === 'small' ? '' : 'Gain',
        style: { background: '#F6F6F6' },
        data: {
            separator: '	',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['start', 'end']
        },
        dataTransform: [
            {
                type: 'filter',
                field: total_cn,
                inRange: [5, 999]
            }
        ],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#5CB6EA' },
        width,
        height
    };
}

function loh(sampleId, cnvUrl, width, height, mode, cnFields = ['total_cn', 'major_cn', 'minor_cn']) {
    const [total_cn, major_cn, minor_cn] = cnFields;
    return {
        id: `${sampleId}-${mode}-loh`,
        title: mode !== 'small' ? 'Loss of Heterozygosity (LOH)' : '',
        style: { background: '#F6F6F6' },
        data: {
            separator: '	',
            url: cnvUrl,
            type: 'csv',
            chromosomeField: 'chromosome',
            genomicFields: ['start', 'end']
        },
        dataTransform: [
            { type: 'filter', field: minor_cn, inRange: [0, 0.01] },
            { type: 'filter', field: total_cn, oneOf: ['0'], not: true }
        ],
        mark: 'rect',
        x: { field: 'start', type: 'genomic' },
        xe: { field: 'end', type: 'genomic' },
        color: { value: '#D6641E' },
        width,
        height
    };
}

const consistentSv = {
    DUP: 'Duplication',
    TRA: 'Translocation',
    DEL: 'Deletion',
    t2tINV: 'Inversion (TtT)',
    h2hINV: 'Inversion (HtH)'
};

var defaultEncodings = {
    color: {
        svclass: {
            domain: ['Translocation', 'Duplication', 'Deletion', 'Inversion (TtT)', 'Inversion (HtH)'],
            range: ['lightgrey', '#409F7A', '#3275B4', '#CC7DAA', '#E6A01B'],
            Translocation: 'lightgrey',
            Duplication: '#409F7A',
            Deletion: '#3275B4',
            'Inversion (TtT)': '#CC7DAA',
            'Inversion (HtH)': '#E6A01B'
        }
    }
};

const TRI_SIZE = 5;
const svInfer = [
    {
        type: 'svType',
        firstBp: {
            chrField: 'chrom1',
            posField: 'start1',
            strandField: 'strand1'
        },
        secondBp: {
            chrField: 'chrom2',
            posField: 'start2',
            strandField: 'strand2'
        },
        newField: 'svclass'
    },
    {
        type: 'replace',
        field: 'svclass',
        replace: [
            ...Object.entries(consistentSv).map(([from, to]) => {
                return { from, to };
            })
        ],
        newField: 'svclass'
    }
];
function filterSv(oneOf, not) {
    return {
        type: 'filter',
        field: 'svclass',
        oneOf,
        not
    };
}
function sv(sampleId, url, width, height, mode, selectedSvId) {
    const _baselineYMap = {
        Translocation: { y: (height / 5) * 4, ye: height },
        Deletion: { y: height / 5, ye: 1 },
        Duplication: { y: height / 5, ye: (height / 5) * 2 },
        'Inversion (TtT)': { y: (height / 5) * 3, ye: (height / 5) * 2 },
        'Inversion (HtH)': { y: (height / 5) * 3, ye: (height / 5) * 4 }
    };
    const arcs = (sv2, selected) => {
        const { y, ye } = _baselineYMap[sv2];
        return {
            dataTransform: [
                ...svInfer,
                {
                    type: 'filter',
                    field: 'sv_id',
                    oneOf: [selectedSvId],
                    not: !selected
                },
                filterSv([sv2], false)
            ],
            x: { field: 'start1', type: 'genomic' },
            xe: { field: 'end2', type: 'genomic' },
            y: { value: y },
            ye: { value: ye },
            flipY: true,
            ...(selected ? { opacity: { value: 1 }, strokeWidth: { value: 2 } } : {}),
            ...(selected && sv2 === 'Translocation' ? { stroke: { value: 'grey' } } : {})
        };
    };
    const svs = [...defaultEncodings.color.svclass.domain];
    return {
        id: `${sampleId}-${mode}-sv`,
        alignment: 'overlay',
        experimental: {
            mouseEvents: {
                click: true,
                mouseOver: true,
                groupMarksByField: 'sv_id'
            },
            performanceMode: true
        },
        data: {
            url,
            type: 'csv',
            separator: '	',
            headerNames: [
                'chrom1',
                'start1',
                'end1',
                'chrom2',
                'start2',
                'end2',
                'sv_id',
                'pe_support',
                'strand1',
                'strand2'
            ],
            genomicFieldsToConvert: [
                {
                    chromosomeField: 'chrom1',
                    genomicFields: ['start1', 'end1']
                },
                {
                    chromosomeField: 'chrom2',
                    genomicFields: ['start2', 'end2']
                }
            ]
        },
        mark: 'withinLink',
        tracks: [
            ...svs.map(d => arcs(d, false)),
            ...svs.map(d => arcs(d, true)),
            ...(mode !== 'mid'
                ? []
                : [
                      {
                          dataTransform: [{ type: 'filter', field: 'strand1', oneOf: ['+'] }],
                          mark: 'triangleLeft',
                          x: { field: 'start1', type: 'genomic' },
                          size: { value: TRI_SIZE },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'right' }
                      },
                      {
                          dataTransform: [{ type: 'filter', field: 'strand1', oneOf: ['-'] }],
                          mark: 'triangleRight',
                          x: { field: 'start1', type: 'genomic' },
                          size: { value: TRI_SIZE },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'left' }
                      },
                      {
                          dataTransform: [{ type: 'filter', field: 'strand2', oneOf: ['+'] }],
                          mark: 'triangleLeft',
                          x: { field: 'end2', type: 'genomic' },
                          size: { value: TRI_SIZE },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'right' }
                      },
                      {
                          dataTransform: [{ type: 'filter', field: 'strand2', oneOf: ['-'] }],
                          mark: 'triangleRight',
                          x: { field: 'end2', type: 'genomic' },
                          size: { value: TRI_SIZE },
                          y: { value: height },
                          stroke: { value: 0 },
                          style: { align: 'left' }
                      }
                  ]),
            ...(mode !== 'mid'
                ? []
                : [
                      {
                          dataTransform: [...svInfer, { type: 'filter', field: 'sv_id', oneOf: [selectedSvId] }],
                          mark: 'rule',
                          x: { field: 'start1', type: 'genomic' },
                          color: { value: 'black' },
                          strokeWidth: { value: 1 },
                          opacity: { value: 1 },
                          style: { dashed: [3, 3] }
                      },
                      {
                          dataTransform: [...svInfer, { type: 'filter', field: 'sv_id', oneOf: [selectedSvId] }],
                          mark: 'rule',
                          x: { field: 'end2', type: 'genomic' },
                          color: { value: 'black' },
                          strokeWidth: { value: 1 },
                          opacity: { value: 1 },
                          style: { dashed: [3, 3] }
                      }
                  ])
        ],
        y: { value: height / 5 },
        color: {
            field: 'svclass',
            type: 'nominal',
            legend: mode !== 'small',
            domain: ['Gain', 'LOH', ...defaultEncodings.color.svclass.domain],
            range: ['#5CB6EA', '#D6641E', ...defaultEncodings.color.svclass.range]
        },
        stroke: {
            field: 'svclass',
            type: 'nominal',
            domain: defaultEncodings.color.svclass.domain,
            range: defaultEncodings.color.svclass.range
        },
        strokeWidth: { value: 1 },
        opacity: { value: 0.7 },
        tooltip: [
            { field: 'start1', type: 'genomic' },
            { field: 'end2', type: 'genomic' },
            { field: 'strand1', type: 'nominal' },
            { field: 'strand2', type: 'nominal' },
            { field: 'svclass', type: 'nominal' },
            { field: 'sv_id', type: 'nominal' },
            { field: 'pe_support', type: 'nominal' }
        ],
        style: {
            linkStyle: 'elliptical',
            linkMinHeight: 0.7,
            mouseOver: { stroke: '#242424', strokeWidth: 1 },
            withinLinkVerticalLines: true
        },
        width,
        height
    };
}

function mutation(sampleId, url, indexUrl, width, height, mode) {
    return {
        id: `${sampleId}-${mode}-mutation`,
        title: 'Point Mutation',
        style: { background: '#FFFFFF', inlineLegend: true },
        data: {
            type: 'vcf',
            url,
            indexUrl,
            sampleLength: 500
        },
        dataTransform: [{ field: 'DISTPREV', type: 'filter', oneOf: [0], not: true }],
        mark: 'point',
        x: { field: 'POS', type: 'genomic' },
        color: { field: 'SUBTYPE', type: 'nominal', legend: true, domain: ['C>A', 'C>G', 'C>T', 'T>A', 'T>C', 'T>G'] },
        y: { field: 'DISTPREVLOGE', type: 'quantitative', axis: 'left', range: [10, height - 10] },
        opacity: { value: 0.9 },
        tooltip: [
            { field: 'DISTPREV', type: 'nominal', format: 's1', alt: 'Distance To Previous Mutation (BP)' },
            { field: 'POS', type: 'genomic' },
            { field: 'SUBTYPE', type: 'nominal' }
        ],
        width,
        height
    };
}

function indel(sampleId, url, indexUrl, width, height, mode) {
    return {
        id: `${sampleId}-${mode}-indel`,
        style: { background: '#F6F6F6' },
        data: {
            url,
            indexUrl,
            type: 'vcf',
            sampleLength: 500
        },
        dataTransform: [
            {
                type: 'concat',
                fields: ['REF', 'ALT'],
                separator: ' \u2192 ',
                newField: 'LAB'
            },
            {
                type: 'replace',
                field: 'MUTTYPE',
                replace: [
                    { from: 'insertion', to: 'Insertion' },
                    { from: 'deletion', to: 'Deletion' }
                ],
                newField: 'MUTTYPE'
            }
        ],
        alignment: 'overlay',
        tracks: [
            {
                size: { value: height / 2 - 1 },
                visibility: [
                    {
                        target: 'track',
                        operation: 'GT',
                        measure: 'zoomLevel',
                        threshold: 1e3
                    }
                ]
            },
            {
                xe: { field: 'POSEND', type: 'genomic', axis: 'top' },
                visibility: [
                    {
                        target: 'track',
                        operation: 'LTET',
                        measure: 'zoomLevel',
                        threshold: 1e3
                    }
                ]
            }
        ],
        mark: 'rect',
        x: { field: 'POS', type: 'genomic' },
        color: {
            field: 'MUTTYPE',
            type: 'nominal',
            legend: false,
            domain: ['Insertion', 'Deletion']
        },
        row: {
            field: 'MUTTYPE',
            type: 'nominal',
            legend: true,
            domain: ['Insertion', 'Deletion']
        },
        tooltip: [
            { field: 'POS', type: 'genomic' },
            { field: 'POSEND', type: 'genomic' },
            { field: 'MUTTYPE', type: 'nominal' },
            { field: 'ALT', type: 'nominal' },
            { field: 'REF', type: 'nominal' },
            { field: 'QUAL', type: 'quantitative' }
        ],
        opacity: { value: 0.9 },
        width,
        height
    };
}

const hex = 'lightgray';
function boundary(parent, mode) {
    return {
        id: `${parent}-${mode}-boundary`,
        data: {
            type: 'json',
            chromosomeField: 'c',
            genomicFields: ['p'],
            values: [
                { c: 'chr2', p: 0 },
                { c: 'chr3', p: 0 },
                { c: 'chr4', p: 0 },
                { c: 'chr5', p: 0 },
                { c: 'chr6', p: 0 },
                { c: 'chr7', p: 0 },
                { c: 'chr8', p: 0 },
                { c: 'chr9', p: 0 },
                { c: 'chr10', p: 0 },
                { c: 'chr11', p: 0 },
                { c: 'chr12', p: 0 },
                { c: 'chr13', p: 0 },
                { c: 'chr14', p: 0 },
                { c: 'chr15', p: 0 },
                { c: 'chr16', p: 0 },
                { c: 'chr17', p: 0 },
                { c: 'chr18', p: 0 },
                { c: 'chr19', p: 0 },
                { c: 'chr20', p: 0 },
                { c: 'chr21', p: 0 },
                { c: 'chrX', p: 0 },
                { c: 'chrY', p: 0 }
            ]
        },
        mark: mode === 'mid' ? 'rule' : 'rect',
        x: { field: 'p', type: 'genomic' },
        color: { value: hex },
        opacity: { value: 0.5 },
        overlayOnPreviousTrack: true
    };
}

var tracks = {
    driver,
    cnv,
    coverage,
    gain,
    loh,
    sv,
    mutation,
    indel,
    boundary
};

function driversToTsvUrl(drivers) {
    if (typeof drivers === 'string') return drivers;
    const keys = [];
    drivers.forEach(d => keys.push(...Object.keys(d)));
    const uniqueKeys = Array.from(new Set(keys));
    const text = [uniqueKeys.join('	'), ...drivers.map(d => uniqueKeys.map(k => d[k]).join('	'))].join('\n');
    const tsv = new Blob([text], { type: 'text/tsv' });
    const url = URL.createObjectURL(tsv);
    return url;
}

function getMidView(option) {
    const {
        id,
        assembly,
        xDomain,
        vcf,
        vcfIndex,
        vcf2,
        vcf2Index,
        cnv,
        sv,
        width,
        showPutativeDriver,
        showOverview,
        xOffset,
        selectedSvId,
        drivers,
        cnFields
    } = option;
    return [
        {
            linkingId: 'mid-scale',
            xDomain: xDomain ? { interval: xDomain } : { chromosome: 'chr1' },
            layout: 'linear',
            tracks: [
                {
                    id: `${id}-mid-ideogram`,
                    alignment: 'overlay',
                    data: {
                        url:
                            assembly === 'hg38'
                                ? 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv'
                                : 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG19.Human.CytoBandIdeogram.csv',
                        type: 'csv',
                        chromosomeField: 'Chromosome',
                        genomicFields: ['chromStart', 'chromEnd']
                    },
                    tracks: [
                        {
                            mark: 'rect',
                            dataTransform: [
                                {
                                    type: 'filter',
                                    field: 'Stain',
                                    oneOf: ['acen'],
                                    not: true
                                }
                            ]
                        },
                        {
                            mark: 'triangleRight',
                            dataTransform: [
                                { type: 'filter', field: 'Stain', oneOf: ['acen'] },
                                { type: 'filter', field: 'Name', include: 'q' }
                            ]
                        },
                        {
                            mark: 'triangleLeft',
                            dataTransform: [
                                { type: 'filter', field: 'Stain', oneOf: ['acen'] },
                                { type: 'filter', field: 'Name', include: 'p' }
                            ]
                        }
                    ],
                    color: {
                        field: 'Stain',
                        type: 'nominal',
                        domain: ['gneg', 'gpos25', 'gpos50', 'gpos75', 'gpos100', 'gvar', 'acen'],
                        range: ['white', 'lightgray', 'gray', 'gray', 'black', '#7B9CC8', '#DC4542']
                    },
                    size: { value: 18 },
                    x: { field: 'chromStart', type: 'genomic' },
                    xe: { field: 'chromEnd', type: 'genomic' },
                    strokeWidth: { value: 0 },
                    width,
                    height: 18
                },
                tracks.driver(id, driversToTsvUrl(drivers), width, 40, 'mid'),
                tracks.boundary('driver', 'mid'),
                {
                    id: `${id}-mid-gene`,
                    template: 'gene',
                    data: {
                        url:
                            assembly === 'hg19'
                                ? 'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation-hg19'
                                : 'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation',
                        type: 'beddb',
                        genomicFields: [
                            { index: 1, name: 'start' },
                            { index: 2, name: 'end' }
                        ],
                        valueFields: [
                            { index: 5, name: 'strand', type: 'nominal' },
                            { index: 3, name: 'name', type: 'nominal' }
                        ],
                        exonIntervalFields: [
                            { index: 12, name: 'start' },
                            { index: 13, name: 'end' }
                        ]
                    },
                    encoding: {
                        startPosition: { field: 'start' },
                        endPosition: { field: 'end' },
                        strandColor: { field: 'strand', range: ['gray'] },
                        strandRow: { field: 'strand' },
                        opacity: { value: 0.4 },
                        geneHeight: { value: 60 / 3 },
                        geneLabel: { field: 'name' },
                        geneLabelFontSize: { value: 60 / 3 },
                        geneLabelColor: { field: 'strand', range: ['black'] },
                        geneLabelStroke: { value: 'white' },
                        geneLabelStrokeThickness: { value: 4 },
                        geneLabelOpacity: { value: 1 },
                        type: { field: 'type' }
                    },
                    tooltip: [
                        { field: 'name', type: 'nominal' },
                        { field: 'strand', type: 'nominal' }
                    ],
                    width,
                    height: 60
                },
                ...(!vcf
                    ? []
                    : [tracks.mutation(id, vcf, vcfIndex, width, 60, 'mid'), tracks.boundary('mutation', 'mid')]),
                ...(!vcf2
                    ? []
                    : [tracks.indel(id, vcf2, vcf2Index, width, 40, 'mid'), tracks.boundary('indel', 'mid')]),
                tracks.cnv(id, cnv, width, 60, 'mid', cnFields),
                tracks.boundary('cnv', 'mid'),
                tracks.gain(id, cnv, width, 20, 'mid', cnFields),
                tracks.boundary('gain', 'mid'),
                tracks.loh(id, cnv, width, 20, 'mid', cnFields),
                tracks.boundary('loh', 'mid'),
                tracks.sv(id, sv, width, 250, 'mid', selectedSvId)
            ]
        }
    ];
}

function drawSvReads(option, sv) {
    const { svReads } = option;
    return [
        {
            dataTransform: [
                {
                    type: 'displace',
                    method: 'pile',
                    boundingBox: {
                        startField: 'start',
                        endField: 'end',
                        padding: 5,
                        isPaddingBP: true
                    },
                    newField: 'pileup-row',
                    maxRows: 300
                },
                {
                    type: 'filter',
                    field: 'name',
                    oneOf: svReads.filter(d => d.type === sv).map(d => d.name)
                }
            ],
            color: { value: defaultEncodings.color.svclass[sv] },
            x: { field: 'start', type: 'genomic' },
            xe: { field: 'end', type: 'genomic' }
        },
        {
            dataTransform: [
                {
                    type: 'displace',
                    method: 'pile',
                    boundingBox: {
                        startField: 'start',
                        endField: 'end',
                        padding: 5,
                        isPaddingBP: true
                    },
                    newField: 'pileup-row',
                    maxRows: 300
                },
                {
                    type: 'filter',
                    field: 'name',
                    oneOf: svReads.filter(d => d.type === sv).map(d => d.name)
                },
                {
                    type: 'filter',
                    field: 'strand',
                    oneOf: ['+']
                }
            ],
            mark: 'triangleRight',
            color: { value: defaultEncodings.color.svclass[sv] },
            x: { field: 'end', type: 'genomic' }
        },
        {
            dataTransform: [
                {
                    type: 'displace',
                    method: 'pile',
                    boundingBox: {
                        startField: 'start',
                        endField: 'end',
                        padding: 5,
                        isPaddingBP: true
                    },
                    newField: 'pileup-row',
                    maxRows: 300
                },
                {
                    type: 'filter',
                    field: 'name',
                    oneOf: svReads.filter(d => d.type === sv).map(d => d.name)
                },
                {
                    type: 'filter',
                    field: 'strand',
                    oneOf: ['-']
                }
            ],
            mark: 'triangleLeft',
            color: { value: defaultEncodings.color.svclass[sv] },
            x: { field: 'start', type: 'genomic' },
            style: { align: 'right' }
        }
    ];
}
function alignment(option, isLeft) {
    const { id, bam, bai, width, svReads, crossChr, bpIntervals } = option;
    return {
        id: `${id}-bottom-${isLeft ? 'left' : 'right'}-bam`,
        alignment: 'overlay',
        title: 'Alignment',
        data: { type: 'bam', url: bam, indexUrl: bai, loadMates: false },
        mark: 'rect',
        experimental: {
            mouseEvents: { mouseOver: true, groupMarksByField: 'id' }
        },
        tracks: [
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    }
                ],
                color: { value: '#E5E5E5' },
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'strand',
                        oneOf: ['+']
                    }
                ],
                mark: 'triangleRight',
                color: { value: '#E5E5E5' },
                x: { field: 'end', type: 'genomic' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'filter',
                        field: 'strand',
                        oneOf: ['-']
                    }
                ],
                mark: 'triangleLeft',
                color: { value: '#E5E5E5' },
                x: { field: 'start', type: 'genomic' },
                style: { align: 'right' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'subjson',
                        field: 'substitutions',
                        genomicField: 'pos',
                        baseGenomicField: 'start',
                        genomicLengthField: 'length'
                    },
                    { type: 'filter', field: 'type', oneOf: ['A', 'T', 'G', 'C', 'X', 'I', 'D'] }
                ],
                x: { field: 'pos_start', type: 'genomic' },
                xe: { field: 'pos_end', type: 'genomic' },
                color: {
                    field: 'variant',
                    type: 'nominal',
                    domain: ['A', 'T', 'G', 'C', 'X', 'I', 'D'],
                    legend: true
                }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'subjson',
                        field: 'substitutions',
                        genomicField: 'pos',
                        baseGenomicField: 'start',
                        genomicLengthField: 'length'
                    },
                    { type: 'filter', field: 'type', oneOf: ['S', 'H'] }
                ],
                x: { field: 'pos_start', type: 'genomic' },
                xe: { field: 'pos_end', type: 'genomic' },
                color: { value: '#414141' },
                opacity: { value: 1 }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'subjson',
                        field: 'substitutions',
                        genomicField: 'pos',
                        baseGenomicField: 'start',
                        genomicLengthField: 'length'
                    },
                    { type: 'filter', field: 'type', oneOf: ['S', 'H'] },
                    {
                        type: 'filter',
                        field: 'substitutions',
                        include: '-',
                        not: true
                    },
                    {
                        type: 'filter',
                        field: 'strand',
                        oneOf: ['-']
                    }
                ],
                mark: 'triangleLeft',
                x: { field: 'pos_start', type: 'genomic' },
                color: { value: '#414141' },
                opacity: { value: 1 },
                style: { align: 'right' }
            },
            {
                dataTransform: [
                    {
                        type: 'displace',
                        method: 'pile',
                        boundingBox: {
                            startField: 'start',
                            endField: 'end',
                            padding: 5,
                            isPaddingBP: true
                        },
                        newField: 'pileup-row',
                        maxRows: 300
                    },
                    {
                        type: 'subjson',
                        field: 'substitutions',
                        genomicField: 'pos',
                        baseGenomicField: 'start',
                        genomicLengthField: 'length'
                    },
                    { type: 'filter', field: 'type', oneOf: ['S', 'H'] },
                    {
                        type: 'filter',
                        field: 'substitutions',
                        include: '-',
                        not: false
                    },
                    {
                        type: 'filter',
                        field: 'strand',
                        oneOf: ['+']
                    }
                ],
                mark: 'triangleRight',
                x: { field: 'pos_end', type: 'genomic' },
                color: { value: '#414141' },
                opacity: { value: 1 }
            },
            ...drawSvReads(option, 'Translocation'),
            ...drawSvReads(option, 'Deletion'),
            ...drawSvReads(option, 'Inversion (TtT)'),
            ...drawSvReads(option, 'Inversion (HtH)'),
            ...drawSvReads(option, 'Duplication')
        ],
        row: { field: 'pileup-row', type: 'nominal', padding: 0.2 },
        tooltip: [
            { field: 'id', type: 'nominal' },
            { field: 'name', type: 'nominal' },
            { field: 'start', type: 'genomic' },
            { field: 'end', type: 'genomic' },
            { field: 'cigar', type: 'nominal' },
            { field: 'strand', type: 'nominal' },
            { field: 'mapq', type: 'quantitative', alt: 'Mapping Quality (MAPQ)' },
            { field: 'substitutions', type: 'nominal' }
        ],
        style: { outlineWidth: 0.5, mouseOver: { stroke: 'black' } },
        width,
        height: 500
    };
}

function verticalGuide(start, end) {
    return {
        style: { dashed: [3, 3] },
        data: {
            type: 'json',
            values: [
                {
                    chr: 'chr1',
                    p: start
                },
                {
                    chr: 'chr1',
                    p: end
                }
            ],
            chromosomeField: 'chr',
            genomicFields: ['p']
        },
        mark: 'rule',
        x: { field: 'p', type: 'genomic' },
        color: { value: 'black' },
        strokeWidth: { value: 1 },
        overlayOnPreviousTrack: true
    };
}

function generateSpec(opt) {
    const { assembly, id, bam, bai, width, selectedSvId, breakpoints, bpIntervals } = opt;
    const topViewWidth = Math.min(width, 600);
    const midViewWidth = width;
    const bottomViewGap = 19;
    const bottomViewWidth = width / 2 - bottomViewGap / 2;
    const topViewXOffset = (width - topViewWidth) / 2;
    return {
        layout: 'linear',
        arrangement: 'vertical',
        centerRadius: 0.5,
        assembly,
        spacing: 40,
        style: {
            outlineWidth: 1,
            outline: 'lightgray',
            enableSmoothPath: false
        },
        views: [
            {
                arrangement: 'vertical',
                views: [
                    ...getOverviewSpec({
                        ...opt,
                        width: topViewWidth,
                        xOffset: topViewXOffset
                    }),
                    ...getMidView({
                        ...opt,
                        width: midViewWidth
                    })
                ]
            },
            ...(selectedSvId === ''
                ? []
                : [
                      {
                          arrangement: 'horizontal',
                          spacing: bottomViewGap,
                          views: [
                              {
                                  static: false,
                                  zoomLimits: [50, 1e3],
                                  layout: 'linear',
                                  centerRadius: 0.05,
                                  xDomain: { interval: [breakpoints[0], breakpoints[1]] },
                                  spacing: 0.01,
                                  linkingId: 'detail-scale-1',
                                  tracks: [
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...tracks.coverage({ ...opt, width: bottomViewWidth }, true)
                                                },
                                                ...(bpIntervals ? [verticalGuide(bpIntervals[0], bpIntervals[1])] : [])
                                            ]
                                          : []),
                                      {
                                          id: `${id}-bottom-left-sequence`,
                                          title: 'Sequence',
                                          alignment: 'overlay',
                                          data: {
                                              url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=sequence-multivec',
                                              type: 'multivec',
                                              row: 'base',
                                              column: 'position',
                                              value: 'count',
                                              categories: ['A', 'T', 'G', 'C'],
                                              start: 'start',
                                              end: 'end'
                                          },
                                          tracks: [
                                              {
                                                  mark: 'bar',
                                                  y: {
                                                      field: 'count',
                                                      type: 'quantitative',
                                                      axis: 'none'
                                                  }
                                              },
                                              {
                                                  dataTransform: [
                                                      {
                                                          type: 'filter',
                                                          field: 'count',
                                                          oneOf: [0],
                                                          not: true
                                                      }
                                                  ],
                                                  mark: 'text',
                                                  x: { field: 'start', type: 'genomic' },
                                                  xe: { field: 'end', type: 'genomic' },
                                                  size: { value: 24 },
                                                  color: { value: 'white' },
                                                  visibility: [
                                                      {
                                                          operation: 'less-than',
                                                          measure: 'width',
                                                          threshold: '|xe-x|',
                                                          transitionPadding: 30,
                                                          target: 'mark'
                                                      },
                                                      {
                                                          operation: 'LT',
                                                          measure: 'zoomLevel',
                                                          threshold: 10,
                                                          target: 'track'
                                                      }
                                                  ]
                                              }
                                          ],
                                          x: { field: 'position', type: 'genomic' },
                                          color: {
                                              field: 'base',
                                              type: 'nominal',
                                              domain: ['A', 'T', 'G', 'C'],
                                              legend: true
                                          },
                                          text: { field: 'base', type: 'nominal' },
                                          style: { inlineLegend: true },
                                          width: bottomViewWidth,
                                          height: 40
                                      },
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...alignment({ ...opt, width: bottomViewWidth }, true)
                                                }
                                            ]
                                          : []),
                                      ...(bpIntervals ? [verticalGuide(bpIntervals[0], bpIntervals[1])] : [])
                                  ]
                              },
                              {
                                  static: false,
                                  zoomLimits: [50, 1e3],
                                  layout: 'linear',
                                  centerRadius: 0.05,
                                  xDomain: { interval: [breakpoints[2], breakpoints[3]] },
                                  spacing: 0.01,
                                  linkingId: 'detail-scale-2',
                                  tracks: [
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...tracks.coverage({ ...opt, width: bottomViewWidth }, false)
                                                },
                                                ...(bpIntervals ? [verticalGuide(bpIntervals[2], bpIntervals[3])] : [])
                                            ]
                                          : []),
                                      {
                                          id: `${id}-bottom-right-sequence`,
                                          title: 'Sequence',
                                          alignment: 'overlay',
                                          data: {
                                              url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=sequence-multivec',
                                              type: 'multivec',
                                              row: 'base',
                                              column: 'position',
                                              value: 'count',
                                              categories: ['A', 'T', 'G', 'C'],
                                              start: 'start',
                                              end: 'end'
                                          },
                                          tracks: [
                                              {
                                                  mark: 'bar',
                                                  y: {
                                                      field: 'count',
                                                      type: 'quantitative',
                                                      axis: 'none'
                                                  }
                                              },
                                              {
                                                  dataTransform: [
                                                      {
                                                          type: 'filter',
                                                          field: 'count',
                                                          oneOf: [0],
                                                          not: true
                                                      }
                                                  ],
                                                  mark: 'text',
                                                  x: { field: 'start', type: 'genomic' },
                                                  xe: { field: 'end', type: 'genomic' },
                                                  size: { value: 24 },
                                                  color: { value: 'white' },
                                                  visibility: [
                                                      {
                                                          operation: 'less-than',
                                                          measure: 'width',
                                                          threshold: '|xe-x|',
                                                          transitionPadding: 30,
                                                          target: 'mark'
                                                      },
                                                      {
                                                          operation: 'LT',
                                                          measure: 'zoomLevel',
                                                          threshold: 10,
                                                          target: 'track'
                                                      }
                                                  ]
                                              }
                                          ],
                                          x: { field: 'position', type: 'genomic' },
                                          color: {
                                              field: 'base',
                                              type: 'nominal',
                                              domain: ['A', 'T', 'G', 'C'],
                                              legend: true
                                          },
                                          text: { field: 'base', type: 'nominal' },
                                          style: { inlineLegend: true },
                                          width: bottomViewWidth,
                                          height: 40
                                      },
                                      ...(opt.bam && opt.bai
                                          ? [
                                                {
                                                    ...alignment({ ...opt, width: bottomViewWidth }, false)
                                                }
                                            ]
                                          : []),
                                      ...(bpIntervals ? [verticalGuide(bpIntervals[2], bpIntervals[3])] : [])
                                  ]
                              }
                          ]
                      }
                  ])
        ]
    };
}
function getOverviewSpec(option) {
    const { assembly, id, cnv, sv, width, showPutativeDriver, showOverview, selectedSvId, xOffset, drivers, cnFields } =
        option;
    if (!showOverview) return [];
    return [
        {
            xOffset,
            static: true,
            layout: 'circular',
            spacing: 1,
            style: {
                outlineWidth: 1,
                outline: 'lightgray'
            },
            tracks: [
                {
                    id: `${id}-top-ideogram`,
                    alignment: 'overlay',
                    data: {
                        url:
                            assembly === 'hg38'
                                ? 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv'
                                : 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG19.Human.CytoBandIdeogram.csv',
                        type: 'csv',
                        chromosomeField: 'Chromosome',
                        genomicFields: ['chromStart', 'chromEnd']
                    },
                    tracks: [
                        { mark: 'rect' },
                        {
                            mark: 'brush',
                            x: { linkingId: 'mid-scale' },
                            strokeWidth: { value: 1 },
                            stroke: { value: '#0070DC' },
                            color: { value: '#AFD8FF' },
                            opacity: { value: 0.5 }
                        }
                    ],
                    color: {
                        field: 'Stain',
                        type: 'nominal',
                        domain: ['gneg', 'gpos25', 'gpos50', 'gpos75', 'gpos100', 'gvar', 'acen'],
                        range: ['white', 'lightgray', 'gray', 'gray', 'black', '#7B9CC8', '#DC4542']
                    },
                    size: { value: 18 },
                    x: { field: 'chromStart', type: 'genomic' },
                    xe: { field: 'chromEnd', type: 'genomic' },
                    strokeWidth: { value: 0 },
                    width,
                    height: 100
                },
                tracks.driver(id, driversToTsvUrl(drivers), width, 40, 'top'),
                tracks.boundary('driver', 'top'),
                tracks.gain(id, cnv, width, 40, 'top', cnFields),
                tracks.boundary('gain', 'top'),
                tracks.loh(id, cnv, width, 40, 'top', cnFields),
                tracks.boundary('loh', 'top'),
                tracks.sv(id, sv, width, 80, 'top', selectedSvId)
            ]
        }
    ];
}

export { generateSpec };
//# sourceMappingURL=chromoscope.es.js.map
