import { OverlaidTracks } from 'gosling.js/dist/src/gosling-schema';
import { TrackMode } from './index';

export default function mutation(
    sampleId: string,
    url: string,
    indexUrl: string,
    width: number,
    height: number,
    mode: TrackMode,
    selectedMutationAbsPos: number
): OverlaidTracks {
    return {
        id: `${sampleId}-${mode}-mutation`,
        title: '  Point Mutation',
        style: { background: '#FFFFFF', inlineLegend: true },
        data: {
            type: 'vcf',
            url,
            indexUrl,
            sampleLength: 500
        },
        alignment: 'overlay',
        dataTransform: [{ field: 'DISTPREV', type: 'filter', oneOf: [0], not: true }],
        tracks: [
            {
                dataTransform: [{ field: 'DISTPREV', type: 'filter', oneOf: [0], not: true }]
            },
            {
                dataTransform: [{ field: 'POS', type: 'filter', oneOf: [selectedMutationAbsPos] }],
                stroke: {
                    field: 'SUBTYPE',
                    type: 'nominal',
                    legend: true,
                    domain: ['C>A', 'C>G', 'C>T', 'T>A', 'T>C', 'T>G']
                },
                strokeWidth: { value: 10 },
                opacity: { value: 0.3 }
            }
        ],
        mark: 'point',
        x: { field: 'POS', type: 'genomic' },
        color: { field: 'SUBTYPE', type: 'nominal', legend: true, domain: ['C>A', 'C>G', 'C>T', 'T>A', 'T>C', 'T>G'] },
        y: { field: 'DISTPREVLOGE', type: 'quantitative', axis: 'right', range: [10, height - 10] },
        opacity: { value: 0.9 },
        tooltip: [
            { field: 'DISTPREV', type: 'nominal', format: 's1', alt: 'Distance To Previous Mutation (BP)' },
            { field: 'POS', type: 'genomic' },
            { field: 'SUBTYPE', type: 'nominal' },
            { field: 'REF', type: 'nominal' },
            { field: 'ALT', type: 'nominal' }
        ],
        width,
        height
    };
}
