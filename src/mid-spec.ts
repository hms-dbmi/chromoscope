import { SpecOption } from './main-spec';
import { SingleTrack, View } from 'gosling.js/dist/src/gosling-schema';
import tracks from './track';
import { driversToTsvUrl } from './utils';

export default function getMidView(option: SpecOption): View[] {
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
        baf,
        me,
        me2,
        pm,
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
                                ? // TODO: change to gosling's one
                                  'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation-hg19'
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
                        geneHeight: { value: 60 / 3.0 },
                        geneLabel: { field: 'name' },
                        geneLabelFontSize: { value: 60 / 3.0 },
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
                ...(!baf 
                    ? [] 
                    :[tracks.baf(id, baf, width, 240, 'mid')]),
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
                tracks.sv(id, sv, width, 250, 'mid', selectedSvId),
                ...(!me
                   ? []
                    : [tracks.mendelianErrors(id, me, me2, width, 60, 'mid', cnFields),
                        tracks.boundary('me', 'mid'),
                    ]),
                ...(!pm
                    ? []
                    : [tracks.parentMapping(id, pm, width, 40, 'mid'),
                        tracks.boundary('pm', 'mid'),
                    ]),
                
                // {
                //     id: `${id}-${'mid'}-sv`,
                //     data: {
                //         type: 'json',
                //         values: [
                //             { c: 'chr1', p1: 1, p2: 4000000000, v: 250 / 4 },
                //             { c: 'chr1', p1: 1, p2: 4000000000, v: (250 / 4) * 2 },
                //             { c: 'chr1', p1: 1, p2: 4000000000, v: (250 / 4) * 3 }
                //         ],
                //         chromosomeField: 'c',
                //         genomicFields: ['p1', 'p2']
                //     },
                //     mark: 'rule',
                //     x: { field: 'p1', type: 'genomic' },
                //     xe: { field: 'p2', type: 'genomic' },
                //     y: { field: 'v', type: 'quantitative', domain: [0, 250], axis: 'none' },
                //     strokeWidth: { value: 0.5 },
                //     color: { value: '#E3E3E3' },
                //     width,
                //     height: 250
                // },
                {
                    id: `${id}-mid-ideogram-bottom`,
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
                    x: { field: 'chromStart', type: 'genomic', axis: 'bottom' },
                    xe: { field: 'chromEnd', type: 'genomic' },
                    strokeWidth: { value: 0 },
                    width,
                    height: 18
                },
            ]
        }
    ];
}
